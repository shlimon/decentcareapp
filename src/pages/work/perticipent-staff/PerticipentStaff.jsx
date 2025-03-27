import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useFetchData from "../../../hooks/useFetchData";

export const PerticipentStaff = () => {
   const { isLoading, data, isError } = useFetchData(
      "/membersWithDetails/get-member-data"
   );
   const {
      register,
      handleSubmit,
      // watch,
      formState: { errors },
   } = useForm({
      defaultValues: {
         userValue: "",
         participent: "",
      },
   });

   console.log({ data });

   const handleUserData = async (data) => {
      const response = await fetch(
         "http://localhost:4000/membersWithDetails/get-member-data",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
         }
      );
      const responseData = await response.json();
      console.log(responseData);
      return;
   };

   // const selectedValue = watch("participent");

   // console.log(watch("participent"));

   return (
      //   <form onSubmit={handleSubmit(onSubmit)}>
      //      {/* register your input into the hook by invoking the "register" function */}
      //      <input defaultValue="test" {...register("example")} />

      //      {/* include validation with required or other standard HTML validation rules */}
      //      <input {...register("exampleRequired", { required: true })} />
      //      {/* errors will return when field validation fails  */}
      //      {errors.exampleRequired && <span>This field is required</span>}

      //      <input type="submit" />
      //   </form>
      <main>
         <div>
            <div class=" perticipent-box ">
               <h3 class="text-2xl font-semibold text-gray-800">
                  Perticipent Staff
               </h3>

               <div class="my-3 w-85">
                  <form action="" onSubmit={handleSubmit(handleUserData)}>
                     <div class="my-3 w-85">
                        <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
                           Name
                        </label>
                        <select
                           name="participent"
                           id="participent"
                           {...register("participent", {
                              required: "participent is required",
                           })}
                           className="form-select appearance-none block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding bg-no-repeat border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                           aria-label="Default select example"
                        >
                           <option value="">Open this select menu</option>
                           {data.map((user) => (
                              <option value={user._id} key={user._id}>
                                 {user.name}
                              </option>
                           ))}
                        </select>
                     </div>

                     <div className="w-full mt-3">
                        <label className="block text-sm font-medium text-gray-700 mt-3 mb-2">
                           Enter your text
                        </label>
                        <input
                           {...register("userValue", {
                              required: "text is required",
                           })}
                           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                           placeholder="Enter your text"
                        />
                        {errors.userValue && (
                           <p className="mt-1 text-sm text-red-600">
                              {errors.userValue.message}
                           </p>
                        )}
                     </div>
                     <input
                        className="w-full mt-5 py-2 px-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2"
                        type="submit"
                        value="Submit"
                     />
                  </form>
               </div>
            </div>
         </div>
      </main>
   );
};
export default PerticipentStaff;
