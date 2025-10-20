import formsData from '../data/formData.json';

const getAllData = () => {
  const formData = formsData;

  return formData;
};

const findOneData = (id) => {
  return formsData.find((data) => data.link === `/forms/${id}`);
};

export { findOneData, getAllData };
