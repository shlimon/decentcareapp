import BreadCrumb from '@components/reusable/breadCrumb/BreadCrumb';
import Loading from '@components/reusable/loading/Loading';
import useGetSingleAnnouncement from '@hooks/useGetSingleAnnouncement';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const AnnouncementDetails = () => {
   const { data, isLoading, error } = useGetSingleAnnouncement();
   const navigate = useNavigate();

   const navigation = () => navigate(`/announce`);

   if (isLoading) return <Loading />;
   if (error) return <div className="p-4 text-red-500">Failed to load</div>;

   const announcement = data;

   return (
      <main className="min-h-screen bg-slate-50 p-4">
         {/* Breadcrumb Navigation */}
         <BreadCrumb
            currentPage={`Announcement Details`}
            prevPage={`Announcements`}
            navigation={navigation}
         />

         {/* Card Container */}
         <div className="mt-4 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800">
               {announcement?.title}
            </h2>

            {/* Meta Info */}
            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 gap-1">
               <span>
                  Posted by{' '}
                  <span className="font-medium text-gray-700">
                     {announcement?.createdBy?.name}
                  </span>
               </span>

               <span>{new Date(announcement?.createdAt).toLocaleString()}</span>
            </div>

            {/* Divider */}
            <div className="my-5 border-t border-gray-100" />

            {/* HTML Content */}
            <div
               className="
            text-sm text-gray-700 leading-relaxed
            [&>p]:mb-4
            [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-4
            [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-4
            [&>h1]:text-lg [&>h1]:font-semibold [&>h1]:mb-3
            [&>h2]:text-base [&>h2]:font-semibold [&>h2]:mb-2
            [&>strong]:font-semibold
            [&>a]:text-blue-600 [&>a]:underline
          "
               dangerouslySetInnerHTML={{
                  __html: announcement?.message,
               }}
            />
         </div>
      </main>
   );
};

export default React.memo(AnnouncementDetails);
