const getWeatherData = async () => {
  try {
    const URL =
      "https://api.openweathermap.org/data/2.5/weather?q=Melbourne,au&appid=df355489397b8066e9c8cba704a4e358&units=metric";

    const response = await fetch(URL);
    const data = await response.json();

    const weather = {
      temp: data.main.temp,
      temp_max: data.main.temp_max,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };

    return weather;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      temp: 0,
      temp_max: 0,
      description: "Unable to fetch weather data",
      icon: "",
    };
  }
};

export default getWeatherData;
