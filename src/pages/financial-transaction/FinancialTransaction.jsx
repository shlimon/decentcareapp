import SearchableSelect from '@components/reusable/SearchableSelect';
import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router';

const FinancialTransaction = () => {
   const navigate = useNavigate();
   const [participant, setParticipant] = useState('');
   const [departmentName, setDepartmentName] = useState('');

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
         <div>
            <div className="border border-[#D9D9D9] text-sm text-center py-4 px-2 rounded-xl bg-[#F6F6F6] mb-5">
               Financial Transaction Form
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

            {/* if participant  then automatically navigate to /forms/financial-transaction/forms */}
            {participant &&
               handleNavigate('/forms/financial-transaction/forms')}
         </div>
      </div>
   );
};

export default memo(FinancialTransaction);
