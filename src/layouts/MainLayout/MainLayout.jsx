import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "../../components/Header/Header";
import HeaderLog from "../../components/Header/HeaderLog";
import Footer from "../../components/Footer/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";

export default function MainLayout() {
  const user =
    useSelector((state) => state.auth.currentUser) ||
    JSON.parse(localStorage.getItem("currentUser"));

  return (
    <Box>
      <ScrollToTop />
      {user ? <HeaderLog /> : <Header />}
      <Outlet />
      <Footer />
    </Box>
  );
}
