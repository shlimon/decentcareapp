import { dummyFormsData } from "../dummy/formData";

const getAllData = () => {
  const formData = dummyFormsData;

  return formData;
};

const findOneData = (id) => {
  return dummyFormsData.find((data) => data.id === id);
};

export { findOneData, getAllData };
