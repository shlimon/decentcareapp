import ConflictOfInterestForm from '@components/Conflict-Of-Interest-comp/ConflictOfInterestForm';
import useGetAllMyConflicts from '@hooks/useGetAllMyConflicts';
import React from 'react';

const ConflictOfInterestPage = () => {
   const { data: conflitsData, isLoading: isLoadingConflicts } =
      useGetAllMyConflicts();

   console.log('Conflicts of Interest Data:', conflitsData);
   return (
      <div>
         <ConflictOfInterestForm />
      </div>
   );
};

export default ConflictOfInterestPage;
