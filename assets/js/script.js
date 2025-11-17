const apiKey = "0e59dae15ac0a8aa871a6987a34e2380";
const weatherBase = "https://api.openweathermap.org/data/2.5/weather";
const forecastBase = "https://api.openweathermap.org/data/2.5/forecast";

// DOM Elements
const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const cityName = document.getElementById("cityName");
const weatherType = document.getElementById("weatherType");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");
const weatherImage = document.getElementById("weatherImage");
const recentList = document.getElementById("recentList");
const forecastCard = document.getElementById("forecastCard");
const forecastContainer = document.getElementById("forecastContainer");

// Initialize recent searches from localStorage
let recentCities = JSON.parse(localStorage.getItem("recentCities")) || [];
renderRecentSearches();

// Search button click
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});

// Get weather data (simple version)
async function getWeather(city) {

    showLoading();

    try {
        const response = await fetch(
            `${weatherBase}?q=${city}&appid=${apiKey}&units=metric`
        );

        // Agar city exist nahi karti
        if (!response.ok) {
            showError();
            return;
        }

        const data = await response.json();

        // UI update
        renderWeather(data);

        // Recent list save
        saveRecentCity(city);

        // Forecast get
        getForecast(city);

    } catch (error) {
        showError();
    }
}


// Fetch 5-day forecast
async function getForecast(city) {
    try {
        const res = await fetch(`${forecastBase}?q=${city}&appid=${apiKey}&units=metric`);
        const data = await res.json();

        renderForecast(data);
    } catch {
        forecastCard.style.display = "none";
    }
}

// Render main weather info
function renderWeather(data) {
    cityName.textContent = data.name;
    weatherType.textContent = data.weather[0].main;
    temperature.textContent = `${data.main.temp} °C`;
    humidity.textContent = `${data.main.humidity}%`;
    wind.textContent = `${data.wind.speed} km/h`;

    const type = data.weather[0].main.toLowerCase();
    if (type.includes("cloud")) weatherImage.src = ".//assets/images/cloudy.png";
    else if (type.includes("rain")) weatherImage.src = ".//assets/images/heavy-rain.png";
    else if (type.includes("clear")) weatherImage.src = ".//assets/images/sunny.png";
    else weatherImage.src = ".//assets/images/web.png";
}

// Render 5-day forecast
function renderForecast(data) {
    forecastContainer.innerHTML = "";
    forecastCard.style.display = "block";

    // Show 5 days, pick data every 8 items (24h interval)
    for (let i = 0; i < data.list.length; i += 8) {
        const day = data.list[i];
        const div = document.createElement("div");
        div.style.minWidth = "80px";
        div.style.textAlign = "center";
        div.innerHTML = `
            <p>${new Date(day.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
            <img src="./assets/images/${day.weather[0].main.toLowerCase()}.png" width="50" height="50" />
            <p>${Math.round(day.main.temp)}°C</p>
        `;
        forecastContainer.appendChild(div);
    }
}

// Show loading
function showLoading() {
    cityName.textContent = "Loading...";
    weatherType.textContent = "";
    temperature.textContent = "--";
    humidity.textContent = "--";
    wind.textContent = "--";
    weatherImage.src = "./assets/images/cloudy.png";
    forecastCard.style.display = "none";
}

// Show error
function showError() {
    cityName.textContent = "Invalid city. Try again.";
    weatherType.textContent = "";
    temperature.textContent = "--";
    humidity.textContent = "--";
    wind.textContent = "--";
    weatherImage.src = "./assets/images/cloudy.png";
    forecastCard.style.display = "none";
}

// Save recent city
function saveRecentCity(city) {
    if (!recentCities.includes(city)) {
        recentCities.unshift(city);
        if (recentCities.length > 5) recentCities.pop();
        localStorage.setItem("recentCities", JSON.stringify(recentCities));
        renderRecentSearches();
    }
}

// Render recent searches
function renderRecentSearches() {
    recentList.innerHTML = "";
    recentCities.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.addEventListener("click", () => getWeather(city));
        recentList.appendChild(li);
    });
}
