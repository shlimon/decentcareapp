import React from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import useLogin from "../../hooks/useLogin";

const ResetPassword = () => {
    const { token } = useParams();
    const { resetPassword, loading } = useLogin()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const onSubmit = async ({ password }) => {
        try {
            await resetPassword(token, password);
        } catch (err) {
            toast.error(err.message || "Failed to reset password. Please try again.");
        }
    };


    return (
        <section className="container mx-auto">
            <div className="flex min-h-screen items-center justify-center bg-white px-4">
                <div className="w-full max-w-md space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Reset Your Password
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Enter a new password to regain access to your account.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter new password"
                                {...register("password", {
                                    required: "Please enter a new password",
                                    minLength: {
                                        value: 4,
                                        message: "Password must be at least 4 characters",
                                    },
                                })}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === watch("password") || "Passwords do not match",
                                })}
                                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-md bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800 cursor-pointer"
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
