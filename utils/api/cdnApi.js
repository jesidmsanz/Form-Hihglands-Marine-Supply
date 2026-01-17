import axios from 'axios';
import { publicEnv } from '@/utils/publicEnv';

export const cdnApi = axios.create({
  baseURL: 'https://cdn.it49.com/an1ince54c3/',
  headers: {
    Authorization: `Bearer ${publicEnv.tokenCdn}`,
  },
});

export const cdnAuthApi = {
  upload: async (file, folder) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const { data } = await cdnApi.post('upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        url: data.url || '',
        fileId: data.fileId || '',
        filePath: data.filePath || '',
        width: data.width || '',
        height: data.height || '',
        originalName: file.name,
        size: file.size,
        type: file.type,
      };
    } catch (error) {
      console.error('CDN Upload Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Upload failed',
      };
    }
  },

  delete: async (fileId) => {
    try {
      await cdnApi.delete(`delete/${fileId}`);
      return { success: true };
    } catch (error) {
      console.error('CDN Delete Error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Delete failed',
      };
    }
  },
};
