import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import useFetchData from "../../hooks/useFetchData";

const AddParticipant = () => {
   const user = localStorage.getItem("user_data");
   const userData = JSON.parse(user);
   const userInfo = userData;
   const [userInputs, setUserInputs] = useState([]);
   const { data } = useFetchData("/membersWithDetails");
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm({
      defaultValues: {
         participant: "",
         incidentReportedBy: "",
         contactDetails: "",
         dateOfIncident: "",
         timeOfIncident: "",
         streetAddress1: "",
         streetAddress2: "",
         city: "",
         state: "",
         postalCode: "",
         anyWitnesses: "",
         describe: "",
         anyInjury: "",
      },
   });

   // console.log({ userInfo });

   // const handleUserNewAllData = (formData) => {
   //    console.log("Form Data Submitted:", formData);
   // };

   const handleUserData = async (data) => {
      const formData = data;
      formData.staffName = userInfo.user.name;
      formData.staffEmail = userInfo.user.email;
      console.log(formData);
      const response = await fetch(
         "http://localhost:4000/membersWithDetails/get-member-data",
         {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         }
      );

      const responseData = await response.json();
      console.log(responseData);
      reset();

      setUserInputs(responseData?.response?.userInputList);

      return;
   };

   const handleUserSelected = (id) => {
      const selectedUser = data.find((user) => user._id === id);

      setUserInputs(selectedUser.userInputList);
   };

   return (
      <main>
         <div className="detail-box-wrapper !h-auto">
            <h3>Participant Incident Report</h3>

            <div className="w-full mt-2.5">
               <form onSubmit={handleSubmit(handleUserData)}>
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Participant Name
                     </label>
                     <select
                        name="participant"
                        id="participant"
                        {...register("participant", {
                           required: "Participant is required",
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                        onChange={(e) => handleUserSelected(e.target.value)}
                     >
                        <option value="">Select a user</option>

                        {data?.map((user) => (
                           <option value={user._id} key={user._id}>
                              {user.name}
                           </option>
                        ))}
                     </select>
                  </div>
                  {/* my input */}
                  {/* incidentReportedBy */}
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Incident Reported By
                     </label>
                     <input
                        placeholder=""
                        type="text"
                        {...register("incidentReportedBy", {
                           required: true,
                           maxLength: 30,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.incidentReportedBy && (
                     <p className="text-sm  text-red-600">
                        Please check the Incident Reported Field
                     </p>
                  )}

                  {/* Contact Details */}
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Contact Details
                     </label>
                     <input
                        placeholder=""
                        type="text"
                        {...register("contactDetails", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.contactDetails && (
                     <p className="text-sm  text-red-600">
                        Please check the Contact Details Field
                     </p>
                  )}

                  {/* Date of the Incident */}
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Date of the Incident
                     </label>
                     <input
                        placeholder=""
                        type="date"
                        {...register("dateOfIncident", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.dateOfIncident && (
                     <p className="text-sm  text-red-600">
                        Please check the Date of the Incident Field
                     </p>
                  )}

                  {/* Time of the Incident */}
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Time of the Incident
                     </label>
                     <input
                        placeholder=""
                        type="time"
                        {...register("timeOfIncident", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.timeOfIncident && (
                     <p className="text-sm  text-red-600">
                        Please check the Time of the Incident Field
                     </p>
                  )}

                  {/* Exact Location of the Incident */}
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Exact Location of the Incident
                     </label>
                     <input
                        placeholder="Street Address"
                        type="text"
                        {...register("streetAddress1", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                     />
                     <input
                        placeholder="Street Address Line 2"
                        type="text"
                        {...register("streetAddress2", {})}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                     />
                     <input
                        placeholder="City"
                        type="text"
                        {...register("city", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                     />
                     <input
                        placeholder="State / Province"
                        type="text"
                        {...register("state", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                     />
                     <input
                        placeholder="Postal / Zip Code"
                        type="number"
                        {...register("postalCode", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                     />
                  </div>
                  {(errors.streetAddress1 ||
                     errors.city ||
                     errors.state ||
                     errors.postalCode) && (
                     <p className="text-sm  text-red-600">
                        Please check the Location Field
                     </p>
                  )}

                  {/* Were there any witnesses? */}

                  <div>
                     <label htmlFor="anyWitnesses">
                        Were there any witnesses?
                     </label>
                     <label>
                        <div>
                           <input
                              type="radio"
                              name="yes"
                              value={true}
                              {...register("anyWitnesses", { required: true })}
                           />
                           <span className="ml-2">Yes</span>
                        </div>
                     </label>

                     <label>
                        <div>
                           <input
                              type="radio"
                              name="no"
                              value={false}
                              {...register("anyWitnesses", { required: true })}
                           />
                           <span className="ml-2">No</span>
                        </div>
                     </label>
                  </div>
                  {errors.anyWitnesses && (
                     <p className="text-sm  text-red-600">
                        Please check the witnesses Field
                     </p>
                  )}

                  {/* Describe */}

                  <div className="w-full mt-3.5 mb-2.5">
                     <p className="mb-1 text-m text-gray-700">
                        Describe how the incident occurred and if there was any
                        damage to property or equipment (include: leading up to
                        the event, the actual event, and any equipment, work
                        practices, tasks, or processes that may have been
                        involved -upload a separate sheet if necessary)
                     </p>

                     <textarea
                        placeholder="Type here..."
                        rows="4"
                        type="text"
                        {...register("describe", {
                           required: true,
                           max: 600,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.describe && (
                     <p className="text-sm mb-2 text-red-600">
                        Please check the Contact Details Field
                     </p>
                  )}

                  {/* Did this incident result in an injury? */}

                  <div>
                     <label htmlFor="anyInjury">
                        Did this incident result in an injury?
                     </label>
                     <label>
                        <div>
                           <input
                              type="radio"
                              name="yes"
                              value={true}
                              {...register("anyInjury", {
                                 required: true,
                              })}
                           />
                           <span className="ml-2">Yes</span>
                        </div>
                     </label>

                     <label>
                        <div>
                           <input
                              type="radio"
                              name="no"
                              value={false}
                              {...register("anyInjury", {
                                 required: true,
                              })}
                           />
                           <span className="ml-2">No</span>
                        </div>
                     </label>
                  </div>
                  {errors.anyInjury && (
                     <p className="text-sm  text-red-600">
                        Please check the witnesses Field
                     </p>
                  )}
                  {/* form all data */}

                  <input
                     type="submit"
                     className="w-full px-4 py-2 mt-5 mb-12 font-medium text-white transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2"
                  />
               </form>
            </div>

            {/* <div className="w-full mt-2.5">
               {userInputs?.length > 0 ? (
                  userInputs.map((input, _id) => (
                     <p
                        key={_id}
                        className="my-2 border border-gray-600/55 rounded px-2.5 py-1.5 hover:bg-gray-200 duration-100"
                     >
                        {input}
                     </p>
                  ))
               ) : (
                  <p className="text-center text-gray-500 text-sm mt-10">
                     No data added yet now.
                  </p>
               )}
            </div> */}
         </div>
      </main>
   );
};

export default AddParticipant;
