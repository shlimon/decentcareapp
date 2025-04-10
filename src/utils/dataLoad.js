import formsData from '../data/formData';

const getAllData = () => {
  const formData = formsData;

  return formData;
};

const findOneData = (id) => {
  return formsData.find((data) => data.id === id);
};

export { findOneData, getAllData };
