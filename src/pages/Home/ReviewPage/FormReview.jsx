import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Tabs,
  Tab,
  Rating,
  Alert,
  AlertTitle,
} from "@mui/material";
import {
  Star as StarIcon,
  Info as InfoIcon,
  Shield as ShieldIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import "./FormReview.css";

// Yup validation schema
const schema = yup.object().shape({
  productName: yup
    .string()
    .min(2, "Tên sản phẩm phải có ít nhất 2 ký tự")
    .required("Tên sản phẩm là bắt buộc"),
  category: yup.string().required("Danh mục là bắt buộc"),
  rating: yup
    .number()
    .min(1, "Vui lòng chọn ít nhất 1 sao")
    .max(5, "Tối đa 5 sao")
    .required("Đánh giá sao là bắt buộc"),
  reviewContent: yup
    .string()
    .min(10, "Nội dung đánh giá phải có ít nhất 50 ký tự")
    .max(1000, "Nội dung đánh giá tối đa 1000 ký tự")
    .required("Nội dung đánh giá là bắt buộc"),
  isAnonymous: yup.boolean().default(true),
  isConfirmed: yup
    .boolean()
    .oneOf([true], "Bạn phải xác nhận đánh giá là trung thực")
    .required("Xác nhận là bắt buộc"),
});

export default function FormReview() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      productName: "",
      category: "",
      rating: 0,
      reviewContent: "",
      isAnonymous: true,
      isConfirmed: false,
    },
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
  };

  return (
    <Box className="review-container">
      <Box className="review-content">
        <Typography variant="h4" className="review-page-title">
          Viết Đánh Giá
        </Typography>
        <Typography variant="body2" className="review-page-subtitle">
          Chia sẻ trải nghiệm của bạn để giúp người khác đưa ra quyết định tốt
          hơn
        </Typography>

        {isSubmitted ? (
          <Card className="review-success-card">
            <CardContent className="review-success-content">
              <Box className="review-success-message">
                <Box className="review-success-icon">
                  <ShieldIcon className="review-icon" />
                </Box>
                <Typography variant="h5" className="review-success-title">
                  Đánh Giá Đã Gửi!
                </Typography>
                <Typography variant="body2" className="review-success-text">
                  Cảm ơn bạn đã chia sẻ trải nghiệm. Đánh giá của bạn đang được
                  AI phân tích và sẽ hiển thị sau khi xác minh.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setIsSubmitted(false)}
                  className="review-another-button"
                >
                  Viết Đánh Giá Khác
                </Button>
              </Box>
            </CardContent>
          </Card>
        ) : (
          <Card className="review-form-card">
            <Typography
              variant="h6"
              sx={{ fontSize: "20px", fontWeight: "bold" }}
            >
              Thông Tin Đánh Giá
            </Typography>
            <Typography variant="body2" className="review-form-description">
              Vui lòng cung cấp thông tin chi tiết và trung thực về sản phẩm
            </Typography>

            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="review-form">
                <Box className="review-form-field">
                  <Typography variant="subtitle2">Tên Sản Phẩm</Typography>
                  <Controller
                    name="productName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="product"
                        placeholder="Nhập tên sản phẩm bạn muốn đánh giá"
                        fullWidth
                        error={!!errors.productName}
                        helperText={errors.productName?.message}
                        className="review-input"
                      />
                    )}
                  />
                </Box>

                <Box className="review-form-field">
                  <Typography variant="subtitle2">Danh Mục</Typography>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        fullWidth
                        displayEmpty
                        className="review-select"
                        error={!!errors.category}
                      >
                        <MenuItem value="" disabled>
                          Chọn danh mục sản phẩm
                        </MenuItem>
                        <MenuItem value="electronics">Điện tử</MenuItem>
                        <MenuItem value="fashion">Thời trang</MenuItem>
                        <MenuItem value="home">Nhà cửa</MenuItem>
                        <MenuItem value="beauty">Làm đẹp</MenuItem>
                        <MenuItem value="food">Thực phẩm</MenuItem>
                        <MenuItem value="other">Khác</MenuItem>
                      </Select>
                    )}
                  />
                  {errors.category && (
                    <Typography variant="caption" color="error">
                      {errors.category.message}
                    </Typography>
                  )}
                </Box>

                <Box className="review-form-field">
                  <Typography variant="subtitle2">Đánh Giá Sao</Typography>
                  <Box className="review-rating">
                    <Controller
                      name="rating"
                      control={control}
                      render={({ field }) => (
                        <Rating
                          value={field.value}
                          onChange={(event, newValue) =>
                            field.onChange(newValue)
                          }
                          icon={<StarIcon className="review-star-icon" />}
                          emptyIcon={
                            <StarIcon className="review-star-icon-empty" />
                          }
                        />
                      )}
                    />
                    <Typography variant="body2" className="review-rating-text">
                      {control._formValues.rating > 0
                        ? `${control._formValues.rating}/5`
                        : "Chưa đánh giá"}
                    </Typography>
                  </Box>
                  {errors.rating && (
                    <Typography variant="caption" color="error">
                      {errors.rating.message}
                    </Typography>
                  )}
                </Box>

                <Box className="review-form-field">
                  <Typography variant="subtitle2">Nội Dung Đánh Giá</Typography>
                  <Controller
                    name="reviewContent"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="review"
                        placeholder="Chia sẻ trải nghiệm của bạn với sản phẩm này"
                        multiline
                        rows={6}
                        fullWidth
                        error={!!errors.reviewContent}
                        helperText={errors.reviewContent?.message}
                        className="review-textarea"
                      />
                    )}
                  />
                  <Typography
                    variant="caption"
                    className="review-textarea-hint"
                  >
                    Tối thiểu 50 ký tự, tối đa 1000 ký tự
                  </Typography>
                </Box>

                <Controller
                  name="isAnonymous"
                  control={control}
                  render={({ field }) => (
                    <Tabs
                      value={field.value ? "anonymous" : "account"}
                      onChange={(e, value) =>
                        field.onChange(value === "anonymous")
                      }
                      className="review-tabs"
                    >
                      <Tab
                        label="Ẩn danh"
                        value="anonymous"
                        className="review-tab"
                      />
                      <Tab
                        label="Tài khoản"
                        value="account"
                        className="review-tab"
                      />
                    </Tabs>
                  )}
                />
                {control._formValues.isAnonymous ? (
                  <Alert className="review-alert">
                    <ShieldIcon className="review-icon" />
                    <AlertTitle>Đánh giá ẩn danh</AlertTitle>
                    <Typography variant="body2">
                      Danh tính của bạn sẽ được bảo vệ. Đánh giá sẽ hiển thị
                      dưới tên "Người dùng ẩn danh".
                    </Typography>
                  </Alert>
                ) : (
                  <Alert severity="error" className="review-alert">
                    <WarningIcon className="review-icon" />
                    <AlertTitle>Cần đăng nhập</AlertTitle>
                    <Typography variant="body2">
                      Bạn cần đăng nhập để sử dụng tính năng này. Đánh giá sẽ
                      được liên kết với tài khoản của bạn.
                    </Typography>
                    <Box className="review-login-button">
                      <Button variant="outlined">Đăng nhập</Button>
                    </Box>
                  </Alert>
                )}

                <Box className="review-terms">
                  <Controller
                    name="isConfirmed"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={<Checkbox {...field} checked={field.value} />}
                        label="Tôi xác nhận đánh giá này là trung thực và dựa trên trải nghiệm thực tế"
                        className="review-checkbox"
                      />
                    )}
                  />
                  {errors.isConfirmed && (
                    <Typography variant="caption" color="error">
                      {errors.isConfirmed.message}
                    </Typography>
                  )}
                  <Typography variant="caption" className="review-terms-text">
                    Đánh giá của bạn sẽ được AI phân tích để đảm bảo tính xác
                    thực
                  </Typography>
                </Box>

                <Alert className="review-alert">
                  <InfoIcon className="review-icon" />
                  <AlertTitle>Lưu ý</AlertTitle>
                  <Typography variant="body2">
                    Đánh giá của bạn sẽ được AI phân tích để đảm bảo tính xác
                    thực và chất lượng. Chúng tôi không chấp nhận đánh giá có
                    nội dung quảng cáo, spam hoặc vi phạm quy định cộng đồng.
                  </Typography>
                </Alert>

                <Box className="review-submit">
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    className="review-submit-button"
                  >
                    {isSubmitting ? "Đang gửi đánh giá..." : "Gửi Đánh Giá"}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
}
