import NavigateButton from "@components/ui/NavigateButton";
import StatusBadge from "@components/ui/StatusBadge";
import useGetMyConflictList from "@hooks/conflict/useGetMyConflictList";
import { formatDate } from "@utils/DateFormation";
import { ArrowLeft, Plus } from "lucide-react";
import React from "react";

const ConflictOfInterestPage = () => {
   const { data: conflictList, isLoading, error } = useGetMyConflictList();

   // loading skeleton
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

   // error state
   if (error) {
      return (
         <div className="py-8 px-4 max-w-xl mx-auto text-center">
            <p className="text-red-600 font-medium">
               Failed to load Conflict of Interest reports
            </p>
         </div>
      );
   }

   return (
      <div className="py-8 px-4 max-w-xl mx-auto">
         {/* Header Buttons */}
         <div className="flex justify-between items-center mb-6">
            <NavigateButton
               backUrl="/forms"
               title="Back to forms"
               icon={ArrowLeft}
               iconPosition="left"
            />
            <NavigateButton
               backUrl="/forms/conflict-of-interest/create"
               title="Create new"
               icon={Plus}
               iconPosition="right"
            />
         </div>

         {/* Empty State */}
         {(!conflictList || conflictList.length === 0) && (
            <div className="text-center py-10">
               <p className="text-gray-600 mb-4">
                  No Conflict of Interest reports found
               </p>
               <NavigateButton
                  backUrl="/forms/conflict-of-interest/create"
                  title="Create your first report"
                  icon={Plus}
                  iconPosition="right"
               />
            </div>
         )}

         {/* Conflict List */}
         <div className="space-y-4">
            {conflictList?.map((item) => (
               <div
                  key={item._id}
                  className="group border border-gray-200 bg-white p-5 rounded-xl
              hover:shadow-md hover:border-gray-300 transition-all duration-200"
               >
                  <div className="flex justify-between items-start">

                     {/* Left Section */}
                     <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800">
                           {item.conflictNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                           {item.conflictType}
                        </p>
                        <p className="text-xs text-gray-500">
                           Raiser:{" "}
                           <span className="font-medium">
                              {item.conflictRaiser?.name || "—"}
                           </span>
                        </p>
                        <p className="text-xs text-gray-500">
                           Date:{" "}
                           <span className="font-medium">
                              {formatDate(item.occurDate)}
                           </span>
                        </p>
                     </div>

                     {/* Right Section */}
                     <div className="flex flex-col items-end space-y-2">
                        <StatusBadge status={item.status} />
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ConflictOfInterestPage;
