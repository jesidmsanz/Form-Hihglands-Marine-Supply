'use client';

import React, { useState, useTransition, useMemo } from 'react';
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
  IconButton,
  alpha,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
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
    email: '',
    phone: '',
    company: '',
    vessel: '',
    arrivalDate: null,
    departureDate: null,
    port: '',
    vesselCategory: '',
    codeItems: [{ code: '', description: '', unit: '', quantity: '' }],
    agent: '',
    comment: '',
    file: null,
  });

  const handleChange = (field) => (event) => {
    const value = event.target?.value ?? event;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCodeChange = (index, event) => {
    const code = event.target.value;
    setFormData((prev) => {
      const newCodeItems = [...prev.codeItems];
      newCodeItems[index] = { ...newCodeItems[index], code };

      // Buscar el código en LIST_PORTS
      if (code) {
        const foundItem = LIST_PORTS.find((item) => item.code === code.trim());
        if (foundItem) {
          newCodeItems[index] = {
            ...newCodeItems[index],
            code,
            description: foundItem.description || newCodeItems[index].description,
            unit: foundItem.unit || newCodeItems[index].unit,
          };
        }
      }

      return { ...prev, codeItems: newCodeItems };
    });
  };

  const handleCodeItemFieldChange = (index, field, value) => {
    setFormData((prev) => {
      const newCodeItems = [...prev.codeItems];
      newCodeItems[index] = { ...newCodeItems[index], [field]: value };
      return { ...prev, codeItems: newCodeItems };
    });
  };

  const handleAddCodeItem = () => {
    setFormData((prev) => ({
      ...prev,
      codeItems: [...prev.codeItems, { code: '', description: '', unit: '', quantity: '' }],
    }));
  };

  const handleRemoveCodeItem = (index) => {
    setFormData((prev) => {
      const newCodeItems = prev.codeItems.filter((_, i) => i !== index);
      // Asegurar que siempre haya al menos un item
      if (newCodeItems.length === 0) {
        return { ...prev, codeItems: [{ code: '', description: '', unit: '', quantity: '' }] };
      }
      return { ...prev, codeItems: newCodeItems };
    });
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

    if (!formData.port || !formData.vesselCategory || !formData.comment) {
      setSnackbar({
        open: true,
        message: 'Please complete all required fields',
        severity: 'error',
      });
      return;
    }

    // Si NO hay archivo, validar que haya items completos
    if (!formData.file) {
      // Validar que todos los codeItems tengan description, unit y quantity si tienen code
      const hasInvalidCodeItems = formData.codeItems.some(
        (item) => {
          // Si tiene code, debe tener description, unit y quantity
          if (item.code && item.code.trim()) {
            return !item.description || !item.unit || !item.quantity;
          }
          // Si no tiene code pero tiene description, unit o quantity, debe tenerlos todos
          if (item.description || item.unit || item.quantity) {
            return !item.description || !item.unit || !item.quantity;
          }
          return false;
        }
      );
      if (hasInvalidCodeItems) {
        setSnackbar({
          open: true,
          message: 'Please complete all code, description, unit, and quantity fields',
          severity: 'error',
        });
        return;
      }

      // Validar que haya al menos un item completo
      const hasCompleteItemsCheck = formData.codeItems.some(
        (item) => item.code && item.code.trim() && item.description && item.description.trim() && item.unit && item.unit.trim() && item.quantity && item.quantity.trim()
      );

      if (!hasCompleteItemsCheck) {
        setSnackbar({
          open: true,
          message: 'Please either fill in at least one complete item (code, description, unit, quantity) or upload a file',
          severity: 'error',
        });
        return;
      }
    }

    startTransition(async () => {
      try {
        // Prepare data for Server Action
        // Filter out empty items and send as array of objects
        const items = formData.codeItems
          .filter((item) => item.code || item.description || item.unit || item.quantity)
          .map((item) => ({
            code: item.code || '',
            description: item.description || '',
            unit: item.unit || '',
            quantity: item.quantity || '',
          }));

        const contactData = {
          firstName: firstName || undefined,
          lastName: lastName || undefined,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          company: formData.company || undefined,
          vessel: formData.vessel || undefined,
          arrivalDate: formData.arrivalDate?.toISOString() || undefined,
          departureDate: formData.departureDate?.toISOString() || undefined,
          port: formData.port || undefined,
          vesselCategory: formData.vesselCategory || undefined,
          items: items.length > 0 ? items : undefined,
          agent: formData.agent || undefined,
          comment: formData.comment || undefined,
          request: formData.comment || undefined, // For compatibility with existing model
          message: formData.comment || undefined, // For compatibility with existing model
          fullName: fullName || undefined,
          // Include attachments placeholder if file will be uploaded (for validation)
          attachments: formData.file ? ['pending'] : undefined,
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
            email: '',
            phone: '',
            company: '',
            vessel: '',
            arrivalDate: null,
            departureDate: null,
            port: '',
            vesselCategory: '',
            codeItems: [{ code: '', description: '', unit: '', quantity: '' }],
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

  // Calcular si hay items completos para evitar problemas de hidratación
  const hasCompleteItems = useMemo(() => {
    return formData.codeItems.some(
      (item) =>
        item.code && item.code.trim() &&
        item.description && item.description.trim() &&
        item.unit && item.unit.trim() &&
        item.quantity && item.quantity.trim()
    );
  }, [formData.codeItems]);

  // Calcular el texto del botón de file upload
  const fileUploadButtonText = useMemo(() => {
    if (formData.file) {
      return `File: ${formData.file.name}`;
    }
    return hasCompleteItems
      ? 'Upload File (Excel, PDF, or Image)'
      : 'Upload File (Excel, PDF, or Image) *';
  }, [formData.file, hasCompleteItems]);

  // Determinar si los campos son requeridos (solo si NO hay archivo)
  const areItemsRequired = !formData.file;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box
        suppressHydrationWarning
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
        <Container
          maxWidth={false}
          sx={{
            py: { xs: 6, md: 8 },
            maxWidth: { xs: '100%', sm: '600px', md: '990px' },
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
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

              {/* Email and Phone */}
              <Box
                sx={{ display: 'flex', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
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
                  label="Phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
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

              {/* Code, Description, and Unit Items */}
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 600,
                      color: BRAND_COLORS.striingBlue,
                    }}
                  >
                    Code, Description, Unit & Quantity
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={handleAddCodeItem}
                    sx={{
                      backgroundColor: BRAND_COLORS.striingBlue,
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      textTransform: 'none',
                      borderRadius: 0,
                      px: 2,
                      py: 0.75,
                      '&:hover': {
                        backgroundColor: BRAND_COLORS.aquamarine,
                      },
                    }}
                  >
                    + Add Code
                  </Button>
                </Box>

                {/* Instrucción */}
                <Alert
                  icon={<InfoIcon />}
                  severity="info"
                  sx={{
                    mb: 2,
                    backgroundColor: alpha(BRAND_COLORS.aquamarine, 0.1),
                    border: `1px solid ${BRAND_COLORS.aquamarine}`,
                    borderRadius: 0,
                    '& .MuiAlert-icon': {
                      color: BRAND_COLORS.aquamarine,
                    },
                    '& .MuiAlert-message': {
                      color: BRAND_COLORS.striingBlue,
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontSize: '0.875rem',
                    },
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontFamily: 'var(--font-montserrat), sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                    }}
                  >
                    <strong>Instruction:</strong> If you don't have code or description, you must add it manually. If you don't have that information, then upload the attached file.
                  </Typography>
                </Alert>

                {formData.codeItems.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 2,
                      alignItems: 'flex-start',
                      p: 2,
                      border: `1px solid ${BRAND_COLORS.striingBlue}`,
                      borderRadius: 0,
                      backgroundColor: '#FFFFFF',
                      position: 'relative',
                    }}
                  >
                    <TextField
                      label="Code"
                      value={item.code}
                      onChange={(e) => handleCodeChange(index, e)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        flex: '0 0 12.5%',
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
                      required={areItemsRequired}
                      label="Description"
                      value={item.description}
                      onChange={(e) =>
                        handleCodeItemFieldChange(index, 'description', e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        flex: '1 1 auto',
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
                      required={areItemsRequired}
                      label="Unit"
                      value={item.unit}
                      onChange={(e) => handleCodeItemFieldChange(index, 'unit', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        flex: '0 0 10%',
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
                      required={areItemsRequired}
                      label="Quantity"
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleCodeItemFieldChange(index, 'quantity', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      sx={{
                        maxWidth: '150px',
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
                    {formData.codeItems.length > 1 && (
                      <IconButton
                        onClick={() => handleRemoveCodeItem(index)}
                        sx={{
                          color: '#d32f2f',
                          '&:hover': {
                            backgroundColor: 'rgba(211, 47, 47, 0.04)',
                          },
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Box>
                ))}
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
                    {fileUploadButtonText}
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
