import { memo } from 'react';

const StatusBadgeForWellbeing = ({ status }) => {
   let color;

   const lowerStatus = status.toLowerCase()

   switch (lowerStatus) {
      case 'in progress':
         color = 'bg-blue-500 text-white';
         break;

      case 'not started':
         color = 'bg-gray-200 text-gray-700';
         break;

      case 'completed':
         color = 'bg-green-500 text-white';
         break;

      case 'overdue':
         color = 'bg-red-500 text-white';
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
