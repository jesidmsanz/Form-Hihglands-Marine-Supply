'use client';

import { IconButton, Box, Typography, useTheme, alpha } from '@mui/material';
import { Menu, Close } from '@mui/icons-material';

/**
 * Header - Estilo Moderno 2026 (Notion/Vercel)
 * Header fijo, limpio y minimalista
 */
const Header = ({ onMenuToggle, isMenuOpen }) => {
  const theme = useTheme();

  return (
    <Box
      component="header"
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1200,
        height: '64px',
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E5E7EB',
        boxShadow: '0 1px 0 0 rgba(0, 0, 0, 0.05)',
        display: 'flex',
        alignItems: 'center',
        px: { xs: 2, md: 3 },
      }}
    >
      <IconButton
        onClick={onMenuToggle}
        sx={{
          display: { lg: 'none' },
          mr: 2,
          color: '#6B7280',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.08),
          },
        }}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <Close /> : <Menu />}
      </IconButton>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: '1rem',
          color: '#111827',
          letterSpacing: '-0.01em',
        }}
      >
        Client Management System
      </Typography>
    </Box>
  );
};

export default Header;
