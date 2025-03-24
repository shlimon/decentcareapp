import { useForm } from "react-hook-form";

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

export default EducationInfo;
