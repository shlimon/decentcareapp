import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useFetchData from "../../hooks/useFetchData";

const AddParticipant = () => {
  const [userInputs, setUserInputs] = useState([]);
  const { data } = useFetchData("/membersWithDetails/get-members-data");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      userValue: "",
      participant: "",
    },
  });

  const handleUserData = async (data) => {
    const response = await fetch(
      "http://localhost:4000/membersWithDetails/get-members-data",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

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
      <div className="detail-box-wrapper">
        <h3>Add New Participant</h3>

        <div className="w-full mt-2.5">
          <form onSubmit={handleSubmit(handleUserData)}>
            <div className="w-full mt-3.5 mb-2.5">
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Select a user
              </label>
              <select
                name="participant"
                id="participant"
                {...register("participant", {
                  required: "Participant is required",
                })}
                className="w-full px-4 py-2 transition-colors border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => handleUserSelected(e.target.value)}
              >
                <option value="">Select a user</option>

                {data.map((user) => (
                  <option value={user._id} key={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>

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
          {userInputs.length > 0 ? (
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
              No data added
            </p>
          )}
        </div>
      </div>
    </main>
  );
};

export default AddParticipant;
