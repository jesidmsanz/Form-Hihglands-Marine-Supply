'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Box, CircularProgress, useTheme } from '@mui/material';
import Header from '../Header';
import Sidebar from '../Sidebar';

const AdminLayout = ({ children }) => {
  const { status } = useSession();
  const theme = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  if (!mounted) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#FAFAFA',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={32} sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const isLoading = status === 'loading';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#FAFAFA',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <CircularProgress size={32} sx={{ color: theme.palette.primary.main }} />
        </Box>
      )}

      <Sidebar isOpen={isMenuOpen} onClose={closeMenu} />

      <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />

      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.2s ease-in-out',
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            ml: { lg: '256px' },
            mt: { xs: '64px', lg: '64px' },
            transition: 'margin-left 0.3s ease-in-out',
            overflowY: 'auto',
            backgroundColor: '#FAFAFA',
          }}
        >
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              maxWidth: '1600px',
              mx: 'auto',
              width: '100%',
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
