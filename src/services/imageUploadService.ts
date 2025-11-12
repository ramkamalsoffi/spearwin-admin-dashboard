import api from '../utils/axios';

export interface ImageUploadResponse {
  success: boolean;
  message: string;
  data: {
    imageUrl: string;
    originalName: string;
    size: number;
    mimeType: string;
  };
}

export const imageUploadService = {
  /**
   * Upload a single image file
   * @param file - The image file to upload
   * @param folder - Optional folder name (default: 'images')
   * @returns Promise with image URL
   */
  uploadImage: async (file: File, folder: string = 'profile-images'): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ImageUploadResponse>(
      `/file-upload/single?folder=${folder}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      return response.data.data.imageUrl;
    }

    throw new Error(response.data.message || 'Failed to upload image');
  },

  /**
   * Upload multiple image files
   * @param files - Array of image files to upload
   * @param folder - Optional folder name (default: 'images')
   * @returns Promise with array of image URLs
   */
  uploadMultipleImages: async (files: File[], folder: string = 'profile-images'): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<{
      success: boolean;
      message: string;
      data: {
        imageUrls: string[];
        count: number;
      };
    }>(
      `/file-upload/multiple?folder=${folder}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      return response.data.data.imageUrls;
    }

    throw new Error(response.data.message || 'Failed to upload images');
  },

  /**
   * Delete an image by URL
   * @param imageUrl - The URL of the image to delete
   */
  deleteImage: async (imageUrl: string): Promise<void> => {
    await api.delete('/file-upload', {
      data: { imageUrl },
    });
  },

  /**
   * Upload a single document file (PDF, DOC, DOCX, TXT)
   * @param file - The document file to upload
   * @param folder - Optional folder name (default: 'documents')
   * @returns Promise with document URL
   */
  uploadDocument: async (file: File, folder: string = 'documents'): Promise<string> => {
    const formData = new FormData();
    formData.append('document', file);

    const response = await api.post<{
      success: boolean;
      message: string;
      data: {
        documentUrl: string;
        documentKey?: string;
        originalName: string;
        size: number;
        mimeType: string;
      };
    }>(
      `/file-upload/document/single?folder=${folder}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.success) {
      return response.data.data.documentUrl || response.data.data.documentKey || '';
    }

    throw new Error(response.data.message || 'Failed to upload document');
  },
};

