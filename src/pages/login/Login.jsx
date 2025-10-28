import useLogin from '@hooks/useLogin';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const Login = () => {
  const { loginUser, loading, error } = useLogin();
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError: setFormError,
    clearErrors,
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      dob: '',
    },
  });

  // Update dob field whenever day/month/year changes
  const handleDateChange = (type, value) => {
    let newDay = dobDay;
    let newMonth = dobMonth;
    let newYear = dobYear;

    if (type === 'day') {
      setDobDay(value);
      newDay = value;
    } else if (type === 'month') {
      setDobMonth(value);
      newMonth = value;
    } else if (type === 'year') {
      setDobYear(value);
      newYear = value;
    }

    // If all three are selected, combine them into dob in ISO format
    if (newDay && newMonth && newYear) {
      const dateStr = `${newYear}-${newMonth.padStart(
        2,
        '0'
      )}-${newDay.padStart(2, '0')}`;
      const date = new Date(dateStr);
      const dob = date.toISOString();
      setValue('dob', dob);
      clearErrors('dob');
    } else {
      setValue('dob', '');
    }
  };

  const onSubmit = async (data) => {
    // Validate that dob is filled
    if (!data.dob) {
      setFormError('dob', {
        type: 'manual',
        message: 'Please select your complete date of birth',
      });
      return;
    }

    await loginUser(data);
  };

  // Generate arrays for dropdowns
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <section className="container mx-auto">
      <div className="flex py-10 items-center justify-center bg-white px-4">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Decent Care App
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your details below to log in to the system.
            </p>
          </div>

          <div className="space-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                {...register('firstName', {
                  required: 'Please enter first name',
                })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm 
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                {...register('lastName', {
                  required: 'Please enter last name',
                })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm 
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number (e.g. +61412345671)"
                {...register('phone', {
                  required: 'Please enter phone number',
                  pattern: {
                    value: /^\+?[0-9]{7,15}$/,
                    message: 'Invalid phone number',
                  },
                })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm 
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.phone.message}
                </p>
              )}
            </div>

            {/* Date of Birth - Dropdown Style */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>

              {/* Hidden dob field for react-hook-form */}
              <input type="hidden" {...register('dob')} />

              <div className="grid grid-cols-3 gap-2">
                {/* Day */}
                <div>
                  <select
                    value={dobDay}
                    onChange={(e) => handleDateChange('day', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm 
                      focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Day</option>
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Month */}
                <div>
                  <select
                    value={dobMonth}
                    onChange={(e) => handleDateChange('month', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm 
                      focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Month</option>
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Year */}
                <div>
                  <select
                    value={dobYear}
                    onChange={(e) => handleDateChange('year', e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm 
                      focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.dob.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full rounded-md bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
