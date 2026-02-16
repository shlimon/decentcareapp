import Loading from '@components/reusable/loading/Loading';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import TrainingEvaluationForm from '@components/Training/TrainingEvaluationForm';
import useGetMyTrainings from '@hooks/useGetMyTrainings';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

// Main Training List Component
const TrainingList = () => {
   const location = useLocation();

   const { isLoading, data, isError } = useGetMyTrainings();
   const [showModal, setShowModal] = useState(false);
   const [selectedTraining, setSelectedTraining] = useState(null);

   useEffect(() => {
      const queryParams = new URLSearchParams(location.search);
      const trainingParam = queryParams.get('training');

      if (trainingParam && data) {
         // Find the training object that matches the trainingParam
         const training = data.find(
            (item) =>
               item._id === trainingParam ||
               item.training._id === trainingParam,
         );

         if (training) {
            setSelectedTraining(training);
            setShowModal(true);
         }
      }
   }, [location.search, data]);

   if (isLoading) {
      return <Loading />;
   }

   if (isError) {
      return <div className="text-center p-10">Error loading data</div>;
   }

   const handleCardClick = (training) => {
      if (
         training.status !== 'Completed' &&
         training?.training?.status !== 'Completed'
      ) {
         setSelectedTraining(training);
         setShowModal(true);
      }
   };

   const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric',
         month: 'short',
         day: 'numeric',
      });
   };

   const getStatusColor = (status) => {
      switch (status) {
         case 'Completed':
            return 'bg-green-100 text-green-800 border-green-200';
         case 'In Progress':
            return 'bg-blue-100 text-blue-800 border-blue-200';
         default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
      }
   };

   return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
         <h2 className="text-2xl font-bold text-gray-900 mb-5">My Trainings</h2>

         <div className="space-y-4">
            {/* if data have no value then show no training message */}
            {data && data.length === 0 && (
               <div className="text-center py-10">
                  <p className="text-gray-500">No training data available</p>
               </div>
            )}

            {data?.map((item) => (
               <div
                  key={item._id}
                  onClick={() => handleCardClick(item)}
                  className={`bg-white rounded-lg shadow-md border border-gray-200 p-6 transition-all ${
                     item.status === 'In Progress'
                        ? 'hover:shadow-lg cursor-pointer hover:border-blue-300'
                        : ''
                  }`}
               >
                  <div className="space-y-4 mb-4">
                     <h2 className="text-lg font-semibold text-gray-900 mb-1">
                        {item.training.trainingName}
                     </h2>
                     <div className="space-x-2">
                        <span
                           className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              item.status,
                           )}`}
                        >
                           {item.status}
                        </span>
                        <span
                           className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              item?.status === 'Completed'
                                 ? 'bg-green-100 text-green-800 border border-green-200'
                                 : 'bg-blue-100 text-blue-800 border border-blue-200'
                           }`}
                        >
                           {item?.status === 'Completed'
                              ? 'Evaluation Submitted'
                              : 'Evaluation Not Submitted'}
                        </span>
                     </div>
                     <p className="text-sm text-gray-600">
                        Training No:{' '}
                        <span className="font-medium">
                           {item.training.trnNumber}
                        </span>
                     </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                        <p className="text-gray-500">Training Date</p>
                        <p className="font-medium text-gray-900">
                           {formatDate(item.training.trainingDate)}
                        </p>
                     </div>
                     <div>
                        <p className="text-gray-500">Expiry Date</p>
                        <p className="font-medium text-gray-900">
                           {formatDate(item.training.expiryDate)}
                        </p>
                     </div>
                  </div>

                  {item.status === 'In Progress' && (
                     <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-blue-600 font-medium">
                           Click to complete evaluation →
                        </p>
                     </div>
                  )}
               </div>
            ))}
         </div>

         <ModalWithContent
            title={
               selectedTraining
                  ? `Training Evaluation - ${selectedTraining.training.trainingName}`
                  : 'Training Evaluation'
            }
            content={
               selectedTraining ? (
                  <TrainingEvaluationForm
                     training={selectedTraining}
                     onCancel={() => setShowModal(false)}
                  />
               ) : null
            }
            isOpen={showModal}
            setIsOpen={setShowModal}
            maxWidth="max-w-2xl"
         />
      </div>
   );
};

export default TrainingList;
