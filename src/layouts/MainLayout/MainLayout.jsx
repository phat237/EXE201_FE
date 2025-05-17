import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <Box>
      <h1>MainLayout</h1>
      <Outlet />
    </Box>
  );
}
