import Loading from '@components/reusable/loading/Loading';
import ModalWithContent from '@components/reusable/modal2/ModalWithContent';
import useGetMyReimbursement from '@hooks/useGetMyReimbursement';
import React, { memo, useState } from 'react';
import { useNavigate } from 'react-router';
import { formatDate } from './../../utils/DateFormation';

const ReimbursementShowCard = ({ reimbursement }) => {
  // Tailwind CSS status classes
  const statusClasses = {
    Approved: 'bg-blue-100 text-blue-600 border-blue-600',
    Declined: 'bg-red-100 text-red-600 border-red-600',
    Pending: 'bg-gray-100 text-gray-700 border-gray-400',
  };

  const currentClass =
    statusClasses[reimbursement.status] || statusClasses.Pending;

  return (
    <div className="bg-white border border-gray-300 rounded-2xl shadow-sm p-4 flex items-center justify-between">
      <div>
        <p className="text-[14px] font-bold mb-1 text-gray-500">
          {formatDate(reimbursement.createdAt)}
        </p>
        <p className="text-sm text-gray-600">
          {reimbursement.reimbursementType}
          {reimbursement.participantName
            ? ` - ${reimbursement.participantName}`
            : ''}
        </p>
        <p className="text-sm font-semibold text-gray-800">
          AUD {reimbursement.amount}
        </p>
      </div>

      <div
        className={`text-[14px] font-bold py-1 px-4 rounded-2xl border ${currentClass}`}
      >
        {reimbursement.status}
      </div>
    </div>
  );
};

const Reimbursement = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const { data: apiData, isLoading } = useGetMyReimbursement();

  if (isLoading) {
    return <Loading />;
  }

  const reimbursementData =
    apiData?.map((item) => ({
      id: item._id,
      createdAt: new Date(item.createdAt).toISOString().split('T')[0],
      reimbursementType: item.reimbursementType,
      amount: item.amount,
      status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
      participantName: item.participantId?.name || null,
    })) || [];

  return (
    <div className="max-w-xl mx-auto">
      <div className="w-full max-w-[800px] rounded-xl font-montserrat p-6 bg-white h-full space-y-4">
        <div className="text-lg font-semibold text-gray-800 bg-gray-50 border border-gray-300 rounded-lg p-4 mt-4">
          My Reimbursements
        </div>

        {/* header */}
        <div className="bg-white px-4 py-2 flex items-center justify-between">
          <p className="text-[14px] font-bold text-blue-600">Reimbursements</p>

          <button
            className="bg-blue-600 text-white py-1 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium"
            onClick={() => navigate('/work/reimbursement-form')}
          >
            Apply
          </button>
        </div>

        {/* show cards */}
        {reimbursementData.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              const fullData = apiData.find((r) => r._id === item.id);
              setSelectedData(fullData);
              setShowModal(true);
            }}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <ReimbursementShowCard reimbursement={item} />
          </div>
        ))}
      </div>

      <ModalWithContent
        title="Reimbursement Details"
        isOpen={showModal}
        setIsOpen={setShowModal}
        maxWidth="max-w-2xl"
        padding={false}
        content={
          selectedData && (
            <div className="p-6 space-y-3">
              <p>
                <strong>Type:</strong> {selectedData.reimbursementType}
              </p>
              {selectedData.participantId && (
                <p>
                  <strong>Participant:</strong>{' '}
                  {selectedData.participantId.name}
                </p>
              )}
              <p>
                <strong>Amount:</strong> ৳ {selectedData.amount}
              </p>
              <p>
                <strong>Status:</strong> {selectedData.status}
              </p>
              <p>
                <strong>Description:</strong> {selectedData.description}
              </p>
            </div>
          )
        }
      />
    </div>
  );
};

export default memo(Reimbursement);
