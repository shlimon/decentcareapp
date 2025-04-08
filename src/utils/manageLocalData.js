const getStoredData = (key) => {
  const gotData = localStorage.getItem(key);

  return JSON.parse(gotData);
};

const setStoredData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const removeStoredData = (key) => {
  localStorage.removeItem(key);
};

export { getStoredData, removeStoredData, setStoredData };
