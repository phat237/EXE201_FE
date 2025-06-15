import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Switch,
  Image,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createProductApi,
  fetchAllProductsPaginated,
} from "../../../store/slices/productSlice";
import AdminSearchSort from "../../../components/Admin/AdminSearchSort";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Vui lòng nhập tên sản phẩm")
    .min(3, "Tên sản phẩm phải có ít nhất 3 ký tự"),
  brandName: Yup.string()
    .required("Vui lòng nhập tên thương hiệu")
    .min(2, "Tên thương hiệu phải có ít nhất 2 ký tự"),
  sourceUrl: Yup.string()
    .required("Vui lòng nhập URL nguồn")
    .url("URL không hợp lệ"),
  category: Yup.string().required("Vui lòng chọn danh mục"),
});

const categoryOptions = [
  { value: "DIEN_THOAI", label: "Điện thoại" },
  { value: "LAPTOP", label: "Laptop" },
  { value: "MAY_TINH", label: "Máy tính" },
  { value: "DIEN_TU_GIA_DUNG", label: "Điện tử gia dụng" },
  { value: "PHU_KIEN_CONG_NGHE", label: "Phụ kiện công nghệ" },
  { value: "THOI_TRANG", label: "Thời trang" },
  { value: "MY_PHAM_LAM_DEP", label: "Mỹ phẩm làm đẹp" },
  { value: "ME_VA_BE", label: "Mẹ và bé" },
  { value: "THUC_PHAM_DO_UONG", label: "Thực phẩm đồ uống" },
  { value: "SACH_VO", label: "Sách vở" },
  { value: "VAN_PHONG_PHAM", label: "Văn phòng phẩm" },
  { value: "NOI_THAT_TRANG_TRI", label: "Nội thất trang trí" },
  { value: "XE_CO_PHU_TUNG", label: "Xe cộ phụ tùng" },
  { value: "DICH_VU", label: "Dịch vụ" },
  { value: "KHAC", label: "Khác" },
];

const baseColumns = [
  { title: "ID", dataIndex: "key", key: "key", width: 60 },
  { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
  {
    title: "Tên thương hiệu",
    dataIndex: "brandName",
    key: "brandName",
  },
  {
    title: "Thời gian tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => new Date(date).toLocaleDateString(),
  },
  { title: "Danh mục", dataIndex: "category", key: "category" },
];

const imageColumn = {
  title: "Hình ảnh",
  dataIndex: "image",
  key: "image",
  render: (img) => <Image src={img} width={60} alt="product" />,
};

const Products = () => {
  const [showImage, setShowImage] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const dispatch = useDispatch();
  const { allProducts, isLoading, error } = useSelector((state) => state.product);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { name: "", brandName: "", sourceUrl: "", category: "" },
  });

  const columns = showImage ? [...baseColumns, imageColumn] : baseColumns;

  const sortOptions = [
    { value: "name", label: "Tên sản phẩm" },
    { value: "brandName", label: "Tên thương hiệu" },
    { value: "createdAt", label: "Thời gian tạo" },
    { value: "category", label: "Danh mục" },
  ];

  const fetchProducts = () => {
    dispatch(fetchAllProductsPaginated({
      page: 0,
      size: 1000,
      search: searchTerm,
      sortBy: sortBy,
      sortOrder: sortOrder,
    }));
  };

  useEffect(() => {
    fetchProducts();
  }, [dispatch, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    if (error) {
      message.error(error.message || "Có lỗi xảy ra!");
    }
  }, [error]);

  const onSubmit = async (formData) => {
    const { category, ...data } = formData;
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser?.token) {
      message.error("Vui lòng đăng nhập để thêm sản phẩm!");
      return;
    }

    try {
      await dispatch(createProductApi({ data, category })).unwrap();
      message.success("Thêm sản phẩm thành công!");
      setIsModalOpen(false);
      reset();
      fetchProducts();
    } catch (err) {
      message.error(err.message || "Thêm sản phẩm thất bại!");
      console.error("Submit error:", err);
    }
  };

  const dataSource = allProducts.map((item, index) => ({
    key: item.id || index,
    name: item.name,
    brandName: item.brandName,
    createdAt: item.createdAt,
    category: item.category,
    image: item.image || item.sourceUrl,
  }));

  return (
    <div>
      <h2>Products Management Page</h2>
      <AdminSearchSort
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        sortOptions={sortOptions}
      />
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <Switch
            checked={showImage}
            onChange={setShowImage}
            checkedChildren="Hiện hình ảnh"
            unCheckedChildren="Ẩn hình ảnh"
          />
          <span style={{ marginLeft: 8 }}>Hiển thị cột hình ảnh</span>
        </div>
        <Button
          type="primary"
          onClick={() => setIsModalOpen(true)}
          disabled={isLoading}
        >
          Thêm sản phẩm
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        loading={isLoading}
      />

      <Modal
        title="Thêm sản phẩm mới"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          reset();
        }}
        footer={null}
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label="Tên sản phẩm"
            required
            validateStatus={errors.name ? "error" : ""}
            help={errors.name?.message}
          >
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập tên sản phẩm" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Tên thương hiệu"
            required
            validateStatus={errors.brandName ? "error" : ""}
            help={errors.brandName?.message}
          >
            <Controller
              name="brandName"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập tên thương hiệu" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="URL nguồn"
            required
            validateStatus={errors.sourceUrl ? "error" : ""}
            help={errors.sourceUrl?.message}
          >
            <Controller
              name="sourceUrl"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Nhập URL nguồn" />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Danh mục"
            required
            validateStatus={errors.category ? "error" : ""}
            help={errors.category?.message}
          >
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="Chọn danh mục"
                  options={categoryOptions}
                  onChange={(value) => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Gửi
            </Button>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => {
                setIsModalOpen(false);
                reset();
              }}
              disabled={isLoading}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Products;