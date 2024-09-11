import React, { useState } from "react";
import { MainWrapper } from "./stylesModule";
import { IoIosSearch } from "react-icons/io";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa6";
import {
  BsFillSunFill,
  BsCloudyFill,
  BsFillCloudRainFill,
  BsCloudFog2Fill,
} from "react-icons/bs";
import { RiLoaderFill } from "react-icons/ri";
import { TiWeatherPartlySunny } from "react-icons/ti";
import axios from "axios";
import { WeatherDataTypes } from "./types/weatherTypes";

const DisplayWeather = () => {
  const api_key = "86a18b62efdd0f6e5a388228e2775e9e";

  const api_Endpoint = "https://api.openweathermap.org/data/2.5/";

  const [weatherData, setWeatherData] = React.useState<WeatherDataTypes | null>(
    null
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const [searchCity, setSearchCity] = React.useState("");
  const [error, setError] = useState<string | null>(null);

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const searchResponse = await axios.get(url);

      const currentSearchResults: WeatherDataTypes = searchResponse.data;
      return { currentSearchResults };
    } catch (error) {
      console.error("No data found for current location");
      throw error;
    }
  };

  const handleSearch = async () => {
    if (searchCity.trim() === "") {
      setError("Please enter a city name.");
      return;
    }

    try {
      const { currentSearchResults } = await fetchWeatherData(searchCity);
      setWeatherData(currentSearchResults);
      setError(null); // clear error if the data is found
    } catch (error) {
      setError("No data found for this location.");
      console.error("No Results Found");
    }
  };

  const iconChanger = (weather: string) => {
    let iconElement: React.ReactNode;
    let iconColor: string;

    switch (weather) {
      case "Rain":
        iconElement = <BsFillCloudRainFill />;
        iconColor = "#272829";
        break;

      case "Clear":
        iconElement = <BsFillSunFill />;
        iconColor = "#FFC436";
        break;

      case "Clouds":
        iconElement = <BsCloudyFill />;
        iconColor = "#102C57";
        break;

      case "Mist":
        iconElement = <BsCloudFog2Fill />;
        iconColor = "#279EFF";
        break;

      default:
        iconElement = <TiWeatherPartlySunny />;
        iconColor = "#7b2869";
    }

    return (
      <span className="icon" style={{ color: iconColor }}>
        {iconElement}
      </span>
    );
  };

  React.useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      Promise.all([fetchCurrentWeather(latitude, longitude)]).then(
        ([currentWeather]) => {
          setWeatherData(currentWeather);
          setIsLoading(true);
        }
      );
    });
  }, []); // added an empty array to prevent infinite re-rendering
  return (
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="enter a city"
          />

          <div className="searchCircle">
            <IoIosSearch className="searchIcon" onClick={handleSearch} />
          </div>
        </div>
        {error && <div className="error-mesage">{error}</div>}

        {weatherData && isLoading ? (
          <>
            <div className="weatherArea">
              <h1>{weatherData.name}</h1>
              <span>{weatherData.sys.country}</span>
              <div className="icon">
                {iconChanger(weatherData.weather[0].main)}
              </div>
              <h1>{weatherData.main.temp.toFixed(0)}</h1>
              <h2>{weatherData.weather[0].main}</h2>
            </div>
            <div className="bottomInfoArea">
              <div className="humidityLevel">
                <WiHumidity className="windIcon" />
                <div className="humidInfo">
                  <h2>{weatherData.main.humidity}%</h2>
                  <p>Humidity</p>
                </div>
              </div>
              <div className="wind">
                <FaWind className="windIcon" />
                <div className="humidityLevel">
                  <h2>{weatherData.wind.speed}</h2>
                  <p>wind speed</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="loading">
            <RiLoaderFill className="loadingIcon" />
            <p>loading</p>
          </div>
        )}
      </div>
    </MainWrapper>
  );
};

export default DisplayWeather;
