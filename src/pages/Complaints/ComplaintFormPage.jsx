import ComplaintForm from '@pages/forms/complaints-forms/ComplaintForm';
import React from 'react';

const ComplaintFormPage = () => {
   return (
      <div>
         <ComplaintForm />
      </div>
   );
};

export default React.memo(ComplaintFormPage);
