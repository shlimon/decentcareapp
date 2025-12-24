import React from 'react';
import { useForm } from 'react-hook-form';

const StaffComplaintForm = () => {
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

         // -------- Complaint --------
         complaintTopics: [], // ['Bullying', 'Management', ...]
         staffRelations: [], // selected staff ids/names (multi-select)
         complaintDescription: '',
         occurDate: '',
         occurTime: '',

         hasWitness: false,
         witnessDetails: '',

         hasEvidence: false,
         evidenceFiles: [],

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

   return <div>StaffComplaintForm</div>;
};

export default StaffComplaintForm;
