import axiosInstance from "@api/axiosInstance";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUploadDocument = (memberId) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ documentId, documentData }) => {
            const response = await axiosInstance.put(
                `/users/${memberId}/documents/${documentId}`,
                { documentName: documentData.documentName }
            );

            if (response.data.success) {
                await queryClient.invalidateQueries({ queryKey: ['staff-details', memberId] });
            } else {
                throw new Error('Failed to update document');
            }
            return response.data;
        },

        onError: (error) => {
            console.error('Update error:', error);
        },
    });
};