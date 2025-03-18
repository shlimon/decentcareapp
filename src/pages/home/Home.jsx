import React, { useEffect, useState } from "react";
import Modal from "../../components/modal/ModalContainer";
import UserInputModal from "../../components/modal/UserInputModal";
import useWeatherData from "../../hooks/useWeatherData";
import { getStoredData } from "../../utils/manageLocalData";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [userInput, setUserInput] = useState({});
  const { weather } = useWeatherData(userInput.location);

  const userName = userInput?.name
    ? `Hello, ${userInput.name} 👋`
    : "No name? 😒";

  useEffect(() => {
    const userStoredData = getStoredData("user");

    if (!userStoredData?.name) {
      setShowModal(true);
    } else if (userStoredData.name && userInput?.name) {
      setShowModal(false);
    } else {
      setShowModal(false);
    }

    if (userStoredData?.name) setUserInput(userStoredData);
  }, [showModal, userInput?.name]);

  return (
    <>
      <section>
        <div className="user">
          <div className="name">
            <h1 id="name">{userName}</h1>
          </div>
        </div>

        <div className="weather">
          <h5>
            Current data showing of {userInput?.location ? "" : "Melborn"}
          </h5>
          <div className="temperature">
            <p id="current-temp">
              <i>Current temperature:</i>
              <span>
                {" "}
                <i>
                  <b>{weather?.temp}</b>
                </i>
              </span>
            </p>
            <p id="max-temp">
              <i>Max temperature:</i>
              <span>
                {" "}
                <i>
                  <b>{weather?.temp_max}</b>
                </i>
              </span>
            </p>
            <p id="weather-des">
              <span>
                {" "}
                <i>
                  <b>{weather?.description}</b>
                </i>
              </span>
            </p>
          </div>
          <div className="ico-container">
            <img
              id="weather-icon"
              src={`https://openweathermap.org/img/wn/${weather?.icon}.png`}
              alt="weather ico"
            />
          </div>
        </div>

        <div className="announce">
          <div className="title">
            <h3>Announcements</h3>
          </div>
          <div className="announcement">
            <p>
              Exciting news! Introducing our new Announcement Tab 📢—the go-to
              place for all company updates and important announcements
            </p>
          </div>
        </div>
      </section>

      <>
        {showModal && (
          <Modal onClose={() => setShowModal(false)}>
            <UserInputModal userInput={userInput} setUserInput={setUserInput} />
          </Modal>
        )}
      </>
    </>
  );
}
