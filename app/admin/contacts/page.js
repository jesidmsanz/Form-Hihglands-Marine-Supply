'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import MaterialTable from '@/components/admin/MaterialTable';

const AdminLayout = dynamic(() => import('@/components/admin/Layout'), {
  ssr: false,
});
import { getContactsAction, getContactByIdAction } from '@/app/actions/contacts';
import { format } from 'date-fns';
import {
  Box,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  alpha,
  Chip,
  IconButton,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Close,
  CalendarToday,
  Person,
  Category,
  Business,
  DirectionsBoat,
  LocationOn,
  AttachFile,
} from '@mui/icons-material';

export default function Contacts() {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Helper function to determine contact type
  const getContactType = (item) => {
    if (item.company || item.vessel || item.port) {
      return 'Service Request';
    }
    return 'General Contact';
  };

  // Helper function to format array or string values
  const formatArrayOrString = (value) => {
    if (!value) return '-';
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '-';
    }
    return value;
  };

  // Helper function to get code items as array of objects
  const getCodeItems = (contact) => {
    const codes = Array.isArray(contact?.code) ? contact.code : contact?.code ? [contact.code] : [];
    const descriptions = Array.isArray(contact?.description) ? contact.description : contact?.description ? [contact.description] : [];
    const units = Array.isArray(contact?.unit) ? contact.unit : contact?.unit ? [contact.unit] : [];

    // Get the maximum length to handle arrays of different sizes
    const maxLength = Math.max(codes.length, descriptions.length, units.length);

    if (maxLength === 0) return [];

    // Create array of objects, filling missing values with empty strings
    return Array.from({ length: maxLength }, (_, index) => ({
      code: codes[index] || '-',
      description: descriptions[index] || '-',
      unit: units[index] || '-',
    }));
  };

  const loadData = async () => {
    setLoading(true);
    const result = await getContactsAction();

    if (!result.success || !result.data) {
      setLoading(false);
      setData([]);
      return;
    }

    const formattedData = result.data.map((item) => ({
      ...item,
      createdAt: item.createdAt ? format(new Date(item.createdAt), 'MM-dd-yyyy') : '',
      message: item.message || '',
      request: item.request || '',
      type: getContactType(item),
      arrivalDate: item.arrivalDate ? format(new Date(item.arrivalDate), 'MM-dd-yyyy') : '',
      departureDate: item.departureDate ? format(new Date(item.departureDate), 'MM-dd-yyyy') : '',
      fullName:
        item.fullName ||
        (item.firstName && item.lastName ? `${item.firstName} ${item.lastName}`.trim() : '') ||
        '',
      company: item.company || '',
      vessel: item.vessel || '',
      port: item.port || '',
      vesselCategory: item.vesselCategory || '',
    }));

    setLoading(false);
    setData(formattedData);
  };

  const handleViewDetails = async (rowData) => {
    setShowModal(true);
    setLoadingDetail(true);
    setSelectedContact(null);

    const result = await getContactByIdAction(rowData._id);
    setLoadingDetail(false);

    if (result.success && result.data) {
      setSelectedContact(result.data);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedContact(null);
  };

  // Cargar datos al montar el componente (solo en cliente)
  useEffect(() => {
    loadData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'createdAt',
        header: 'Date',
      },
      {
        accessorKey: 'type',
        header: 'Type',
      },
      {
        accessorKey: 'fullName',
        header: 'Full Name',
      },
      {
        accessorKey: 'company',
        header: 'Company',
      },
      {
        accessorKey: 'vessel',
        header: 'Vessel',
      },
      {
        accessorKey: 'port',
        header: 'Port',
      },
      {
        accessorKey: 'arrivalDate',
        header: 'ETA',
      },
    ],
    []
  );

  return (
    <AdminLayout>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Header Card - Estilo Notion/Vercel */}
        <Box
          sx={{
            p: 4,
            borderRadius: '16px',
            backgroundColor: 'background.paper',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            border: 'none',
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.5rem' }}
          >
            Contacts
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            Manage and view all contact submissions
          </Typography>
        </Box>

        {/* Table - Sin wrapper Paper, la tabla ya tiene su propio contenedor */}
        <MaterialTable
          data={data}
          columns={columns}
          onRowAction={handleViewDetails}
          loading={loading}
        />
      </Box>

      {/* Dialog de Detalles - Estilo Premium */}
      <Dialog
        open={showModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            border: 'none',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
          }}
        >
          <Typography variant="h6" component="span" sx={{ fontWeight: 600, fontSize: '1rem' }}>
            Contact Details
          </Typography>
          <IconButton
            onClick={handleCloseModal}
            size="small"
            aria-label="Close dialog"
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: alpha(theme.palette.error.main, 0.1),
                color: 'error.main',
              },
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 2, pt: 2 }}>
          {loadingDetail ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                Loading contact details...
              </Typography>
            </Box>
          ) : selectedContact ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                gap: 1.5,
                mt: 0,
              }}
            >
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <CalendarToday sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Date
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.createdAt
                    ? format(new Date(selectedContact.createdAt), 'MMM dd, yyyy')
                    : '-'}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <Category sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Type
                  </Typography>
                </Box>
                {getContactType(selectedContact) ? (
                  <Chip
                    label={getContactType(selectedContact)}
                    size="small"
                    sx={{
                      ml: 3,
                      height: 20,
                      fontSize: '0.7rem',
                      backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ ml: 3, color: 'text.disabled', fontSize: '0.875rem' }}>
                    -
                  </Typography>
                )}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <Person sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Full Name
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.fullName || '-'}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <Business sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Company
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.company || '-'}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <DirectionsBoat sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Vessel Name
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.vessel || '-'}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <LocationOn sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Port of Arrival
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.port || '-'}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <Category sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Vessel Category
                  </Typography>
                </Box>
                {selectedContact.vesselCategory ? (
                  <Chip
                    label={selectedContact.vesselCategory}
                    size="small"
                    sx={{
                      ml: 3,
                      height: 20,
                      fontSize: '0.7rem',
                      backgroundColor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                      color: 'secondary.main',
                    }}
                  />
                ) : (
                  <Typography variant="body2" sx={{ ml: 3, color: 'text.disabled', fontSize: '0.875rem' }}>
                    -
                  </Typography>
                )}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <CalendarToday sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Estimated Arrival (ETA)
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.arrivalDate
                    ? format(new Date(selectedContact.arrivalDate), 'MMM dd, yyyy')
                    : '-'}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <CalendarToday sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Estimated Departure (ETD)
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.departureDate
                    ? format(new Date(selectedContact.departureDate), 'MMM dd, yyyy')
                    : '-'}
                </Typography>
              </Box>

              {/* Code, Description & Unit Table */}
              <Box sx={{ gridColumn: '1 / -1', mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1 }}>
                  <Category sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Code, Description & Unit
                  </Typography>
                </Box>
                {(() => {
                  const codeItems = getCodeItems(selectedContact);
                  if (codeItems.length === 0) {
                    return (
                      <Typography variant="body2" sx={{ ml: 3, color: 'text.disabled', fontSize: '0.875rem' }}>
                        -
                      </Typography>
                    );
                  }
                  return (
                    <TableContainer
                      sx={{
                        ml: 3,
                        mr: 3,
                        width: 'calc(100% - 48px)',
                        maxWidth: 'calc(100% - 48px)',
                        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                        borderRadius: 0,
                        maxHeight: 300,
                        overflow: 'auto',
                      }}
                    >
                      <Table size="small" stickyHeader sx={{ tableLayout: 'fixed', width: '100%' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                py: 0.75,
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                width: '15%',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              Code
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                py: 0.75,
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                width: '65%',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              Description
                            </TableCell>
                            <TableCell
                              sx={{
                                backgroundColor: alpha(theme.palette.primary.main, 0.05),
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                py: 0.75,
                                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                                width: '20%',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                              }}
                            >
                              Unit
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {codeItems.map((item, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                },
                                '&:last-child td': {
                                  borderBottom: 'none',
                                },
                              }}
                            >
                              <TableCell
                                sx={{
                                  fontSize: '0.875rem',
                                  py: 0.75,
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  maxWidth: 0,
                                }}
                              >
                                {item.code}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: '0.875rem',
                                  py: 0.75,
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  maxWidth: 0,
                                }}
                              >
                                {item.description}
                              </TableCell>
                              <TableCell
                                sx={{
                                  fontSize: '0.875rem',
                                  py: 0.75,
                                  wordWrap: 'break-word',
                                  overflowWrap: 'break-word',
                                  maxWidth: 0,
                                }}
                              >
                                {item.unit}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  );
                })()}
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <Category sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Quantity
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.quantity || '-'}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.25 }}>
                  <Person sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                    Agent
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ ml: 3, fontSize: '0.875rem' }}>
                  {selectedContact.agent || '-'}
                </Typography>
              </Box>

              {(selectedContact.comment || selectedContact.message || selectedContact.request) && (
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' }, mt: 0.5 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ fontWeight: 600, mb: 0.5, display: 'block', fontSize: '0.75rem' }}
                  >
                    Comment
                  </Typography>
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 1.5,
                      borderRadius: '8px',
                      backgroundColor: alpha(theme.palette.grey[50], 0.5),
                      borderColor: alpha(theme.palette.divider, 0.3),
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontSize: '0.875rem' }}>
                      {selectedContact.comment || selectedContact.request || selectedContact.message}
                    </Typography>
                  </Paper>
                </Box>
              )}

              {selectedContact.attachments && selectedContact.attachments.length > 0 && (
                <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' }, mt: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
                    <AttachFile sx={{ fontSize: '0.875rem', color: 'text.disabled' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                      Attachments ({selectedContact.attachments.length})
                    </Typography>
                  </Box>
                  <Box sx={{ ml: 3, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {selectedContact.attachments.map((attachment, index) => (
                      <Box
                        key={index}
                        component="a"
                        href={attachment}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: 'primary.main',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' },
                          fontSize: '0.8125rem',
                        }}
                      >
                        {attachment}
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                No data available
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            borderTop: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            backgroundColor: alpha(theme.palette.grey[50], 0.5),
          }}
        >
          <Button
            onClick={handleCloseModal}
            variant="outlined"
            sx={{
              textTransform: 'none',
              borderRadius: '12px',
              px: 3,
              fontWeight: 500,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
