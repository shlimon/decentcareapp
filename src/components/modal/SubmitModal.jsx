import React from "react";
import { FaCheck } from "react-icons/fa6";

const SubmitModal = ({ onReset }) => {
  return (
    <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
      <span>
        <FaCheck className="w-10 h-10 text-green-500 mx-auto mb-4" />
      </span>

      <h2 className="text-2xl font-bold text-green-800 mb-2">
        Form Submitted Successfully!
      </h2>
      <p className="text-green-700">
        Thank you for submitting your information.
      </p>
      <button
        onClick={onReset}
        className="w-full mt-5 py-2 px-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2"
      >
        Add New Data
      </button>
    </div>
  );
};

export default SubmitModal;
