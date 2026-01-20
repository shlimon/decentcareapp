import React from 'react';

const CustomProgressBarLeave = ({ progress, color, usedLabel, totalLabel }) => {
   const isValidProgress =
      !isNaN(progress) && progress !== null && progress !== undefined;
   const displayProgress = isValidProgress ? progress : 0;
   // const displayLabel = isValidProgress ? `${progress}%` : 'n/a';

   return (
      <div className="space-y-2">
         <div className="relative h-[9px] bg-gray-300 rounded-full overflow-hidden">
            <div
               className="h-full rounded-full transition-all duration-300"
               style={{ width: `${displayProgress}%`, backgroundColor: color }}
            />
            {/* <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[21px] font-bold text-black z-10">
                  {displayLabel}
               </span>
            </div> */}
         </div>
         <div className="flex justify-between text-[12px] text-gray-500">
            <span>{usedLabel}</span>
            <span>{totalLabel}</span>
         </div>
      </div>
   );
};

export default CustomProgressBarLeave;
