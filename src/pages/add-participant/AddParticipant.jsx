import React, { useState } from "react";
import { Form, useForm } from "react-hook-form";
import useFetchData from "../../hooks/useFetchData";

const AddParticipant = () => {
   const [userInputs, setUserInputs] = useState([]);
   const { data } = useFetchData("/membersWithDetails");
   const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
   } = useForm({
      defaultValues: {
         // userValue: "",
         participant: "",
         incident_reported_by: "",
         contact_Details: "",
         date_of_incident: "",
         time_of_incident: "",
         street_address_1: "",
         street_address_2: "",
         city: "",
         state: "",
         postal_code: "",
         any_witnesses: "",
         describe: "",
         any_injury: "",
      },
   });

   const handleUserNewAllData = (formData) => {
      console.log("Form Data Submitted:", formData);
   };

   const handleUserData = async (data) => {
      const response = await fetch("http://localhost:4000/membersWithDetails", {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(data),
      });

      const responseData = await response.json();

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
            <h3>Participant Details</h3>

            <div className="w-full mt-2.5">
               <form onSubmit={handleSubmit(handleUserNewAllData)}>
                  {/* 
              
              
              <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Participant Name
                     </label>
                     <input
                        placeholder="First Name"
                        type="text"
                        {...register("participantFirstName", {
                           required: true,
                           maxLength: 20,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.participantFirstName && (
                     <p>Please check the First Name</p>
                  )}
                  <div className="w-full mt-3.5 mb-2.5">
                     <input
                        placeholder="Last Name"
                        type="text"
                        {...register("participantLastName", {
                           required: true,
                           maxLength: 20,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.participantLastName && (
                     <p>Please check the Last Name</p>
                  )}

                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Date of birth
                     </label>
                  </div>
                  
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Participant Email
                     </label>
                     <input
                        placeholder="Participant Email"
                        type="email"
                        {...register("participantEmail", {
                           required: true,
                           pattern:
                              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.participantEmail && <p>Please check the Email</p>}

                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Phone Number
                     </label>

                     <input
                        placeholder="Phone Number"
                        type="text"
                        {...register("participantFirstName", {
                           required: true,
                           maxLength: 20,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.participantFirstName && (
                     <p>Please check the Phone Number</p>
                  )}
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Date that the incident was recorded on
                     </label>
                  </div>
                  
                  */}

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
                  {/* incident_reported_by */}
                  <div className="w-full mt-3.5 mb-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Incident Reported By
                     </label>
                     <input
                        placeholder=""
                        type="text"
                        {...register("incident_reported_by", {
                           required: true,
                           maxLength: 30,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.incident_reported_by && (
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
                        {...register("contact_Details", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.contact_Details && (
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
                        {...register("date_of_incident", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.date_of_incident && (
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
                        {...register("time_of_incident", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                     />
                  </div>
                  {errors.time_of_incident && (
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
                        {...register("street_address_1", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                     />
                     <input
                        placeholder="Street Address Line 2"
                        type="text"
                        {...register("street_address_2", {})}
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
                        {...register("postal_code", {
                           required: true,
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                     />
                  </div>
                  {(errors.street_address_1 ||
                     errors.city ||
                     errors.state ||
                     errors.postal_code) && (
                     <p className="text-sm  text-red-600">
                        Please check the Location Field
                     </p>
                  )}

                  {/* Were there any witnesses? */}

                  <div>
                     <label htmlFor="any_witnesses">
                        Were there any witnesses?
                     </label>
                     <label>
                        <div>
                           <input
                              type="radio"
                              name="yes"
                              value="yes"
                              {...register("any_witnesses", { required: true })}
                           />
                           Yes
                        </div>
                     </label>

                     <label>
                        <div>
                           <input
                              type="radio"
                              name="no"
                              value="no"
                              {...register("any_witnesses", { required: true })}
                           />
                           No
                        </div>
                     </label>
                  </div>
                  {errors.any_witnesses && (
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
                     <label htmlFor="any_injury">
                        Did this incident result in an injury?
                     </label>
                     <label>
                        <div>
                           <input
                              type="radio"
                              name="yes"
                              value="yes"
                              {...register("any_injury", { required: true })}
                           />
                           Yes
                        </div>
                     </label>

                     <label>
                        <div>
                           <input
                              type="radio"
                              name="no"
                              value="no"
                              {...register("any_injury", { required: true })}
                           />
                           No
                        </div>
                     </label>
                  </div>
                  {errors.any_injury && (
                     <p className="text-sm  text-red-600">
                        Please check the witnesses Field
                     </p>
                  )}
                  {/* form all data */}

                  <div className="w-full mt-2.5">
                     <label className="block mb-1 text-sm font-medium text-gray-700">
                        Add User Data for
                     </label>
                     <input
                        {...register("userValue", {
                           required: "Field of study is required",
                        })}
                        className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your field of study"
                     />
                     {errors.userValue && (
                        <p className="mt-1 text-sm text-red-600">
                           {errors.userValue.message}
                        </p>
                     )}
                  </div>

                  <input
                     type="submit"
                     className="w-full px-4 py-2 mt-5 font-medium text-white transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700 focus:outline-none focus:ring-2"
                  />
               </form>
            </div>

            <div className="w-full mt-2.5">
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
            </div>
         </div>
      </main>
   );
};

export default AddParticipant;
