import axiosInstance from '@api/axiosInstance';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// Hook for uploading a new document
export const useUploadDocument = (memberId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (documentData) => {
      const formData = new FormData();

      // Append all fields to FormData
      formData.append('documentName', documentData.documentName);
      formData.append('documentDescription', documentData.documentDescription);
      formData.append('hasExpiry', documentData.hasExpiry);
      formData.append('hasDocumentNumber', documentData.hasDocumentNumber);
      formData.append('source', documentData.source);

      // Add isTraining and training fields
      formData.append('isTraining', documentData.isTraining);
      formData.append('expireId', documentData.expireId);

      if (documentData.training) {
        formData.append('training', documentData.training);
      }

      if (documentData.expiryDate) {
        formData.append('expiryDate', documentData.expiryDate);
      }

      if (documentData.documentNumber) {
        formData.append('documentNumber', documentData.documentNumber);
      }

      // Append the file
      if (documentData.document) {
        formData.append('document', documentData.document);
      }

      const response = await axiosInstance.post(
        `/staffs/${memberId}/document`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        await queryClient.invalidateQueries({
          queryKey: ['staff-details', memberId],
        });
        await queryClient.invalidateQueries({
          queryKey: ['staff-documents'],
        });

      } else {
        throw new Error(response.data.message || 'Failed to upload document');
      }

      return response.data;
    },

    onError: (error) => {
      console.error('Upload error:', error);
    },
  });
};

// Hook for updating an existing document
export const useUpdateDocument = (memberId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId, documentData }) => {
      const response = await axiosInstance.put(
        `/users/${memberId}/documents/${documentId}`,
        { documentName: documentData.documentName }
      );

      if (response.data.success) {
        await queryClient.invalidateQueries({
          queryKey: ['staff-details', memberId],
        });
        await queryClient.invalidateQueries({
          queryKey: ['staff-documents'],
        });
      } else {
        throw new Error(response.data.message || 'Failed to update document');
      }

      return response.data;
    },

    onError: (error) => {
      console.error('Update error:', error);
    },
  });
};
