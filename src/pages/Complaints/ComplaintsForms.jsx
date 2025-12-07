import SearchableSelect from '@components/reusable/SearchableSelect';
import React, { useState } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router';

const ComplaintsForms = () => {
   const [participant, setParticipant] = useState('');
   const [departmentName, setDepartmentName] = useState('');
   const navigate = useNavigate();

   const feedbackOptions = [
      {
         title: 'Compliment 🎉',
         description:
            'A compliment is when the participant wants to recognise something that went really well : for example, excellent support, a helpful team member, or a service that made a positive difference. This helps us celebrate what works and share it with our team.',
         bgColor: '#F7FAFC',
         route: '/complaints/complement-form',
      },
      {
         title: 'Suggestion 💡',
         description:
            'A suggestion is an idea the participant has to make our services better, it might be about communication, planning, staff support, or how things are done. It isn’t a complaint, but something the participant thinks could improve their experience.',
         bgColor: '#F7F3FF',
         route: '/complaints/suggestion-form',
      },

      {
         title: 'Complaint 📢',
         description:
            'A complaint is when the participant feels something has gone wrong and needs to be formally investigated and resolved. This may include serious issues like unsafe service, disrespect, lack of action, or repeated problems. It requires a timely response.',
         bgColor: '#FFF0F0',
         route: '/complaints/complaint-form',
      },
   ];

   const handleNavigate = (path) => {
      // Build query params for navigation
      const queryParams = new URLSearchParams({
         participant,
         department: departmentName,
      }).toString();

      navigate(`${path}?${queryParams}`);
   };

   return (
      <div className="py-8 px-4 max-w-xl mx-auto">
         {/* Show feedback options only if both values are selected */}
         {participant && departmentName ? (
            <div className="space-y-4">
               <div className="flex justify-end">
                  <div className="px-3 py-1 rounded-xl border flex items-center gap-2 bg-gray-100 text-xs">
                     <IoArrowBackOutline /> <span>Change Participant</span>
                  </div>
               </div>
               {feedbackOptions.map((item) => (
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
         ) : (
            <div>
               <div className="border border-[#D9D9D9] text-sm text-center py-4 px-2 rounded-xl bg-[#F6F6F6] mb-5">
                  Compliment, Feedback, Suggestion, Concern & Complaint
               </div>

               {/* Participant selector */}
               <SearchableSelect
                  label="Select Participant"
                  value={participant}
                  onChange={setParticipant}
                  onDepartmentChange={setDepartmentName}
                  showDepartment={true}
                  placeholder="Type exact participant name..."
               />
            </div>
         )}
      </div>
   );
};

export default React.memo(ComplaintsForms);
