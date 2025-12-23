import NavigateButton from '@components/ui/NavigateButton';
import { ArrowLeft, Plus } from 'lucide-react';
import React from 'react';

const ConflictOfInterestPage = () => {
   return (
      <div className='py-8 px-4 max-w-xl mx-auto'>
         <div className='flex justify-between items-center'>
            <NavigateButton
               navigateUrl="/forms"
               title="Back to forms"
               icon={ArrowLeft}
               iconPosition="left"
            />
            <NavigateButton
               navigateUrl="/forms/conflict-of-interest/create"
               title="Create new"
               icon={Plus}
               iconPosition="right"
            />
         </div>

         <div></div>
      </div>
   );
};

export default ConflictOfInterestPage;
