import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { connectDB } from '@/lib/db';
import { Contact } from '../contacts/model.js';

const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/pdf', // .pdf
  'image/jpeg', // .jpg, .jpeg
  'image/png', // .png
  'image/webp', // .webp
  'image/gif', // .gif
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Upload file to server
 * @param {File} file - File object from FormData
 * @param {string} contactId - Contact ID to associate the file with
 * @returns {Promise<{success: boolean, filePath?: string, error?: string}>}
 */
export async function uploadFile(file, contactId) {
  try {
    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only Excel, PDF, and image files are allowed.',
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size exceeds 10MB limit.',
      };
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'contacts', contactId);
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileExtension = originalName.split('.').pop();
    const fileName = `${timestamp}_${originalName}`;
    const filePath = join(uploadsDir, fileName);

    // Convert File to Buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Return relative path for database storage
    const relativePath = `/uploads/contacts/${contactId}/${fileName}`;

    // Update contact with file path
    try {
      await connectDB();
      const contact = await Contact.findById(contactId);
      if (contact) {
        const attachments = contact.attachments || [];
        attachments.push(relativePath);
        contact.attachments = attachments;
        await contact.save();
      }
    } catch (error) {
      console.error('Error updating contact with file path:', error);
      // Don't fail the upload if database update fails
    }

    return {
      success: true,
      filePath: relativePath,
      fileName: originalName,
      fileSize: file.size,
      fileType: file.type,
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return {
      success: false,
      error: 'Failed to upload file. Please try again.',
    };
  }
}

/**
 * Delete file from server
 * @param {string} filePath - Relative path to the file
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deleteFile(filePath) {
  try {
    const { unlink } = await import('fs/promises');
    const { join } = await import('path');

    const fullPath = join(process.cwd(), 'public', filePath);
    await unlink(fullPath);

    return { success: true };
  } catch (error) {
    console.error('Error deleting file:', error);
    return {
      success: false,
      error: 'Failed to delete file.',
    };
  }
}

