import React, { useCallback, useState } from "react";
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

  // fetch current weather based on users geolocation

  const fetchCurrentWeather = async (lat: number, lon: number) => {
    const url = `${api_Endpoint}weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
    const response = await axios.get(url);
    return response.data;
  };

  // Fetch weather data based on city

  const fetchWeatherData = async (city: string) => {
    try {
      const url = `${api_Endpoint}weather?q=${city}&appid=${api_key}&units=metric`;
      const searchResponse = await axios.get(url);

      const currentSearchResults: WeatherDataTypes = searchResponse.data;
      return { currentSearchResults };
    } catch (error) {
      throw new Error("No data found for this location");
    }
  };

  // handle manual city search

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

  // Request geolocation access and handle permission/error
  const requestLocationAccess = useCallback(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchCurrentWeather(latitude, longitude).then((currentWeather) => {
            setWeatherData(currentWeather);
            setIsLoading(true);
          });
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("Permission denied. Please enable location services.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location unavailable.");
              break;
            case error.TIMEOUT:
              setError("Location request timed out.");
              break;
            default:
              setError("An unknown error occurred.");
          }
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  // handle key press for ENter key
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(); // Trigger search when Enter key is pressed
    }
  };

  React.useEffect(() => {
    requestLocationAccess();
  }, [requestLocationAccess]); // added an empty array to prevent infinite re-rendering
  return (
    <MainWrapper>
      <div className="container">
        <div className="searchArea">
          <input
            type="text"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
            placeholder="enter a city"
            onKeyDown={handleKeyPress} // Event listener for Enter Key press
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
