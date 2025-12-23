import NavigateButton from "@components/ui/NavigateButton";
import StatusBadge from "@components/ui/StatusBadge";
import useGetMyWhsList from "@hooks/whs/useGetMyWhsList";
import { ArrowLeft, Plus } from "lucide-react";
import React from "react";

const WHSPage = () => {
   const { data: whsList, isLoading, error } = useGetMyWhsList();

   // Loading state
   if (isLoading) {
      return (
         <div className="py-8 px-4 max-w-xl mx-auto space-y-4">
            {[...Array(3)].map((_, i) => (
               <div
                  key={i}
                  className="h-28 bg-gray-100 rounded-xl animate-pulse"
               />
            ))}
         </div>
      );
   }

   // Error state
   if (error) {
      return (
         <div className="py-8 px-4 max-w-xl mx-auto text-center">
            <p className="text-red-600 font-medium">
               Failed to load WHS records
            </p>
         </div>
      );
   }

   return (
      <div className="py-8 px-4 max-w-xl mx-auto">
         {/* Header */}
         <div className="flex justify-between items-center mb-2">
            <NavigateButton
               navigateUrl="/work"
               title="Back to works"
               icon={ArrowLeft}
               iconPosition="left"
            />
            <NavigateButton
               navigateUrl="/work/WHS-form/create"
               title="Create new"
               icon={Plus}
               iconPosition="right"
            />
         </div>

         {/* Empty State */}
         {(!whsList || whsList.length === 0) && (
            <div className="text-center py-10">
               <p className="text-gray-600 mb-4">
                  No WHS reports found
               </p>
               <NavigateButton
                  backUrl="/work/WHS-form/create"
                  title="Create your first WHS"
                  icon={Plus}
                  iconPosition="right"
               />
            </div>
         )}

         {/* WHS List */}
         <div className="space-y-4">
            {whsList?.map((item) => (
               <div
                  key={item._id}
                  className="group border border-gray-200 bg-white p-5 rounded-xl
						hover:shadow-md hover:border-gray-300 transition-all duration-200"
               >
                  <div className="flex justify-between items-start">

                     {/* Left Section */}
                     <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800">
                           {item.whsNumber}
                        </p>

                        <p className="text-sm text-gray-600">
                           {item.location?.city}, {item.location?.suburb}
                        </p>

                        <p className="text-xs text-gray-500">
                           Investigator:{" "}
                           <span className="font-medium">
                              {item.investigatorBy?.name || "N/A"}
                           </span>
                        </p>
                     </div>

                     {/* Right Section */}
                     <div className="flex flex-col items-end space-y-3">

                        {/* Status */}
                        <StatusBadge status={item.status} />

                        {/* Event Type */}
                        <span className="text-xs font-medium text-gray-500 uppercase">
                           {item.eventType}
                        </span>

                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default WHSPage;
