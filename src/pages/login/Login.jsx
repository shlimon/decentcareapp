import useLogin from '@hooks/useLogin';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router';

const Login = () => {
  const { loginUser, loading, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    await loginUser(data);
  };

  return (
    <div className="py-8 px-4 max-w-xl mx-auto">
      <div className="flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Decent Care App
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Enter your credentials to log in to the system.
            </p>
          </div>

          <div className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Please enter your email',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm 
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                {...register('password', {
                  required: 'Please enter your password',
                })}
                className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm shadow-sm 
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="flex justify-end mb-4">
              <Link
                to="/forgot-password"
                className="text-blue-700 hover:text-blue-800 font-medium text-sm"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="w-full rounded-md bg-blue-700 px-4 py-3 text-white font-semibold transition hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>

            {/* Required by Google when hiding the reCAPTCHA badge */}
            <p className="text-center text-xs text-gray-400 mt-4">
              Protected by reCAPTCHA —{' '}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-gray-600"
              >
                Privacy
              </a>
              {' & '}
              <a
                href="https://policies.google.com/terms"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-gray-600"
              >
                Terms
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
