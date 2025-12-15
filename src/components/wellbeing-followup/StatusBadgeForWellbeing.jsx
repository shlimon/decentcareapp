import { memo } from 'react';

const StatusBadgeForWellbeing = ({ status }) => {
   let color;

   switch (status) {
      case 'In Progress':
         color = 'bg-blue-500 text-white';
         break;

      case 'Not started':
         color = 'bg-gray-200 text-gray-700';
         break;

      case 'Completed':
         color = 'bg-green-500 text-white';
         break;

      default:
         color = 'bg-gray-200 text-gray-700';
   }

   return (
      <span
         className={`inline-block px-3 py-1 rounded-full text-xs text-nowrap font-medium ${color}`}
      >
         {status}
      </span>
   );
};
export default memo(StatusBadgeForWellbeing);
