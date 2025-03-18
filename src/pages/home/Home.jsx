import React, { useEffect, useState } from "react";
import getWeatherData from "../../utils/getWeatherData";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getWeatherData();
      setWeather(data);
    };

    fetchData();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <main>
      <div className="user">
        <div className="name">
          <h1 id="name"></h1>
        </div>
      </div>

      <div className="weather">
        <div className="temperature">
          <p id="current-temp">
            <i>Current temperature:</i>
            {weather?.temp}
          </p>
          <p id="max-temp">
            <i>Max temperature:</i>
            {weather?.temp_max}
          </p>
          <p id="weather-des">
            <i>{weather?.description}</i>
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
    </main>
  );
}
