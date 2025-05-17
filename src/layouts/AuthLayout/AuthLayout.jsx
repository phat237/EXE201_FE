import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <Box>
      <h1>AuthLayout</h1>
      <Outlet/>
    </Box>
  )
}
