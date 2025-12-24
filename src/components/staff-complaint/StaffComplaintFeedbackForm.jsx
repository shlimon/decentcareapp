import React from 'react';
import { useForm } from 'react-hook-form';

const StaffComplaintFeedbackForm = () => {
   const methods = useForm({
      defaultValues: {
         // Common
         conflictType: '', // 'feedback' | 'complaint'
         isAnonymous: true,

         // If NOT anonymous
         name: '',
         position: '',
         department: '',
         contact: '',

         // -------- Feedback / Suggestion --------
         feedbackTopics: [], // ['Workplace culture', 'Systems or processes', ...]
         feedbackMessage: '',

         // -------- Declaration / Sign --------
         declaration: false,
         signature: '',
      },
   });

   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = methods;

   return <div>StaffComplaintFeedbackForm</div>;
};

export default StaffComplaintFeedbackForm;
