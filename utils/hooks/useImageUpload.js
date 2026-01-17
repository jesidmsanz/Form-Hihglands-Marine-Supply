import { useState, useCallback } from 'react';
import { cdnAuthApi } from '@/utils/api/cdnApi';

export const useImageUpload = (serviceId = null) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const sanitizeFileName = (fileName) => {
    return fileName
      .replace(/[']/g, '')
      .replace(/[^\w\s.-]/g, '_')
      .replace(/\s+/g, '_')
      .toLowerCase();
  };

  const generateFolderPath = (serviceId) => {
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    return `services/${serviceId || 'temp'}/${timestamp}`;
  };

  const uploadSingleImage = useCallback(async (file, onSuccess, onError) => {
    if (!file) {
      onError?.('No file provided');
      return null;
    }

    try {
      setUploading(true);
      
      // Sanitize file name
      const sanitizedFileName = sanitizeFileName(file.name);
      const sanitizedFile = new File([file], sanitizedFileName, { type: file.type });

      // Generate folder path
      const folder = generateFolderPath(serviceId);

      // Upload to CDN
      const result = await cdnAuthApi.upload(sanitizedFile, folder);

      if (result.success) {
        onSuccess?.(result);
        return result;
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Image upload error:', error);
      onError?.(error.message || 'Upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  }, [serviceId]);

  const uploadMultipleImages = useCallback(async (files, onProgress, onComplete, onError) => {
    if (!files || files.length === 0) {
      onError?.('No files provided');
      return [];
    }

    setUploading(true);
    const results = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileId = `file_${i}`;
        
        // Update progress
        setUploadProgress(prev => ({
          ...prev,
          [fileId]: { current: i, total: totalFiles, fileName: file.name }
        }));
        
        onProgress?.(i, totalFiles, file.name);

        const result = await uploadSingleImage(file);
        
        if (result) {
          results.push(result);
        } else {
          console.warn(`Failed to upload file: ${file.name}`);
        }
      }

      onComplete?.(results);
      return results;
    } catch (error) {
      console.error('Multiple image upload error:', error);
      onError?.(error.message || 'Upload failed');
      return [];
    } finally {
      setUploading(false);
      setUploadProgress({});
    }
  }, [uploadSingleImage]);

  const deleteImage = useCallback(async (fileId, onSuccess, onError) => {
    try {
      const result = await cdnAuthApi.delete(fileId);
      
      if (result.success) {
        onSuccess?.(fileId);
      } else {
        throw new Error(result.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Image delete error:', error);
      onError?.(error.message || 'Delete failed');
    }
  }, []);

  return {
    uploading,
    uploadProgress,
    uploadSingleImage,
    uploadMultipleImages,
    deleteImage,
  };
};
