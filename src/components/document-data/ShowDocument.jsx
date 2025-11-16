import DocumentViewer from '@components/reusable/DocumentViewer';
import useDocumentsData from '@hooks/useDocumentsData';
import React, { useMemo } from 'react';

const ShowDocument = () => {
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
   if (
      !documentsData ||
      documentsData.length === 0 ||
      documentsData.noRequest
   ) {
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
      <div className="py-8 px-4">
         <div className="">
            <div className="grid grid-cols-1 gap-6">
               {documentsData.map((document) => (
                  <div key={document._id} className="border rounded-lg p-4">
                     <div className="flex-1 overflow-hidden justify-center items-center flex">
                        <DocumentViewer
                           document={{
                              documentUrl: document.documentUrl,
                              documentName: document.documentName,
                              documentType: document.documentType,
                           }}
                           modalViews={['jpg', 'jpeg', 'png', 'pdf']}
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
