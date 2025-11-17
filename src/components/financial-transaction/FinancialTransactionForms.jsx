import axiosInstance from '@api/axiosInstance';
import {
   DateSelection,
   File,
   Select,
   Text,
   Textarea,
} from '@components/reusable/FormInputs';
import SignatureCanvas from '@components/travel-log/SignatureCanvas';
import React, { memo, useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';

const FinancialTransactionForms = () => {
   const navigate = useNavigate();
   const location = useLocation();

   const [participant, setParticipant] = useState('');
   // const [departmentName, setDepartmentName] = useState('');

   useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const participantParam = queryParams.get('participant');
      // const departmentParam = queryParams.get('department');

      if (participantParam) setParticipant(participantParam);
      // if (departmentParam) setDepartmentName(decodeURIComponent(departmentParam));
   }, [location.search]);

   const methods = useForm({
      defaultValues: {
         participant: '',
         // departmentName: '',
         item: '',
         paymentMethod: '',
         receiveAmount: 0,
         returnAmount: 0,
         itemPrice: 0,
         description: '',
         transaction: '',
         participantSignature: '',
         staffSignature: '',
         receipt: null,
      },
   });

   const {
      handleSubmit,
      control,
      setValue,
      watch,
      formState: { errors },
   } = methods;

   const onSubmit = async (data) => {
      try {
         // Validate signatures
         if (!data.participantSignature) {
            toast.error('Participant signature is required');
            return;
         }
         if (!data.staffSignature) {
            toast.error('Staff signature is required');
            return;
         }

         // Create FormData for file uploads
         const formData = new FormData();

         // Required fields - use participant from state
         formData.append('participant', participant);
         formData.append('item', data.item);

         // Optional fields
         if (data.paymentMethod) {
            formData.append('paymentMethod', data.paymentMethod);
         }

         if (data.itemPrice) {
            formData.append('itemPrice', Number(data.itemPrice));
         }

         if (data.description) {
            formData.append('description', data.description);
         }

         if (data.transaction) {
            formData.append(
               'transactionDate',
               new Date(data.transaction).toISOString()
            );
         }

         // Add cash payment fields if payment method is Cash
         if (data.paymentMethod === 'Cash') {
            if (data.receiveAmount) {
               formData.append('receiveAmount', Number(data.receiveAmount));
            }
            if (data.returnAmount) {
               formData.append('returnAmount', Number(data.returnAmount));
            }
         }

         // Add signatures as base64 strings in the signature object structure
         // The backend expects: signature.participant and signature.staff
         formData.append('signature[participant]', data.participantSignature);
         formData.append('signature[staff]', data.staffSignature);

         // Add receipt file (single file only)
         // Backend will save this and return URL to store in receipt field
         if (data.receipt) {
            formData.append('receipt', data.receipt);
         }

         const response = await axiosInstance.post(
            '/financial-transactions',
            formData,
            {
               headers: {
                  'Content-Type': 'multipart/form-data',
               },
            }
         );

         if (response?.data?.success) {
            toast.success('Transaction Submitted Successfully');
            methods.reset();
            navigate('/forms');
         }
      } catch (error) {
         console.error('Error submitting transaction:', error);
         toast.error(
            error?.response?.data?.message ||
               'Failed to submit transaction. Please try again.'
         );
      }
   };

   // watch paymentMethod here
   const paymentMethod = watch('paymentMethod');
   const itemPrice = watch('itemPrice');
   const receiveAmount = watch('receiveAmount');
   const returnAmount = watch('returnAmount');

   const diff = Number(receiveAmount) - Number(itemPrice);

   return (
      <div className="">
         <FormProvider {...methods}>
            <div className="py-8 px-4 max-w-xl mx-auto bg-white">
               <h1 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-8">
                  Financial Transaction Form
               </h1>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Item Name */}
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

                  {/* Payment Method */}
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
                              { value: 'Card', label: 'Card' },
                           ]}
                           error={errors.paymentMethod?.message}
                           required
                        />
                     )}
                  />

                  {/* Item Price */}
                  <Controller
                     name="itemPrice"
                     control={control}
                     rules={{
                        required: 'Item price is required',
                        validate: (value) => {
                           const num = Number(value);
                           if (isNaN(num) || num <= 0) {
                              return 'Please enter a valid price';
                           }
                           return true;
                        },
                     }}
                     render={({ field }) => (
                        <Text
                           label="Item Price"
                           placeholder="Enter item price"
                           type="number"
                           {...field}
                           error={errors.itemPrice?.message}
                           required
                        />
                     )}
                  />

                  {/* Cash Payment Fields */}
                  {paymentMethod === 'Cash' && (
                     <div className="space-y-4">
                        {/* Money Received */}
                        <Controller
                           name="receiveAmount"
                           control={control}
                           rules={{
                              required: 'Money received is required',
                              validate: (value) => {
                                 const num = Number(value);
                                 if (isNaN(num) || num < 0) {
                                    return 'Please enter a valid amount';
                                 }
                                 return true;
                              },
                           }}
                           render={({ field }) => (
                              <Text
                                 label="Money received"
                                 placeholder="Enter money received"
                                 type="number"
                                 {...field}
                                 error={errors.receiveAmount?.message}
                                 required
                              />
                           )}
                        />
                        {/* Money Returned */}
                        <Controller
                           name="returnAmount"
                           control={control}
                           rules={{
                              required: 'Money returned is required',
                              validate: (value) => {
                                 const num = Number(value);
                                 if (isNaN(num) || num < 0) {
                                    return 'Please enter a valid amount';
                                 }
                                 return true;
                              },
                           }}
                           render={({ field }) => (
                              <Text
                                 label="Money returned"
                                 placeholder="Enter money returned"
                                 type="number"
                                 {...field}
                                 error={errors.returnAmount?.message}
                                 required
                              />
                           )}
                        />
                        {/* show a warning if money returned is not equal to receiveAmount - itemPrice , and show returned money should be ()*/}

                        {receiveAmount && diff !== Number(returnAmount) && (
                           <p className="text-sm text-yellow-600">
                              {diff > 0
                                 ? `Warning: Returned money should be ${diff}.`
                                 : `Warning: You need to receive ${Math.abs(
                                      diff
                                   )} more.`}
                           </p>
                        )}
                     </div>
                  )}

                  {/* Description */}
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

                  {/* Transaction Date */}
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

                  {/* Participant Signature */}
                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        Participant Signature{' '}
                        <span className="text-red-500">*</span>
                     </label>
                     <SignatureCanvas
                        onSignatureChange={(signatureData) =>
                           setValue('participantSignature', signatureData)
                        }
                     />
                     {errors.participantSignature && (
                        <p className="text-sm text-red-600">
                           {errors.participantSignature.message}
                        </p>
                     )}
                  </div>

                  {/* Staff Signature */}
                  <div className="space-y-2">
                     <label className="block text-sm font-medium text-gray-700">
                        Staff Signature <span className="text-red-500">*</span>
                     </label>
                     <SignatureCanvas
                        onSignatureChange={(signatureData) =>
                           setValue('staffSignature', signatureData)
                        }
                     />
                     {errors.staffSignature && (
                        <p className="text-sm text-red-600">
                           {errors.staffSignature.message}
                        </p>
                     )}
                  </div>

                  {/* Receipt */}
                  <Controller
                     name="receipt"
                     control={control}
                     rules={{ required: 'Receipt is required' }}
                     render={({ field: { onChange, value } }) => (
                        <File
                           value={value}
                           onChange={onChange}
                           title="Receipt"
                           description="Upload transaction receipt"
                           accept={['image/*', '.jpg', '.jpeg', '.png']}
                           supportedFormats={['JPG', 'JPEG', 'PNG']}
                           maxSize={5 * 1024 * 1024}
                           error={errors.receipt?.message}
                           multiple={false}
                           enableImageCropping={false}
                           required
                        />
                     )}
                  />

                  {/* Submit Button */}
                  <div className="pt-4">
                     <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
                     >
                        Submit Transaction
                     </button>
                  </div>
               </form>
            </div>
         </FormProvider>
      </div>
   );
};

export default memo(FinancialTransactionForms);
