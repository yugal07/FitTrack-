// src/components/layout/AuthLayout.jsx
import { Outlet } from 'react-router-dom';
import { Container, Box, Paper } from '@mui/material';

const AuthLayout = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;