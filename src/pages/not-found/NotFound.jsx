import React from "react";
import { useNavigate } from "react-router";

export const NotFound = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-gray-500 text-3xl mb-5">Resource not found</h1>
      <button
        className="px-3 py-1.5 border rounded border-gray-500 hover:bg-gray-300 duration-300 cursor-pointer"
        onClick={handleClick}
      >
        Go Home
      </button>
    </div>
  );
};
