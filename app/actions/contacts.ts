'use server';

import { z } from 'zod';
import { connectDB } from '@/lib/db';
import { Contact } from '@/server/components/contacts/model';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import controllerContacts from '@/server/components/contacts/controller';

// Helper function to serialize Mongoose documents to plain objects
const serializeContact = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject({ getters: true }) : doc;

  // Create a plain object without any Mongoose methods or ObjectId buffers
  const plain: any = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && !key.startsWith('__')) {
      const value = obj[key];
      if (key === '_id') {
        plain[key] = value?.toString ? value.toString() : String(value);
      } else if (value instanceof Date) {
        plain[key] = value.toISOString();
      } else if (value && typeof value === 'object' && value.constructor?.name === 'ObjectId') {
        plain[key] = value.toString();
      } else if (Array.isArray(value)) {
        plain[key] = value.map((item: any) => {
          if (item && typeof item === 'object') {
            if (item.constructor?.name === 'ObjectId') {
              return item.toString();
            }
            // Handle subdocuments (like items array)
            if (item.toObject) {
              const subObj = item.toObject({ getters: true });
              const plainSubObj: any = {};
              for (const subKey in subObj) {
                if (Object.prototype.hasOwnProperty.call(subObj, subKey) && !subKey.startsWith('__')) {
                  const subValue = subObj[subKey];
                  if (subKey === '_id' || subKey === 'id') {
                    plainSubObj[subKey] = subValue?.toString ? subValue.toString() : String(subValue);
                  } else if (subValue instanceof Date) {
                    plainSubObj[subKey] = subValue.toISOString();
                  } else if (subValue && typeof subValue === 'object' && subValue.constructor?.name === 'ObjectId') {
                    plainSubObj[subKey] = subValue.toString();
                  } else {
                    plainSubObj[subKey] = subValue;
                  }
                }
              }
              return plainSubObj;
            }
            // Handle plain objects
            const plainItem: any = {};
            for (const itemKey in item) {
              if (Object.prototype.hasOwnProperty.call(item, itemKey) && !itemKey.startsWith('__')) {
                const itemValue = item[itemKey];
                if (itemKey === '_id' || itemKey === 'id') {
                  plainItem[itemKey] = itemValue?.toString ? itemValue.toString() : String(itemValue);
                } else if (itemValue instanceof Date) {
                  plainItem[itemKey] = itemValue.toISOString();
                } else if (itemValue && typeof itemValue === 'object' && itemValue.constructor?.name === 'ObjectId') {
                  plainItem[itemKey] = itemValue.toString();
                } else {
                  plainItem[itemKey] = itemValue;
                }
              }
            }
            return plainItem;
          }
          return item;
        });
      } else {
        plain[key] = value;
      }
    }
  }

  return plain;
};

// Schemas de validación con Zod
const contactIdSchema = z.string().min(1, 'Contact ID is required');

// Schema base flexible para ambos formularios
const contactCreateSchema = z.object({
  // Campos originales (formulario de contacto general)
  Subject: z.string().optional(),
  Procedures: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  ipAddress: z.string().optional(),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  sendInformation: z.boolean().optional(),
  token: z.string().optional(),
  // Nuevos campos para Landing Page (formulario de servicios)
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  company: z.string().optional(),
  vessel: z.string().optional(),
  arrivalDate: z.string().optional(),
  departureDate: z.string().optional(),
  port: z.string().optional(),
  vesselCategory: z.enum(['Fishing', 'Commercial Merchant', 'Cruise', 'Military', 'Special']).optional(),
  request: z.string().optional(),
  code: z.union([z.string(), z.array(z.string())]).optional(),
  description: z.union([z.string(), z.array(z.string())]).optional(),
  unit: z.union([z.string(), z.array(z.string())]).optional(),
  quantity: z.union([z.string(), z.array(z.string())]).optional(),
  items: z.array(z.object({
    code: z.string(),
    description: z.string(),
    unit: z.string(),
    quantity: z.string(),
  })).optional(),
  agent: z.string().optional(),
  comment: z.string().optional(),
  attachments: z.union([z.string(), z.array(z.string())]).optional(),
}).refine((data) => {
  const hasFullName = data.fullName && typeof data.fullName === 'string' && data.fullName.trim().length > 0;

  // Si tiene fullName, valida los campos requeridos del formulario
  if (hasFullName) {
    // Verificar si hay attachments (incluyendo 'pending' que indica que hay un archivo que se subirá después)
    const hasAttachments = data.attachments && (
      (Array.isArray(data.attachments) && data.attachments.length > 0) ||
      (typeof data.attachments === 'string' && data.attachments.trim().length > 0)
    );

    // Si NO hay attachments, validar que tenga items completos
    if (!hasAttachments) {
      // Verificar que tenga items completos (code, description, unit, quantity)
      const hasCompleteItems = data.items && Array.isArray(data.items) && data.items.length > 0 && data.items.some((item: any) =>
        item.code && typeof item.code === 'string' && item.code.trim().length > 0 &&
        item.description && typeof item.description === 'string' && item.description.trim().length > 0 &&
        item.unit && typeof item.unit === 'string' && item.unit.trim().length > 0 &&
        item.quantity && typeof item.quantity === 'string' && item.quantity.trim().length > 0
      );

      // Debe tener items completos si no hay attachments
      if (!hasCompleteItems) {
        return false;
      }

      // Si tiene items, validar que todos los items tengan description, unit y quantity
      if (data.items && Array.isArray(data.items) && data.items.length > 0) {
        const hasInvalidItems = data.items.some((item: any) => {
          // Si tiene code, debe tener description, unit y quantity
          if (item.code && typeof item.code === 'string' && item.code.trim().length > 0) {
            return !(
              item.description && typeof item.description === 'string' && item.description.trim().length > 0 &&
              item.unit && typeof item.unit === 'string' && item.unit.trim().length > 0 &&
              item.quantity && typeof item.quantity === 'string' && item.quantity.trim().length > 0
            );
          }
          // Si no tiene code pero tiene description, unit o quantity, debe tenerlos todos
          if (item.description || item.unit || item.quantity) {
            return !(
              item.description && typeof item.description === 'string' && item.description.trim().length > 0 &&
              item.unit && typeof item.unit === 'string' && item.unit.trim().length > 0 &&
              item.quantity && typeof item.quantity === 'string' && item.quantity.trim().length > 0
            );
          }
          return false;
        });
        if (hasInvalidItems) {
          return false;
        }
      }
    }

    return !!(
      data.company && typeof data.company === 'string' && data.company.trim().length > 0 &&
      data.vessel && typeof data.vessel === 'string' && data.vessel.trim().length > 0 &&
      data.arrivalDate &&
      data.departureDate &&
      data.port && typeof data.port === 'string' && data.port.trim().length > 0 &&
      data.vesselCategory &&
      data.comment && typeof data.comment === 'string' && data.comment.trim().length > 0
    );
  }

  // Si no tiene fullName, debe tener message, request o comment
  const hasMessage = data.message && typeof data.message === 'string' && data.message.trim().length > 0;
  const hasRequest = data.request && typeof data.request === 'string' && data.request.trim().length > 0;
  const hasComment = data.comment && typeof data.comment === 'string' && data.comment.trim().length > 0;
  return hasMessage || hasRequest || hasComment;
}, {
  message: 'Please fill all required fields. You must either provide complete items (code, description, unit, quantity) or upload a file.',
});

const contactUpdateSchema = z.object({
  Subject: z.string().optional(),
  Procedures: z.string().optional(),
  fullName: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().optional(),
  message: z.string().optional(),
  ipAddress: z.string().optional(),
  url: z.string().url('Invalid URL').optional(),
  sendInformation: z.boolean().optional(),
});

// Tipos de retorno
type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Obtener todos los contactos (Admin only)
 */
export async function getContactsAction(): Promise<ActionResult<any[]>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.roles?.includes('admin')) {
      return { success: false, error: 'Unauthorized' };
    }

    await connectDB();
    const contacts = await (Contact as any).find({}).sort({ createdAt: -1 }).lean();
    // Serialize contacts to plain objects
    const serializedContacts = contacts.map((contact: any) => {
      const serialized = serializeContact(contact);
      // Ensure items array is properly serialized
      if (serialized?.items && Array.isArray(serialized.items)) {
        serialized.items = serialized.items.map((item: any) => {
          if (item && typeof item === 'object') {
            const plainItem: any = {};
            for (const key in item) {
              if (Object.prototype.hasOwnProperty.call(item, key) && !key.startsWith('__')) {
                const value = item[key];
                if (key === '_id' || key === 'id') {
                  plainItem[key] = value?.toString ? value.toString() : String(value);
                } else {
                  plainItem[key] = value;
                }
              }
            }
            return plainItem;
          }
          return item;
        });
      }
      return serialized;
    });
    return { success: true, data: serializedContacts };
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return { success: false, error: 'Failed to fetch contacts' };
  }
}

/**
 * Obtener un contacto por ID (Admin only)
 */
export async function getContactByIdAction(id: string): Promise<ActionResult<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.roles?.includes('admin')) {
      return { success: false, error: 'Unauthorized' };
    }

    const validationResult = contactIdSchema.safeParse(id);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0].message };
    }

    await connectDB();
    const contact = await (Contact as any).findById(id);

    if (!contact) {
      return { success: false, error: 'Contact not found' };
    }

    return { success: true, data: serializeContact(contact) };
  } catch (error) {
    console.error('Error fetching contact:', error);
    return { success: false, error: 'Failed to fetch contact' };
  }
}

/**
 * Crear un nuevo contacto (Public)
 */
export async function createContactAction(formData: FormData): Promise<ActionResult<any>> {
  try {
    const rawData = {
      Subject: formData.get('Subject')?.toString(),
      Procedures: formData.get('Procedures')?.toString(),
      fullName: formData.get('fullName')?.toString(),
      email: formData.get('email')?.toString(),
      phone: formData.get('phone')?.toString(),
      message: formData.get('message')?.toString(),
      ipAddress: formData.get('ipAddress')?.toString(),
      url: formData.get('url')?.toString(),
      sendInformation: formData.get('sendInformation') === 'true',
      token: formData.get('token')?.toString(),
    };

    const validationResult = contactCreateSchema.safeParse(rawData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0].message };
    }

    await connectDB();
    const newContact = new (Contact as any)(validationResult.data);
    const savedContact = await newContact.save();

    return { success: true, data: serializeContact(savedContact) };
  } catch (error) {
    console.error('Error creating contact:', error);
    return { success: false, error: 'Failed to create contact' };
  }
}

/**
 * Crear contacto con objeto (para llamadas programáticas)
 */
export async function createContactActionWithObject(
  data: z.infer<typeof contactCreateSchema>
): Promise<ActionResult<any>> {
  try {
    const validationResult = contactCreateSchema.safeParse(data);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error.issues);
      console.error('Data received:', JSON.stringify(data, null, 2));
      return { success: false, error: validationResult.error.issues[0].message };
    }

    // Convert date strings to Date objects for MongoDB
    const contactData = {
      ...validationResult.data,
      arrivalDate: validationResult.data.arrivalDate
        ? new Date(validationResult.data.arrivalDate)
        : undefined,
      departureDate: validationResult.data.departureDate
        ? new Date(validationResult.data.departureDate)
        : undefined,
      attachments: validationResult.data.attachments
        ? Array.isArray(validationResult.data.attachments)
          ? validationResult.data.attachments
          : [validationResult.data.attachments]
        : undefined,
    };

    await connectDB();
    const newContact = new (Contact as any)(contactData);
    const savedContact = await newContact.save();

    // Serialize to plain object for client
    const serialized = serializeContact(savedContact);
    return { success: true, data: serialized };
  } catch (error) {
    console.error('Error creating contact:', error);
    return { success: false, error: 'Failed to create contact' };
  }
}

/**
 * Actualizar contacto (Admin only)
 */
export async function updateContactAction(
  id: string,
  formData: FormData
): Promise<ActionResult<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.roles?.includes('admin')) {
      return { success: false, error: 'Unauthorized' };
    }

    const idValidation = contactIdSchema.safeParse(id);
    if (!idValidation.success) {
      return { success: false, error: idValidation.error.issues[0].message };
    }

    const rawData = {
      Subject: formData.get('Subject')?.toString(),
      Procedures: formData.get('Procedures')?.toString(),
      fullName: formData.get('fullName')?.toString(),
      email: formData.get('email')?.toString(),
      phone: formData.get('phone')?.toString(),
      message: formData.get('message')?.toString(),
      ipAddress: formData.get('ipAddress')?.toString(),
      url: formData.get('url')?.toString(),
      sendInformation: formData.get('sendInformation') === 'true',
    };

    const validationResult = contactUpdateSchema.safeParse(rawData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0].message };
    }

    await connectDB();
    const contact = await (Contact as any)
      .findByIdAndUpdate(id, validationResult.data, { new: true })
      .lean();

    if (!contact) {
      return { success: false, error: 'Contact not found' };
    }

    return { success: true, data: contact };
  } catch (error) {
    console.error('Error updating contact:', error);
    return { success: false, error: 'Failed to update contact' };
  }
}

/**
 * Eliminar contacto (Admin only)
 */
export async function deleteContactAction(id: string): Promise<ActionResult<void>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.roles?.includes('admin')) {
      return { success: false, error: 'Unauthorized' };
    }

    const validationResult = contactIdSchema.safeParse(id);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.issues[0].message };
    }

    await connectDB();
    const result = await Contact.deleteOne({ _id: id });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Contact not found' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error deleting contact:', error);
    return { success: false, error: 'Failed to delete contact' };
  }
}

/**
 * Actualizar status y nextAction de un contacto (Admin only)
 */
const statusSchema = z.enum(['pending', 'approved', 'rejected', 'spam', 'completed']);
const nextActionSchema = z.enum(['quote']).optional().nullable();

export async function updateContactStatusAction(
  id: string,
  status?: string,
  nextAction?: string | null
): Promise<ActionResult<any>> {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.roles?.includes('admin')) {
      return { success: false, error: 'Unauthorized' };
    }

    const idValidation = contactIdSchema.safeParse(id);
    if (!idValidation.success) {
      return { success: false, error: idValidation.error.issues[0].message };
    }

    const updateData: any = {};

    if (status !== undefined) {
      const statusValidation = statusSchema.safeParse(status);
      if (!statusValidation.success) {
        return { success: false, error: 'Invalid status value' };
      }
      updateData.status = status;
    }

    if (nextAction !== undefined) {
      const nextActionValidation = nextActionSchema.safeParse(nextAction);
      if (!nextActionValidation.success && nextAction !== null) {
        return { success: false, error: 'Invalid nextAction value' };
      }
      updateData.nextAction = nextAction || undefined;
    }

    const updatedContact = await controllerContacts.statusChange({
      id,
      status: updateData.status,
      nextAction: updateData.nextAction,
    });

    if (!updatedContact) {
      return { success: false, error: 'Contact not found' };
    }

    return { success: true, data: serializeContact(updatedContact) };
  } catch (error) {
    console.error('Error updating contact status:', error);
    return { success: false, error: 'Failed to update contact status' };
  }
}
