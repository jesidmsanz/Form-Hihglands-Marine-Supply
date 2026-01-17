'use client';

import React from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { MRT_Localization_EN } from 'material-react-table/locales/en';
import { Box, IconButton, Tooltip, useTheme, alpha } from '@mui/material';
import { VisibilityOutlined } from '@mui/icons-material';

/**
 * MaterialTable - Componente limpio estilo SaaS Minimalista (2026)
 * Sin ruido visual, diseño premium tipo Stripe/Linear
 */
export default function MaterialTable({
  data = [],
  columns = [],
  onRowAction,
  loading = false,
  ...props
}) {
  const theme = useTheme();

  const table = useMaterialReactTable({
    columns,
    data,

    // LIMPIEZA TOTAL DE RUIDO VISUAL - Estilo Notion/Vercel
    enableColumnActions: false,
    enableColumnFilters: false,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableColumnOrdering: false,
    enableGrouping: false,
    enablePinning: false,
    enableSorting: false, // Eliminar flechas de ordenamiento
    enableGlobalFilter: true,

    // ACCIONES AL FINAL
    positionActionsColumn: 'last',
    enableRowActions: !!onRowAction,
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Actions',
        size: 80,
      },
    },

    initialState: {
      density: 'compact',
      showGlobalFilter: true,
      pagination: { pageSize: 15, pageIndex: 0 },
    },

    localization: MRT_Localization_EN,

    // ESTILO NOTION/VERCEL - Limpio, plano, minimalista
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '16px',
        border: 'none',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
      },
    },

    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#F9FAFB', // Gris casi blanco
        color: theme.palette.grey[700],
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        paddingY: '16px',
        paddingX: '20px',
        borderBottom: '1px solid #F3F4F6', // Línea horizontal fina
        borderRight: 'none', // Sin líneas verticales
        '& .MuiTableSortLabel-root': {
          '& .MuiTableSortLabel-icon': {
            display: 'none !important', // Ocultar flechas de ordenamiento
          },
        },
        '& .MuiIconButton-root': {
          display: 'none !important', // Ocultar cualquier botón de menú
        },
      },
    },

    muiTableBodyCellProps: {
      sx: {
        fontSize: '0.875rem',
        paddingY: '16px', // Más padding para que "respire"
        paddingX: '20px',
        color: theme.palette.grey[900],
        borderBottom: '1px solid #F3F4F6', // Solo línea horizontal fina
        borderRight: 'none', // Sin líneas verticales
      },
    },

    muiTableBodyRowProps: {
      sx: {
        '&:hover': {
          backgroundColor: alpha(theme.palette.primary.main, 0.02),
        },
      },
    },

    muiSearchTextFieldProps: {
      placeholder: 'Search...',
      variant: 'outlined',
      size: 'small',
      sx: {
        minWidth: '400px', // Más largo
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: theme.palette.background.paper,
          fontSize: '0.875rem',
          '& fieldset': {
            borderWidth: '1px',
            borderColor: '#E5E7EB', // Borde suave, no grueso
          },
          '&:hover fieldset': {
            borderColor: '#D1D5DB',
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
            borderWidth: '1px', // Mantener fino incluso al focus
          },
        },
      },
    },

    muiTopToolbarProps: {
      sx: {
        padding: '12px 16px',
        backgroundColor: 'transparent',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
      },
    },

    muiBottomToolbarProps: {
      sx: {
        padding: '12px 16px',
        backgroundColor: alpha(theme.palette.grey[50], 0.5),
        borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
      },
    },

    muiPaginationProps: {
      rowsPerPageOptions: [10, 15, 25, 50],
      showFirstButton: true,
      showLastButton: true,
      size: 'small',
    },

    renderRowActions: onRowAction
      ? ({ row }) => (
          <Tooltip title="View Details" arrow placement="left">
            <IconButton
              onClick={() => onRowAction(row.original)}
              size="small"
              sx={{
                color: '#9CA3AF', // Grisáceo minimalista
                padding: '6px',
                '&:hover': {
                  color: theme.palette.primary.main, // Azul solo en hover
                  backgroundColor: 'transparent', // Sin fondo en hover
                },
              }}
            >
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )
      : undefined,

    renderEmptyRowsFallback: () => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          color: theme.palette.grey[500],
        }}
      >
        No records to display
      </Box>
    ),

    state: { isLoading: loading },
    ...props,
  });

  return <MaterialReactTable table={table} />;
}
