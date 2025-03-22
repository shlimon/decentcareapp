import { useEffect, useState } from "react";

const useWeatherData = (location = "Melbourne") => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    temp: 0.0,
    temp_max: 0.0,
    icon: "01d",
    description: "Unsupported cloud",
  });

  // Weather api
  const URI = `https://api.openweathermap.org/data/2.5/weather?q=${location},au&appid=df355489397b8066e9c8cba704a4e358&units=metric`;

  useEffect(() => {
    try {
      setIsLoading(true);

      fetch(URI)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.weather && data.weather.length > 0 && data.main) {
            setData({
              temp: data.main.temp || 0.0,
              temp_max: data.main.temp_max || 0.0,
              description: data.weather[0].description || "Unknown",
              icon: data.weather[0].icon || "01d",
            });
          } else {
            setError("Weather data not available");
            setData({
              temp: 0.0,
              temp_max: 0.0,
              icon: "01d",
              description: "Data unavailable",
            });
          }
        })
        .catch((err) => {
          setError(err.message || "Failed to fetch weather data");
        });
      setError("");
    } catch (error) {
      setData({});
      setError(error?.message ? error?.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }, [URI, isLoading]);

  return { isLoading, error, weather: data };
};

export default useWeatherData;
