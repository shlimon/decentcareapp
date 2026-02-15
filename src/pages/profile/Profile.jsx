import Loading from '@components/reusable/loading/Loading';
import useGetMyData from '@hooks/useGetMyData';
import React from 'react';
import { useAuth } from '../../context/auth';

const Profile = () => {
  const { data, isLoading } = useGetMyData();
  const { logout, userData } = useAuth();
  const user = userData?.user;

  if (isLoading) {
    return <Loading />;
  }

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <main className="pb-10">
      <div className="max-w-4xl mx-auto  p-5">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-5">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{data?.name}</h2>
            <p className="text-gray-500">{user?.email}</p>
          </div>

          {/* XP Badge */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-full font-semibold shadow-md">
            XP: {data?.points || 0}
          </div>
        </div>

        {/* Personal Info */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
              Personal Information
            </h4>

            <Info label="Gender" value={data?.gender} />
            <Info label="Phone" value={data?.phone} />
            <Info label="Date of Birth" value={formatDate(data?.dob)} />
            <Info label="Residency" value={data?.residency} />
            <Info label="Status" value={data?.status} />
            <Info label="Personal Email" value={data?.personalEmail} />
          </div>

          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h4 className="text-lg font-semibold mb-4 text-gray-700">
              Address
            </h4>

            <Info label="Street" value={data?.fullAddress?.street} />
            <Info label="Suburb" value={data?.fullAddress?.suburb} />
            <Info label="State" value={data?.fullAddress?.state} />
            <Info label="Post Code" value={data?.fullAddress?.postCode} />
            <Info label="Country" value={data?.fullAddress?.country} />
          </div>
        </div>

        {/* Employment Info */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm mt-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">
            Employment Details
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            <Info label="Joining Date" value={formatDate(data?.joiningDate)} />
            <Info
              label="Promotional Date"
              value={formatDate(data?.promotionalDate)}
            />
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-gray-50 p-5 rounded-xl shadow-sm mt-6">
          <h4 className="text-lg font-semibold mb-4 text-gray-700">
            Emergency Contact
          </h4>

          <div className="grid md:grid-cols-2 gap-6">
            <Info label="Name" value={data?.emergencyContact?.name} />
            <Info label="Relation" value={data?.emergencyContact?.relation} />
            <Info label="Phone" value={data?.emergencyContact?.phone} />
            <Info label="Email" value={data?.emergencyContact?.email} />
          </div>
        </div>

        {/* Logout */}
        <div className="mt-8">
          <button
            className="w-full rounded-xl bg-red-600 text-white py-3 font-semibold hover:bg-red-700 transition duration-300 shadow-md"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
};

const Info = ({ label, value }) => (
  <p className="flex justify-between border-b py-2 text-sm">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-gray-800">{value || 'N/A'}</span>
  </p>
);

export default React.memo(Profile);
