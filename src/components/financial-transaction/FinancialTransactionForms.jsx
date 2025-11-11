import {
   DateSelection,
   File,
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

   /* this is the schema for reference
    
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
                     rules={{ required: 'Item name is required' }}
                     render={({ field }) => (
                        <Text
                           label="Item name"
                           placeholder="Enter item name"
                           {...field}
                           error={errors.item?.message}
                           required
                        />
                     )}
                  />

                  <Controller
                     name="paymentMethod"
                     control={control}
                     rules={{ required: 'Payment method is required' }}
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
                           required
                        />
                     )}
                  />
                  {/* itemPrice */}
                  <Controller
                     name="itemPrice"
                     control={control}
                     rules={{ required: 'Item price is required' }}
                     render={({ field }) => (
                        <Text
                           label="Item Price"
                           placeholder="Enter item price"
                           {...field}
                           error={errors.itemPrice?.message}
                           required
                        />
                     )}
                  />

                  {paymentMethod === 'Cash' && (
                     <div className="space-y-4">
                        {/* receiveAmount */}
                        <Controller
                           name="receiveAmount"
                           control={control}
                           rules={{ required: 'Money received is required' }}
                           render={({ field }) => (
                              <Text
                                 label="Money received"
                                 placeholder="Enter money received"
                                 {...field}
                                 error={errors.receiveAmount?.message}
                                 required
                              />
                           )}
                        />
                        {/* returnAmount */}
                        <Controller
                           name="returnAmount"
                           control={control}
                           rules={{ required: 'Money returned is required' }}
                           render={({ field }) => (
                              <Text
                                 label="Money returned"
                                 placeholder="Enter money returned"
                                 {...field}
                                 error={errors.returnAmount?.message}
                                 required
                              />
                           )}
                        />
                     </div>
                  )}
                  {/* description */}
                  <Controller
                     name="description"
                     control={control}
                     rules={{ required: 'Description is required' }}
                     render={({ field }) => (
                        <Textarea
                           {...field}
                           label="Description of the item purchased"
                           placeholder="Enter description"
                           error={errors.description?.message}
                           required
                        />
                     )}
                  />
                  {/* transaction date */}
                  <Controller
                     name="transaction"
                     control={control}
                     rules={{ required: 'Transaction date is required' }}
                     render={({ field }) => (
                        <DateSelection
                           label="Transaction Date"
                           {...field}
                           placeholder="Select date"
                           error={errors.transaction?.message}
                           maxDate={new Date().toISOString()}
                           required
                        />
                     )}
                  />
                  {/* receipt  */}
                  <Controller
                     name="receipt"
                     control={control}
                     rules={{ required: 'Receipt is required' }}
                     render={({
                        field: { onChange, value },
                        fieldState: { error },
                     }) => (
                        <File
                           value={value}
                           onChange={onChange}
                           title="Document"
                           description="Drop your files here or click to upload"
                           accept={[
                              'image/*',
                              '.JPG',
                              '.JPEG',
                              '.pdf',
                              '.doc',
                              '.docx',
                           ]}
                           supportedFormats={[
                              'JPG',
                              'JPEG',
                              'PNG',
                              'PDF',
                              'DOC',
                              'DOCX',
                           ]}
                           maxSize={2 * 1024 * 1024}
                           isUploading={false}
                           error={error?.message}
                           isSuccess={false}
                           className="w-full"
                           showErrors={true}
                           multiple={true}
                           maxFiles={5}
                           required
                        />
                     )}
                  />
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default memo(FinancialTransactionForms);
