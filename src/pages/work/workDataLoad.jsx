import React from "react";
import recourceDataFF from "./work.json";

const getData = () => {
   const data = recourceDataFF;
   return data;
};

const findData = (id) => {
   return recourceDataFF.find((data) => data.id === id);
};

export { getData, findData };
