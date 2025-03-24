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

export default FormSummary;
