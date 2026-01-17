'use server';

import { uploadFile } from '@/server/components/uploads/controller';

/**
 * Server Action to handle file upload
 */
export async function uploadFileAction(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const contactId = formData.get('contactId') as string;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    if (!contactId) {
      return { success: false, error: 'Contact ID is required' };
    }

    const result = await uploadFile(file, contactId);
    return result;
  } catch (error) {
    console.error('Error in uploadFileAction:', error);
    return {
      success: false,
      error: 'Failed to upload file. Please try again.',
    };
  }
}

