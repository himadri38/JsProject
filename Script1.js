const API_KEY = "fcc8de7015bbb202209bbf0261babf4c";
const cityInput = document.querySelector(".city-input");
const searchButton = document.querySelector(".search-btn");
const locationButton = document.querySelector(".location-btn");
const currentWeatherContainer = document.querySelector(".current-weather .details");
const forecastContainer = document.querySelector(".weather-cards");

const fetchWeatherData = async (lat, lon) => {
    try {
        const CURRENT_WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const responseCurrent = await fetch(CURRENT_WEATHER_URL);
        const dataCurrent = await responseCurrent.json();
        displayCurrentWeather(dataCurrent);

        const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const responseForecast = await fetch(FORECAST_URL);
        const dataForecast = await responseForecast.json();
        displayForecast(dataForecast);
    } catch (error) {
        alert("Error fetching weather data!");
        console.error(error);
    }
};

const displayCurrentWeather = (data) => {
    const { name, main, wind, weather } = data;
    const date = new Date().toLocaleDateString();
    currentWeatherContainer.innerHTML = `
        <h2>${name} (${date})</h2>
        <h4>Temperature: ${main.temp}°C</h4>
        <h4>Wind: ${wind.speed} m/s</h4>
        <h4>Humidity: ${main.humidity}%</h4>
    `;
    const iconContainer = document.querySelector(".current-weather .icon");
    iconContainer.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}@4x.png" alt="weather-icon">
        <h4>${weather[0].description}</h4>
    `;
};

const displayForecast = (data) => {
    forecastContainer.innerHTML = "";
    const forecasts = data.list.filter((_, index) => index % 8 === 0).slice(0, 5);
    
    forecasts.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const forecastItem = document.createElement("li");
        forecastItem.classList.add("card");
        forecastItem.innerHTML = `
            <h3>${date}</h3>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="weather-icon">
            <h4>Temperature: ${item.main.temp}°C</h4>
            <h4>Wind: ${item.wind.speed} m/s</h4>
            <h4>Humidity: ${item.main.humidity}%</h4>
        `;
        forecastContainer.appendChild(forecastItem);
    });
};

const fetchCoordinates = async (cityName) => {
    try {
        const GEO_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`;
        const response = await fetch(GEO_API_URL);
        const data = await response.json();
        if (data.length > 0) {
            const { lat, lon } = data[0];
            fetchWeatherData(lat, lon);
        } else {
            alert("City not found. Please enter a valid city name.");
        }
    } catch (error) {
        alert("Error fetching coordinates for the city!");
        console.error(error);
    }
};

searchButton.addEventListener("click", () => {
    const cityName = cityInput.value.trim();
    if (cityName) {
        fetchCoordinates(cityName);
    } else {
        alert("Please enter a city name.");
    }
});

locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherData(latitude, longitude);
            },
            () => alert("Unable to retrieve your location.")
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});
