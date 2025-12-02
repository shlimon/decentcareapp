import DocumentViewerForApp from '@components/reusable/DocumentViewerForApp';
import useDocumentsData from '@hooks/useDocumentsData';
import React, { useMemo } from 'react';
import StatCard from './StatCard';

const ShowDocument = ({ onUploadDocument }) => {
   // Get user data
   const userData = useMemo(() => {
      const user = localStorage.getItem('user_data');
      return user ? JSON.parse(user) : null;
   }, []);

   const staffId = userData?.user?._id;

   // Fetch documents
   const {
      data: documentsData,
      isLoading: isLoadingDocuments,
      isError: isErrorDocuments,
   } = useDocumentsData(staffId);

   // Extract documents array from the response
   const documents = useMemo(() => {
      if (!documentsData) return [];

      // If documentsData is already an array
      if (Array.isArray(documentsData)) {
         return documentsData;
      }

      // If documentsData is an object with documents property
      if (documentsData.documents && Array.isArray(documentsData.documents)) {
         return documentsData.documents;
      }

      return [];
   }, [documentsData]);

   // Handle case where user data is not available
   if (!staffId) {
      return (
         <div className="py-8 px-4">
            <div className="card">
               <div className="flex justify-center items-center h-80">
                  <p className="text-red-500">
                     User data not found. Please log in again.
                  </p>
               </div>
            </div>
         </div>
      );
   }

   // Handle loading state
   if (isLoadingDocuments) {
      return (
         <div className="py-8 px-4">
            <div className="card">
               <div className="flex justify-center items-center h-80">
                  <p className="text-gray-500">Loading documents...</p>
               </div>
            </div>
         </div>
      );
   }

   // Handle error state
   if (isErrorDocuments) {
      return (
         <div className="py-8 px-4">
            <div className="card">
               <div className="flex justify-center items-center h-80">
                  <p className="text-red-500">
                     Failed to load documents. Please try again.
                  </p>
               </div>
            </div>
         </div>
      );
   }

   // Handle empty or no documents
   if (!documents || documents.length === 0) {
      return (
         <div className="py-8 px-4">
            <div className="card">
               <div className="flex justify-center items-center h-80">
                  <p className="text-gray-500">No documents found.</p>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="max-w-[600px] mx-auto   space-y-4">
         <div className="flex gap-3 text-center">
            <StatCard
               title="Documents"
               value={documents.length}
               bgColor="bg-[#EAFFF5]"
               valueColor="text-[#00A672]"
            />

            <StatCard
               title="Expiring Soon"
               value={
                  documents.filter((doc) => doc.status === 'Expire In').length
               }
               bgColor="bg-[#FFF7ED]"
               valueColor="text-[#FE9239]"
            />

            <StatCard
               title="Expired"
               value={
                  documents.filter((doc) => doc.status === 'Expired').length
               }
               bgColor="bg-[#FFF0F0]"
               valueColor="text-[#FF5E5E]"
            />
         </div>
         <div className="">
            <div className="flex flex-col gap-4">
               {documents?.map((document) => (
                  <div key={document._id}>
                     <div className="justify-center items-center">
                        <DocumentViewerForApp
                           document={{
                              _id: document._id,
                              documentUrl: document.documentUrl,
                              documentName: document.documentName,
                              documentType: document.documentType,
                              documentNumber: document.documentNumber,
                              uploadTime: document.uploadTime,
                              expiryDate: document.expiryDate,
                              status: document.status,
                           }}
                           modalViews={['jpg', 'jpeg', 'png', 'pdf']}
                           onUploadDocument={() =>
                              onUploadDocument(document)
                           }
                        />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

export default ShowDocument;
