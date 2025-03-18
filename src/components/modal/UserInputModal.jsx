import React, { useState } from "react";
import { setStoredData } from "../../utils/manageLocalData";
import LocationPicker from "../ui/location-picker/location-picker";
import styles from "./UserInputModal.module.css";

const UserInputModal = ({ setUserInput }) => {
  const [username, setUsername] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const handleStateSelect = (state) => {
    setSelectedState(state);
  };

  const handleSubmit = () => {
    const userInfo = {
      name: username,
      location: selectedState,
    };

    setUserInput(userInfo);

    setStoredData("user", userInfo);
  };

  return (
    <div className={styles.userInputContainer}>
      <div className={styles.inputGroup}>
        <input
          type="text"
          id="name"
          value={username}
          placeholder="Your Name"
          onChange={(e) => setUsername(e.target.value)}
          className={styles.inputField}
        />
      </div>
      <LocationPicker onStateSelect={handleStateSelect} />
      <button className={styles.submitButton} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
};

export default UserInputModal;
