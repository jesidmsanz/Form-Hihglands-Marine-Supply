'use client';

import React, { useState, useTransition } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Paper,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { createContactActionWithObject } from '@/app/actions/contacts';
import { uploadFileAction } from '@/app/actions/uploads';
import { LIST_PORTS } from '@/utils/listPorts';
import Image from 'next/image';

// Colores de la marca HighLands
const BRAND_COLORS = {
  striingBlue: '#FFFFFF',
  aquamarine: '#47C0AC',
  striingBlue: '#0F2A55',
  white: '#FFFFFF',
};

export default function HomePage() {
  const [isPending, startTransition] = useTransition();
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    fullName: '',
    firstName: '',
    lastName: '',
    company: '',
    vessel: '',
    arrivalDate: null,
    departureDate: null,
    port: '',
    vesselCategory: '',
    code: '',
    description: '',
    unit: '',
    quantity: '',
    agent: '',
    comment: '',
    file: null,
  });

  const handleChange = (field) => (event) => {
    const value = event.target?.value ?? event;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCodeChange = (event) => {
    const code = event.target.value;
    setFormData((prev) => ({ ...prev, code }));

    // Buscar el código en LIST_PORTS
    if (code) {
      const foundItem = LIST_PORTS.find((item) => item.code === code.trim());
      if (foundItem) {
        setFormData((prev) => ({
          ...prev,
          code,
          description: foundItem.description || prev.description,
          unit: foundItem.unit || prev.unit,
        }));
      }
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
      ];

      if (!allowedTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Invalid file type. Only Excel, PDF, and image files are allowed.',
          severity: 'error',
        });
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'File size exceeds 10MB limit.',
          severity: 'error',
        });
        return;
      }

      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get full name and split it
    const fullName = formData.fullName.trim();
    const nameParts = fullName.split(' ').filter((part) => part.length > 0);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    // Basic validation
    if (!fullName || !formData.company || !formData.vessel) {
      setSnackbar({
        open: true,
        message: 'Please complete all required fields',
        severity: 'error',
      });
      return;
    }

    if (!formData.arrivalDate || !formData.departureDate) {
      setSnackbar({
        open: true,
        message: 'Please select both arrival and departure dates',
        severity: 'error',
      });
      return;
    }

    if (!formData.port || !formData.vesselCategory || !formData.description || !formData.unit || !formData.quantity || !formData.comment) {
      setSnackbar({
        open: true,
        message: 'Please complete all required fields',
        severity: 'error',
      });
      return;
    }

    startTransition(async () => {
      try {
        // Prepare data for Server Action
        const contactData = {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          company: formData.company || undefined,
          vessel: formData.vessel || undefined,
          arrivalDate: formData.arrivalDate?.toISOString() || undefined,
          departureDate: formData.departureDate?.toISOString() || undefined,
          port: formData.port || undefined,
          vesselCategory: formData.vesselCategory || undefined,
          code: formData.code || undefined,
          description: formData.description || undefined,
          unit: formData.unit || undefined,
          quantity: formData.quantity || undefined,
          agent: formData.agent || undefined,
          comment: formData.comment || undefined,
          request: formData.comment || undefined, // For compatibility with existing model
          message: formData.comment || undefined, // For compatibility with existing model
          fullName: fullName || undefined,
        };

        const result = await createContactActionWithObject(contactData);

        if (result.success) {
          // Upload file if provided
          if (formData.file && result.data?._id) {
            const uploadFormData = new FormData();
            uploadFormData.append('file', formData.file);
            uploadFormData.append('contactId', result.data._id);

            const uploadResult = await uploadFileAction(uploadFormData);
            if (!uploadResult.success) {
              console.error('File upload error:', uploadResult.error);
              // Don't fail the whole submission if file upload fails
            }
          }

          setSnackbar({
            open: true,
            message: 'Request submitted successfully! We will contact you soon.',
            severity: 'success',
          });
          // Reset form
          setFormData({
            fullName: '',
            firstName: '',
            lastName: '',
            company: '',
            vessel: '',
            arrivalDate: null,
            departureDate: null,
            port: '',
            vesselCategory: '',
            code: '',
            description: '',
            unit: '',
            quantity: '',
            agent: '',
            comment: '',
            file: null,
          });
          // Reset file input
          const fileInput = document.getElementById('file-upload');
          if (fileInput) {
            fileInput.value = '';
          }
        } else {
          setSnackbar({
            open: true,
            message: result.error || 'Error submitting request. Please try again.',
            severity: 'error',
          });
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setSnackbar({
          open: true,
          message: 'Error submitting request. Please try again.',
          severity: 'error',
        });
      }
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: '#FAFAFA',
        }}
      >
        {/* Hero Section */}
        <Box
          sx={{
            backgroundColor: BRAND_COLORS.white,
            color: '#FFFFFF',
          }}
        >
          <Container maxWidth="lg">
            {/* Logo */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                // mb: 4,
              }}
            >
              <Image
                src="/images/logo.png"
                alt="HighLands Marine Supply Logo"
                width={600}
                height={200}
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Container>
        </Box>

        {/* Form Section */}
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              borderRadius: 0,
              border: `2px solid ${BRAND_COLORS.striingBlue}`,
            }}
          >
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'var(--font-montserrat), sans-serif',
                fontSize: { xs: '1.75rem', md: '2.25rem' },
                fontWeight: 600,
                color: BRAND_COLORS.striingBlue,
                mb: 4,
                textAlign: 'center',
              }}
            >
              Request Our Services
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              {/* Full Name */}
              <TextField
                fullWidth
                required
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    fullName: value,
                  }));
                }}
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: BRAND_COLORS.striingBlue,
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: BRAND_COLORS.aquamarine,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: BRAND_COLORS.aquamarine,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: BRAND_COLORS.aquamarine,
                  },
                }}
              />

              {/* Company and Vessel Name */}
              <Box
                sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <TextField
                  fullWidth
                  required
                  label="Company"
                  value={formData.company}
                  onChange={handleChange('company')}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: BRAND_COLORS.striingBlue,
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: BRAND_COLORS.aquamarine,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Vessel Name"
                  value={formData.vessel}
                  onChange={handleChange('vessel')}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: BRAND_COLORS.striingBlue,
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: BRAND_COLORS.aquamarine,
                    },
                  }}
                />
              </Box>

              {/* ETA and ETD */}
              <Box
                sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <DatePicker
                  label="Estimated Date of Arrival (ETA)"
                  value={formData.arrivalDate}
                  onChange={handleChange('arrivalDate')}
                  minDate={new Date(new Date().setHours(0, 0, 0, 0))}
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      InputLabelProps: { shrink: true },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: BRAND_COLORS.striingBlue,
                            borderWidth: '2px',
                          },
                          '&:hover fieldset': {
                            borderColor: BRAND_COLORS.aquamarine,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: BRAND_COLORS.aquamarine,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: BRAND_COLORS.aquamarine,
                        },
                      },
                    },
                  }}
                />
                <DatePicker
                  label="Estimated Date of Departure (ETD)"
                  value={formData.departureDate}
                  onChange={handleChange('departureDate')}
                  disabled={!formData.arrivalDate}
                  minDate={
                    formData.arrivalDate
                      ? new Date(new Date(formData.arrivalDate).setHours(0, 0, 0, 0))
                      : new Date(new Date().setHours(0, 0, 0, 0))
                  }
                  slotProps={{
                    textField: {
                      required: true,
                      fullWidth: true,
                      InputLabelProps: { shrink: true },
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: BRAND_COLORS.striingBlue,
                            borderWidth: '2px',
                          },
                          '&:hover fieldset': {
                            borderColor: BRAND_COLORS.aquamarine,
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: BRAND_COLORS.aquamarine,
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: BRAND_COLORS.aquamarine,
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* Port of Arrival and Vessel Category */}
              <Box
                sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <TextField
                  fullWidth
                  required
                  select
                  label="Port of Arrival"
                  value={formData.port}
                  onChange={handleChange('port')}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: BRAND_COLORS.striingBlue,
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: BRAND_COLORS.aquamarine,
                    },
                  }}
                >
                  <MenuItem value="Manzanillo International Terminal (MIT)">
                    Manzanillo International Terminal (MIT)
                  </MenuItem>
                  <MenuItem value="Colon Container Terminal (CCT)">
                    Colon Container Terminal (CCT)
                  </MenuItem>
                  <MenuItem value="Cristóbal Port">Cristóbal Port</MenuItem>
                  <MenuItem value="Balboa Port">Balboa Port</MenuItem>
                  <MenuItem value="PSA Panama International Terminal (Rodman)">
                    PSA Panama International Terminal (Rodman)
                  </MenuItem>
                  <MenuItem value="Panama Ports Company – Cristóbal & Balboa">
                    Panama Ports Company – Cristóbal & Balboa
                  </MenuItem>
                  <MenuItem value="Puerto Armuelles">Puerto Armuelles</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  required
                  select
                  label="Vessel Category"
                  value={formData.vesselCategory}
                  onChange={handleChange('vesselCategory')}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: BRAND_COLORS.striingBlue,
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: BRAND_COLORS.aquamarine,
                    },
                  }}
                >
                  <MenuItem value="Fishing">Fishing</MenuItem>
                  <MenuItem value="Commercial Merchant">Commercial Merchant</MenuItem>
                  <MenuItem value="Cruise">Cruise</MenuItem>
                  <MenuItem value="Military">Military</MenuItem>
                  <MenuItem value="Special">Special</MenuItem>
                </TextField>
              </Box>

              {/* Code and Description */}
              <Box
                sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <TextField
                  fullWidth
                  label="Code"
                  value={formData.code}
                  onChange={handleCodeChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: BRAND_COLORS.striingBlue,
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: BRAND_COLORS.aquamarine,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Description"
                  value={formData.description}
                  onChange={handleChange('description')}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: BRAND_COLORS.striingBlue,
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: BRAND_COLORS.aquamarine,
                    },
                  }}
                />
              </Box>

              {/* Unit and Quantity */}
              <Box
                sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <TextField
                  fullWidth
                  required
                  label="Unit"
                  value={formData.unit}
                  onChange={handleChange('unit')}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: BRAND_COLORS.striingBlue,
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: BRAND_COLORS.aquamarine,
                    },
                  }}
                />
                <TextField
                  fullWidth
                  required
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange('quantity')}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: BRAND_COLORS.striingBlue,
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: BRAND_COLORS.aquamarine,
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: BRAND_COLORS.aquamarine,
                    },
                  }}
                />
              </Box>

              {/* Agent */}
              <TextField
                fullWidth
                label="Agent"
                value={formData.agent}
                onChange={handleChange('agent')}
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: BRAND_COLORS.striingBlue,
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: BRAND_COLORS.aquamarine,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: BRAND_COLORS.aquamarine,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: BRAND_COLORS.aquamarine,
                  },
                }}
              />

              {/* Comment */}
              <TextField
                fullWidth
                required
                multiline
                rows={6}
                label="Comment"
                value={formData.comment}
                onChange={handleChange('comment')}
                InputLabelProps={{ shrink: true }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: BRAND_COLORS.striingBlue,
                      borderWidth: '2px',
                    },
                    '&:hover fieldset': {
                      borderColor: BRAND_COLORS.aquamarine,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: BRAND_COLORS.aquamarine,
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: BRAND_COLORS.aquamarine,
                  },
                }}
              />

              {/* File Upload */}
              <Box sx={{ mb: 3 }}>
                <input
                  accept=".xlsx,.xls,.pdf,.jpg,.jpeg,.png,.webp,.gif"
                  style={{ display: 'none' }}
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderColor: BRAND_COLORS.striingBlue,
                      borderWidth: '2px',
                      color: BRAND_COLORS.striingBlue,
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 600,
                      fontSize: '1rem',
                      textTransform: 'none',
                      borderRadius: 0,
                      '&:hover': {
                        borderColor: BRAND_COLORS.aquamarine,
                        borderWidth: '2px',
                        backgroundColor: 'transparent',
                      },
                    }}
                  >
                    {formData.file ? `File: ${formData.file.name}` : 'Upload File (Excel, PDF, or Image)'}
                  </Button>
                </label>
                {formData.file && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mt: 1,
                      color: BRAND_COLORS.aquamarine,
                      fontFamily: 'var(--font-montserrat), sans-serif',
                    }}
                  >
                    Selected: {formData.file.name} ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isPending}
                sx={{
                  py: 1.5,
                  backgroundColor: BRAND_COLORS.striingBlue,
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontWeight: 600,
                  fontSize: '1.125rem',
                  textTransform: 'none',
                  borderRadius: 0,
                  '&:hover': {
                    backgroundColor: BRAND_COLORS.aquamarine,
                  },
                  '&:disabled': {
                    backgroundColor: BRAND_COLORS.striingBlue,
                    opacity: 0.6,
                  },
                }}
              >
                {isPending ? (
                  <CircularProgress size={24} sx={{ color: '#FFFFFF' }} />
                ) : (
                  'Submit Request'
                )}
              </Button>
            </Box>
          </Paper>
        </Container>

        {/* Snackbar para notificaciones */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{
              backgroundColor:
                snackbar.severity === 'success' ? BRAND_COLORS.aquamarine : undefined,
              color: snackbar.severity === 'success' ? '#FFFFFF' : undefined,
              fontFamily: 'var(--font-montserrat), sans-serif',
              fontWeight: 500,
              '& .MuiAlert-icon': {
                color: snackbar.severity === 'success' ? '#FFFFFF' : undefined,
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </LocalizationProvider>
  );
}
