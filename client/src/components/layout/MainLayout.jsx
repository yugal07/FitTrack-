// src/components/layout/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ toggleTheme, darkMode }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Header toggleTheme={toggleTheme} darkMode={darkMode} />
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          ml: { sm: '240px' },
          mt: '64px',
        }}
      >
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;