import { useForm } from 'react-hook-form';
import useLogin from '../../hooks/useLogin';

const Login = () => {
   const { loginUser, error, loading } = useLogin();

   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm({
      defaultValues: {
         firstName: '',
         lastName: '',
         phone: '',
         dob: '',
      },
   });

   const onSubmit = async (data) => {
      await loginUser(data);
   };

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

               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                  {/* Date of Birth */}
                  <div>
                     <label className="block text-sm font-medium text-gray-700">
                        Date of Birth
                     </label>
                     <input
                        type="date"
                        {...register('dob', {
                           required: 'Please select your date of birth',
                        })}
                        className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm shadow-sm 
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                     />
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
                     type="submit"
                     disabled={loading}
                     className="w-full rounded-md bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800 cursor-pointer"
                  >
                     {loading ? 'Loading...' : 'Sign In'}
                  </button>
               </form>
            </div>
         </div>
      </section>
   );
};

export default Login;
