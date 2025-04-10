import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLoginMutation } from "../../hooks/useAuth";

const Login = () => {
  const [forgetPasswordMode, setForgetPasswordMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = useLoginMutation();

  const forgetPassword = async (email) => { };

  const loginUser = async (data) => {
    setIsLoading(true);

    loginMutation.mutate(data, {
      onError: (error) => {
        setError(error.response.data.message);
        setIsError(true);
      },
    });

    // loading state make false
    setIsLoading(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (forgetPasswordMode) {
      await forgetPassword(data.email);
    } else {
      await loginUser(data);
    }
  };

  return (
    <section className="container mx-auto">
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="w-full max-w-md space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Decent Care App
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              If you do not have access, contact your manager for credentials.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 h-64">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Please enter email",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {!forgetPasswordMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Please enter your password",
                  })}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}


            {isError && (
              <div className="rounded-md bg-red-100 px-4 py-2 text-sm text-red-700">
                {error}
              </div>
            )}


            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800 cursor-pointer"
            >
              {isLoading
                ? "Loading..."
                : forgetPasswordMode
                  ? "Get Password"
                  : "Sign In"}
            </button>


            <button
              type="button"
              onClick={() => setForgetPasswordMode(!forgetPasswordMode)}
              className="w-full text-center text-sm text-blue-700 hover:underline cursor-pointer"
            >
              {forgetPasswordMode ? "Back to Login" : "Forgot Password?"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
