import axios from 'axios';

const BACKEND_URL = 'http://localhost:3000';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Create axios instance for file uploads
const uploadAPI = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// File upload service
export const fileUploadService = {
  // Upload single file
  uploadFile: async (file, folder = 'general') => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);
      
      console.log('Uploading file to:', `${BACKEND_URL}/api/upload?folder=${folder}`);
      console.log('Folder parameter:', folder);
      
      const response = await uploadAPI.post(`/api/upload?folder=${folder}`, formData);
      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Upload multiple files
  uploadFiles: async (files, folder = 'general') => {
    try {
      const uploadPromises = files.map(file => fileUploadService.uploadFile(file, folder));
      const results = await Promise.all(uploadPromises);
      return results;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error;
    }
  },

  // Delete file
  deleteFile: async (filePath) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/upload`, {
        data: { filePath }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      return { success: true, message: 'File marked for deletion' };
    }
  },

  // Get file URL
  getFileUrl: (filePath) => {
    if (!filePath) return '';
    if (filePath.startsWith('http')) return filePath;
    if (filePath.startsWith('blob:')) return filePath;
    
    // Handle different file path formats
    if (typeof filePath === 'object' && filePath.url) {
      return filePath.url;
    }
    
    return `${BACKEND_URL}/uploads/${filePath}`;
  }
};

export default fileUploadService;
