import { useState } from 'react';
import type { MediaFile } from '../types';

// API configuration
const API_BASE_URL = 'http://localhost:3001/api';

export const useMediaUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadFile = async (file: File, retries: number = 2): Promise<MediaFile> => {
    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error(`File "${file.name}" quá lớn. Kích thước tối đa: 10MB`);
    }

    setUploading(true);
    setUploadProgress(0);

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const formData = new FormData();
        formData.append('files', file);

        // Create XMLHttpRequest to track upload progress
        const result = await new Promise<MediaFile>((resolve, reject) => {
          const xhr = new XMLHttpRequest();

          // Track upload progress
          xhr.upload.addEventListener('progress', (event) => {
            if (event.lengthComputable) {
              const progress = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(progress);
            }
          });

          xhr.addEventListener('load', () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                
                // Parse backend response structure: { success: true, data: [uploadResults] }
                const uploadedFile = response.data?.[0] || response.files?.[0] || response;
                
                const mediaFile: MediaFile = {
                  id: uploadedFile.publicId || uploadedFile.id || Date.now().toString(),
                  name: file.name,
                  url: uploadedFile.url || uploadedFile.secure_url,
                  type: file.type.startsWith('image/') ? 'image' : 'video',
                  size: file.size,
                  uploadedAt: uploadedFile.uploadedAt || new Date().toISOString(),
                  publicId: uploadedFile.publicId, // Thêm publicId để có thể delete
                  resourceType: uploadedFile.resourceType || (file.type.startsWith('image/') ? 'image' : 'video')
                };

                setUploading(false);
                setUploadProgress(0);
                resolve(mediaFile);
              } catch (error) {
                setUploading(false);
                setUploadProgress(0);
                reject(new Error('Failed to parse server response'));
              }
            } else {
              setUploading(false);
              setUploadProgress(0);
              
              try {
                const errorResponse = JSON.parse(xhr.responseText);
                reject(new Error(errorResponse.message || `Upload failed with status ${xhr.status}`));
              } catch {
                reject(new Error(`Upload failed with status ${xhr.status}`));
              }
            }
          });

          xhr.addEventListener('error', () => {
            setUploading(false);
            setUploadProgress(0);
            reject(new Error('Network error during upload'));
          });

          xhr.addEventListener('timeout', () => {
            setUploading(false);
            setUploadProgress(0);
            reject(new Error('Upload timeout - File có thể quá lớn hoặc mạng chậm'));
          });

          xhr.open('POST', `${API_BASE_URL}/activities/upload`);
          xhr.timeout = 120000; // 2 minutes timeout (tăng từ 30s)
          xhr.send(formData);
        });

        return result;
      } catch (error) {
        console.error(`Upload attempt ${attempt + 1} failed:`, error);
        
        if (attempt === retries) {
          setUploading(false);
          setUploadProgress(0);
          throw error;
        }
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        setUploadProgress(0);
      }
    }

    throw new Error('Upload failed after all retries');
  };

  const uploadMultipleFiles = async (files: File[]): Promise<MediaFile[]> => {
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      Array.from(files).forEach(file => {
        formData.append('files', file);
      });

      // Use fetch for multiple files upload
      const response = await fetch(`${API_BASE_URL}/activities/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      const result = await response.json();
      
      // Convert response to MediaFile array
      const mediaFiles: MediaFile[] = (result.files || []).map((uploadedFile: any, index: number) => ({
        id: uploadedFile.id || uploadedFile.public_id || `${Date.now()}_${index}`,
        name: files[index]?.name || `file_${index}`,
        url: uploadedFile.url || uploadedFile.secure_url,
        type: files[index]?.type.startsWith('image/') ? 'image' : 'video',
        size: files[index]?.size || 0,
        uploadedAt: uploadedFile.uploadedAt || new Date().toISOString()
      }));

      setUploading(false);
      setUploadProgress(100);
      
      // Reset progress after a short delay
      setTimeout(() => setUploadProgress(0), 1000);
      
      return mediaFiles;
    } catch (error) {
      setUploading(false);
      setUploadProgress(0);
      throw error;
    }
  };

  return {
    uploading,
    uploadProgress,
    uploadFile,
    uploadMultipleFiles
  };
};
