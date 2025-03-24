import { useState } from "react";
import Modal from "../../components/modal/ModalContainer";
import SubmitModal from "../../components/modal/SubmitModal";

const FormSummary = ({ formData, onReset }) => {
  const [success, setSuccess] = useState(false);

  const handleSubmit = () => {
    setSuccess((prev) => !prev);
  };

  return (
    <div className="space-y-6">
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
        onClick={handleSubmit}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none"
      >
        Submit
      </button>

      {success && (
        <Modal onClose={null}>
          <SubmitModal onReset={onReset} />
        </Modal>
      )}
    </div>
  );
};

export default FormSummary;
