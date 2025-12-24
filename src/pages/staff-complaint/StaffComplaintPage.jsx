import React from 'react';
import { useNavigate } from 'react-router';

const StaffComplaintPage = () => {
   const navigate = useNavigate();
   const navigateOptions = [
      {
         title: 'Feedback',
         description:
            'This form is for general feedback from staff members about workplace conditions, team dynamics, or suggestions for improvement. It helps us create a better work environment.',
         bgColor: '#F7F3FF',
         route: '/work/staff-complaint/FeedbackForm',
      },

      {
         title: 'Complaint',
         description:
            'This form is for formal complaints regarding workplace issues, misconduct, or violations of company policies. It ensures that serious concerns are addressed appropriately and confidentially.',
         bgColor: '#FFF0F0',
         route: '/work/staff-complaint/ComplaintForm',
      },
   ];

   const handleNavigate = (path) => {
      // Build query params for navigation
      navigate(path);
   };

   return (
      <div className="py-8 px-4 max-w-xl mx-auto space-y-4">
         {navigateOptions.map((item) => (
            <div
               key={item.title}
               onClick={() => handleNavigate(item.route)}
               className="cursor-pointer border border-gray-300 rounded-xl p-4 transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-gray-500"
               style={{ backgroundColor: item.bgColor }}
            >
               <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                  {item.title}
               </h4>
               <div className="text-xs text-gray-700 leading-relaxed">
                  {item.description}
               </div>
            </div>
         ))}
      </div>
   );
};

export default StaffComplaintPage;
