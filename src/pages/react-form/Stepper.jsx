import React from "react";
import { FaCheck } from "react-icons/fa6";

const Stepper = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <div className="flex relative flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep === step
                    ? "bg-blue-600 text-white"
                    : currentStep > step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                } font-bold text-lg transition-colors duration-300`}
              >
                {currentStep > step ? <FaCheck /> : step}
              </div>
              <span className="absolute -bottom-5 mt-2 text-xs font-medium text-gray-600">
                {step === 1
                  ? "Personal"
                  : step === 2
                  ? "Location"
                  : "Education"}
              </span>
            </div>

            {/* Connector Line (except after the last step) */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-200 rounded-full">
                <div
                  className={`h-1 transition-all duration-300 w-full rounded-full ${
                    currentStep > index + 1 ? "bg-blue-600" : ""
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
