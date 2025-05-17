import { Box } from '@mui/material'
import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <Box>
      <h1>AdminLayout</h1>
      <Outlet/>
    </Box>
  )
}
