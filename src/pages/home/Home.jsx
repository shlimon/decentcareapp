import { useAuth } from "../../context/auth";
import useWeatherData from "../../hooks/useWeatherData";

export default function Home() {
  const { userData } = useAuth();

  // user data
  const user = userData.user;

  // get weather data
  const { weather } = useWeatherData(user?.location);

  const userName = user?.name ? `Hello, ${user.name} 👋` : "Your name, please?";

  return (
    <>
      <section>
        <div className="user">
          <div className="name">
            <h1 id="name" className="user_name">
              {userName}
            </h1>
          </div>
        </div>

        <div className="weather">
          <div className="temperature">
            <h4 className="temperature_child">
              Current location: {user?.location ? user?.location : "Melbourne"}
            </h4>
            <p className="temperature_child">
              <i>Current temperature:</i>
              <span>
                {" "}
                <i>
                  <b>{weather?.temp}C</b>
                </i>
              </span>
            </p>
            <p className="temperature_child">
              <i>Max temperature:</i>
              <span>
                {" "}
                <i>
                  <b>{weather?.temp_max}C</b>
                </i>
              </span>
            </p>
            <p className="temperature_child">
              <span>
                {" "}
                <i>
                  <b>Environment: {weather?.description}</b>
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
    </>
  );
}
