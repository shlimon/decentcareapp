import DocumentViewer from '@components/reusable/DocumentViewer';
import useDocumentsData from '@hooks/useDocumentsData';
import React, { useMemo } from 'react';

const TrainingFormPage = () => {
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

   return (
      <div className="py-8 px-4 max-w-xl mx-auto bg-white">
         <div className="flex items-center justify-center h-64">
            {documentsData?.map((document) => (
               <div key={document._id} className="">
                  <div className="">
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
   );
};

export default TrainingFormPage;
