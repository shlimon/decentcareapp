import {
   DateSelection,
   Select,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import React, { memo } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import SearchableSelect from '../reusable/SearchableSelect';

const FinancialTransactionForms = () => {
   const methods = useForm({
      defaultValues: {
         participant: '',
         item: '',
         paymentMethod: '',
         receiveAmount: 0,
         returnAmount: 0,
         itemPrice: 0,
         description: '',
         transaction: '',
         signature: {
            participant: '',
            staff: '',
         },
         receipt: '',
      },
   });
   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = methods;
   const onSubmit = (data) => {
      // TODO: replace with real submit logic
      console.log('FinancialTransactionForms submit', data);
   };

   // watch paymentMethod here
   const paymentMethod = watch('paymentMethod');

   /*
    
		participant: { type: Schema.Types.ObjectId, ref: "ADParticipant", required: true },
		
		item: { type: String, required: true },
		paymentMethod: { type: String, enum: ["Cash", "Card"] },
		receiveAmount: { type: Number },
		returnAmount: { type: Number },
		itemPrice: { type: Number },
		description: { type: String },
		transactionDate: { type: Date },
		
		signature: {
			participant: { type: String },
			staff: { type: String }
		},
		receipt: { type: String }
    */

   return (
      <div className="">
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-8">
                  Financial Transaction Form
               </h1>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Controller
                     name="participant"
                     control={control}
                     rules={{ required: 'Please select a participant' }}
                     render={({ field }) => (
                        <SearchableSelect
                           label="Select Participant"
                           value={field.value}
                           onChange={field.onChange}
                           onDepartmentChange={(dept) =>
                              setValue('departmentName', dept)
                           }
                           showDepartment={true}
                           error={errors.participant?.message}
                        />
                     )}
                  />
                  <Controller
                     name="item"
                     control={control}
                     render={({ field }) => (
                        <Text
                           label="Item name"
                           placeholder="Enter item name"
                           {...field}
                           error={errors.item?.message}
                        />
                     )}
                  />

                  <Controller
                     name="paymentMethod"
                     control={control}
                     render={({ field }) => (
                        <Select
                           {...field}
                           label="Payment Method"
                           options={[
                              { value: 'Cash', label: 'Cash' },
                              {
                                 value: 'Card',
                                 label: 'Card',
                              },
                           ]}
                           error={errors.paymentMethod?.message}
                        />
                     )}
                  />
                  {/* itemPrice */}
                  <Controller
                     name="itemPrice"
                     control={control}
                     render={({ field }) => (
                        <Text
                           label="Item Price"
                           placeholder="Enter item price"
                           {...field}
                           error={errors.itemPrice?.message}
                        />
                     )}
                  />

                  {paymentMethod === 'Cash' && (
                     <div className="space-y-4">
                        {/* receiveAmount */}
                        <Controller
                           name="receiveAmount"
                           control={control}
                           render={({ field }) => (
                              <Text
                                 label="Money received"
                                 placeholder="Enter money received"
                                 {...field}
                                 error={errors.receiveAmount?.message}
                              />
                           )}
                        />
                        {/* returnAmount */}
                        <Controller
                           name="returnAmount"
                           control={control}
                           render={({ field }) => (
                              <Text
                                 label="Money returned"
                                 placeholder="Enter money returned"
                                 {...field}
                                 error={errors.returnAmount?.message}
                              />
                           )}
                        />
                     </div>
                  )}
                  {/* description */}
                  <Controller
                     name="description"
                     control={control}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Description of the item purchased"
                           placeholder="Enter description"
                           error={errors.description?.message}
                        />
                     )}
                  />
                  {/* transaction date */}
                  <Controller
                     name="transaction"
                     control={control}
                     render={({ field }) => (
                        <DateSelection
                           label="Transaction Date"
                           {...field}
                           placeholder="Select date"
                           error={errors.transaction?.message}
                           maxDate={new Date().toISOString()}
                        />
                     )}
                  />
                  {/* receipt  */}
                  {/* <Controller
                     name="receipt"
                     control={control}
                     render={({ field }) => (
                        <FileUpload
                           value={value}
                           onChange={onChange}
                           onDocumentUpload={async (documentPayload) =>
                              documentPayload.file
                           }
                           title="Upload receipt"
                           description="Drop your files here or click to upload"
                           accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                           supportedFormats={[
                              'JPG',
                              'JPEG',
                              'PNG',
                              'PDF',
                              'DOC',
                              'DOCX',
                           ]}
                           maxSize={5 * 1024 * 1024} // 5MB
                           allowdocuments={true}
                           documentformats={[
                              'JPG',
                              'JPEG',
                              'PNG',
                              'PDF',
                              'DOC',
                              'DOCX',
                           ]}
                           error={errors.consent?.message}
                           disabled={isSubmitting}
                           mode="enhanced"
                           showdescription={false}
                           className="text-gray-500"
                           modalShowWhenUpload={false}
                        />
                     )}
                  /> */}
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default memo(FinancialTransactionForms);
