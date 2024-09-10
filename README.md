WeatherApp Documentation
Introduction
The WeatherApp is a React-based web application that provides real-time weather information for various cities, including states in Nigeria. Users can search for a city and get updated weather details like temperature, humidity, and wind speed. The app leverages the OpenWeatherMap API for fetching weather data.

Features
Real-Time Weather: Displays current weather data (temperature, humidity, wind speed, etc.) for any searched city.
Geolocation Support: Uses the device's geolocation to show the weather of the user's current location.
Icon Display: Weather conditions like clouds, rain, and clear skies are displayed with appropriate icons.
Error Handling: Informs users when no data is available for a searched city.
Technology Stack
Frontend: React, TypeScript
Styling: Tailwind CSS
API: OpenWeatherMap
Icons: React Icons (for weather conditions)
How It Works
Geolocation: Upon loading, the app fetches the user’s location coordinates via navigator.geolocation and retrieves weather information using OpenWeatherMap.
Search Functionality: Users can search for a city using the search bar, and the app displays the corresponding weather data.
Weather Icons: Based on the weather condition (e.g., rain, clear sky), appropriate icons are dynamically displayed.
Error Notification: If the search results yield no weather data (e.g., incorrect city names), a user notification is displayed indicating "No Results Found."
