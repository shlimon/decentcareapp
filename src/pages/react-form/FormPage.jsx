import React, { useState } from "react";
import FormSummary from "./FormSummary";
import Stepper from "./Stepper";
import EducationInfo from "./Steps/EducationInfo";
import LocationInfo from "./Steps/LocationInfo";
import PersonalInfo from "./Steps/PersonalInfo";

// Form Summary Component

// Stepper Component

// Main Form Component
const FormPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const totalSteps = 3;

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (data) => {
    const finalData = { ...formData, ...data };
    setFormData(finalData);
    setSubmitted(true);
    // Here you would typically send the data to your backend
    console.log("Form submitted with:", finalData);
  };

  const handleReset = () => {
    setStep(1);
    setFormData({});
    setSubmitted(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 py-12">
      <div className="max-w-lg w-screen mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
        {!submitted ? (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Registration Form
            </h1>
            <Stepper currentStep={step} totalSteps={totalSteps} />

            {step === 1 && <PersonalInfo onNext={handleNext} />}
            {step === 2 && (
              <LocationInfo
                onNext={handleNext}
                onPrev={handlePrev}
                formData={formData}
              />
            )}
            {step === 3 && (
              <EducationInfo
                onSubmit={handleSubmit}
                onPrev={handlePrev}
                formData={formData}
              />
            )}
          </>
        ) : (
          <FormSummary formData={formData} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default FormPage;
