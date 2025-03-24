import React, { useState } from "react";
import { useForm } from "react-hook-form";

// Step 1: Personal Information Component
const PersonalInfo = ({ onNext }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Personal Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name
        </label>
        <input
          {...register("name", { required: "Name is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          type="email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter your email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number
        </label>
        <input
          {...register("phone", {
            required: "Phone number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Please enter a valid 10-digit phone number",
            },
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date of Birth
        </label>
        <input
          {...register("dob", { required: "Date of birth is required" })}
          type="date"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        />
        {errors.dob && (
          <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
        )}
      </div>

      <button
        onClick={handleSubmit(onSubmit)}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Next Step
      </button>
    </div>
  );
};

// Step 2: Location Information Component
const LocationInfo = ({ onNext, onPrev, formData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    onNext(data);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Location Information</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Street Address
        </label>
        <input
          {...register("address", { required: "Street address is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter your street address"
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          City
        </label>
        <input
          {...register("city", { required: "City is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter your city"
        />
        {errors.city && (
          <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/Province
          </label>
          <input
            {...register("state", { required: "State is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your state"
          />
          {errors.state && (
            <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Zip/Postal Code
          </label>
          <input
            {...register("zipCode", { required: "Zip code is required" })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your zip code"
          />
          {errors.zipCode && (
            <p className="mt-1 text-sm text-red-600">
              {errors.zipCode.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Country
        </label>
        <select
          {...register("country", { required: "Country is required" })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Select your country</option>
          <option value="US">United States</option>
          <option value="CA">Canada</option>
          <option value="UK">United Kingdom</option>
          <option value="AU">Australia</option>
          <option value="IN">India</option>
          <option value="Other">Other</option>
        </select>
        {errors.country && (
          <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          className="w-1/2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          className="w-1/2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Next Step
        </button>
      </div>
    </div>
  );
};

// Step 3: Educational Information Component
const EducationInfo = ({ onSubmit: onFormSubmit, onPrev, formData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    onFormSubmit({ ...formData, ...data });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">
        Educational Information
      </h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Highest Degree
        </label>
        <select
          {...register("highestDegree", {
            required: "Highest degree is required",
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          <option value="">Select highest degree</option>
          <option value="highSchool">High School</option>
          <option value="associate">Associate Degree</option>
          <option value="bachelor">Bachelor's Degree</option>
          <option value="master">Master's Degree</option>
          <option value="doctorate">Doctorate/PhD</option>
          <option value="other">Other</option>
        </select>
        {errors.highestDegree && (
          <p className="mt-1 text-sm text-red-600">
            {errors.highestDegree.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Field of Study
        </label>
        <input
          {...register("fieldOfStudy", {
            required: "Field of study is required",
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter your field of study"
        />
        {errors.fieldOfStudy && (
          <p className="mt-1 text-sm text-red-600">
            {errors.fieldOfStudy.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Institution Name
        </label>
        <input
          {...register("institution", {
            required: "Institution name is required",
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Enter your institution name"
        />
        {errors.institution && (
          <p className="mt-1 text-sm text-red-600">
            {errors.institution.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Graduation Year
          </label>
          <input
            {...register("graduationYear", {
              required: "Graduation year is required",
              pattern: {
                value: /^[0-9]{4}$/,
                message: "Please enter a valid 4-digit year",
              },
            })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="YYYY"
          />
          {errors.graduationYear && (
            <p className="mt-1 text-sm text-red-600">
              {errors.graduationYear.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GPA/Grade
          </label>
          <input
            {...register("gpa")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          className="w-1/2 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Previous
        </button>
        <button
          onClick={handleSubmit(onSubmit)}
          className="w-1/2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

// Form Summary Component
const FormSummary = ({ formData, onReset }) => {
  return (
    <div className="space-y-6">
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
        <svg
          className="w-12 h-12 text-green-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          Form Submitted Successfully!
        </h2>
        <p className="text-green-700">
          Thank you for submitting your information.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-800">
            Form Data Summary
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Personal Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Name:</p>
                  <p className="font-medium">{formData.name}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email:</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone:</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Date of Birth:</p>
                  <p className="font-medium">{formData.dob}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Location Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Address:</p>
                  <p className="font-medium">{formData.address}</p>
                </div>
                <div>
                  <p className="text-gray-600">City:</p>
                  <p className="font-medium">{formData.city}</p>
                </div>
                <div>
                  <p className="text-gray-600">State/Province:</p>
                  <p className="font-medium">{formData.state}</p>
                </div>
                <div>
                  <p className="text-gray-600">Zip/Postal Code:</p>
                  <p className="font-medium">{formData.zipCode}</p>
                </div>
                <div>
                  <p className="text-gray-600">Country:</p>
                  <p className="font-medium">{formData.country}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-800 mb-2">
                Educational Information
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Highest Degree:</p>
                  <p className="font-medium">{formData.highestDegree}</p>
                </div>
                <div>
                  <p className="text-gray-600">Field of Study:</p>
                  <p className="font-medium">{formData.fieldOfStudy}</p>
                </div>
                <div>
                  <p className="text-gray-600">Institution:</p>
                  <p className="font-medium">{formData.institution}</p>
                </div>
                <div>
                  <p className="text-gray-600">Graduation Year:</p>
                  <p className="font-medium">{formData.graduationYear}</p>
                </div>
                {formData.gpa && (
                  <div>
                    <p className="text-gray-600">GPA/Grade:</p>
                    <p className="font-medium">{formData.gpa}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={onReset}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Start Over
      </button>
    </div>
  );
};

// Stepper Component
const Stepper = ({ currentStep, totalSteps }) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep === step
                    ? "bg-blue-600 text-white"
                    : currentStep > step
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                } font-bold text-lg transition-colors duration-300`}
              >
                {currentStep > step ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                ) : (
                  step
                )}
              </div>
              <span className="mt-2 text-sm font-medium text-gray-600">
                {step === 1
                  ? "Personal"
                  : step === 2
                  ? "Location"
                  : "Education"}
              </span>
            </div>

            {/* Connector Line (except after the last step) */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-gray-200">
                <div
                  className="h-1 bg-blue-600 transition-all duration-300"
                  style={{
                    width:
                      currentStep > step + 1
                        ? "100%"
                        : currentStep > step
                        ? "50%"
                        : "0%",
                  }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
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
