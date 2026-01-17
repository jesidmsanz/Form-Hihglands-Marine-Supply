'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Box, List, ListItem, Typography, IconButton, useTheme, alpha } from '@mui/material';
import { ContactsOutlined, LogoutOutlined } from '@mui/icons-material';

/**
 * Sidebar - Estilo Midnight Premium (2026)
 * Paleta oscura tipo Stripe/Linear con iconos outline
 */
const Sidebar = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const theme = useTheme();

  const handleLogout = () => {
    signOut({ callbackUrl: '/admin/login' });
  };

  const menuItems = [
    { href: '/admin/contacts', label: 'Contacts', icon: ContactsOutlined },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            backgroundColor: alpha(theme.palette.common.black, 0.5),
            zIndex: 1200,
            display: { lg: 'none' },
          }}
          onClick={onClose}
        />
      )}

      {/* Sidebar - Estilo Midnight Profundo (Notion/Vercel) */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 256,
          backgroundColor: '#0F172A', // Midnight profundo (slate-900)
          zIndex: 1300,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
          transform: {
            xs: isOpen ? 'translateX(0)' : 'translateX(-100%)',
            lg: 'translateX(0)',
          },
          transition: 'transform 0.3s ease-in-out',
        }}
      >
        {/* Logo/Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
            backgroundColor: alpha(theme.palette.common.black, 0.2),
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: theme.palette.common.white,
              fontSize: '1rem',
              letterSpacing: '-0.01em',
            }}
          >
            Admin Panel
          </Typography>
        </Box>

        {/* Menu Items */}
        <Box sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
          <List sx={{ p: 0 }}>
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <ListItem
                  key={item.href}
                  disablePadding
                  sx={{ mb: 0.5 }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    style={{ textDecoration: 'none', width: '100%' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2.5,
                        py: 1.5,
                        borderRadius: '8px',
                        backgroundColor: isActive
                          ? alpha(theme.palette.primary.main, 0.12)
                          : 'transparent',
                        color: isActive
                          ? theme.palette.primary.light
                          : alpha(theme.palette.common.white, 0.7),
                        transition: 'all 0.15s ease',
                        border: 'none', // Sin bordes brillantes
                        '&:hover': {
                          backgroundColor: isActive
                            ? alpha(theme.palette.primary.main, 0.18)
                            : alpha(theme.palette.common.white, 0.04), // Hover muy sutil
                          color: isActive
                            ? theme.palette.primary.light
                            : alpha(theme.palette.common.white, 0.9),
                        },
                      }}
                    >
                      <Icon sx={{ fontSize: '1.25rem', mr: 2 }} />
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: isActive ? 600 : 500,
                          fontSize: '0.875rem',
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Link>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Logout Button */}
        <Box
          sx={{
            p: 2,
            borderTop: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
          }}
        >
          <Box
            onClick={handleLogout}
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              px: 2.5,
              py: 1.5,
              borderRadius: '8px',
              color: alpha(theme.palette.error.light, 0.7),
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.08),
                color: alpha(theme.palette.error.light, 0.9),
              },
            }}
          >
            <LogoutOutlined sx={{ fontSize: '1.25rem', mr: 2 }} />
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
              Logout
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
