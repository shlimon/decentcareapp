import NavigateButton from '@components/ui/NavigateButton';
import { ArrowLeft, Plus } from 'lucide-react';
import React from 'react';

const WHSPage = () => {
   return (
      <div className='py-8 px-4 max-w-xl mx-auto'>
         <div className='flex justify-between items-center'>
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

         <div></div>
      </div>
   );
};

export default WHSPage;
