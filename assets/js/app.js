const apiKey = "0e59dae15ac0a8aa871a6987a34e2380";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherImage = document.getElementById("weatherImage");
const loadingText = document.getElementById("loading");
const errorText = document.getElementById("error");
const recentList = document.getElementById("recentList");


// Load Recent Searches
function loadRecentSearches() {
    const items = JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentList.innerHTML = "";

    items.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.style.cursor = "pointer";

        li.addEventListener("click", () => {
            checkWeather(city);
        });

        recentList.appendChild(li);
    });
}


// Save Recent Searches
function saveRecentSearch(city) {
    let items = JSON.parse(localStorage.getItem("recentSearches")) || [];

    items = items.filter(item => item.toLowerCase() !== city.toLowerCase());
    items.unshift(city);

    localStorage.setItem("recentSearches", JSON.stringify(items));
    loadRecentSearches();
}


// Render Weather UI
function renderWeather(data) {

    document.getElementById('cityName').innerHTML = data.name;
    document.getElementById('weatherType').innerHTML = data.weather[0].main;
    document.getElementById('temp').innerHTML = Math.round(data.main.temp) + "°C";
    document.getElementById('humidity').innerHTML = data.main.humidity + "%";
    document.getElementById('wind').innerHTML = data.wind.speed + "km/h ";


    if (data.weather[0].main == "Clouds") {
        weatherImage.src = ".//assets/images/cloudy.png"

    } else if (data.weather[0].main == "Clear") {
        weatherImage.src = ".//assets/images/clear.png"

    } else if (data.weather[0].main == "Rain") {
        weatherImage.src = ".//assets/images/heavy-rain.png"

    } else if (data.weather[0].main == "Drizzle") {
        weatherImage.src = ".//assets/images/drizzle.png"

    } else if (data.weather[0].main == "Mist") {
        weatherImage.src = ".//assets/images/mist.png"

    } else if (data.weather[0].main == "Haze") {
        weatherImage.src = ".//assets/images/haze.png"

    } else if (data.weather[0].main == "Sunny") {
        weatherImage.src = ".//assets/images/sunny.png"
    }

    document.querySelector(".weather-card").style.display = "block";

}

// Main Weather Function
async function checkWeather(city) {
    if (!city) return;

    document.querySelector(".weather-card").style.display = "none";
    loadingText.style.display = "block";
    errorText.style.display = "none";

    try {
        const res = await fetch(apiUrl + city + `&appid=${apiKey}`);
        if (!res.ok) throw new Error();

        const data = await res.json();

        loadingText.style.display = "none";
        renderWeather(data);
        saveRecentSearch(data.name);

    } catch {
        loadingText.style.display = "none";
        errorText.style.display = "block";
    }
    getForecast(city);
}


// Search Button Click
searchBtn.addEventListener("click", () => {
    checkWeather(cityInput.value.trim());
    cityInput.value = "";
    cityInput.blur()
});


// Search Button Keypress
cityInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});


// 3-Day Forecast Function
async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const forecastContainer = document.getElementById("forecastContainer");
        const forecastSection = document.querySelector(".forecast");
        forecastContainer.innerHTML = "";
        forecastSection.style.display = "none";

        const selectionIndexes = [4, 12, 20];

        selectionIndexes.forEach(i => {
            if (!data.list[i]) return;

            const day = data.list[i];
            const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
                weekday: "short"
            });

            const temp = Math.round(day.main.temp);
            const icon = day.weather[0].icon;

            const div = document.createElement("div");
            div.className = "forecast-day";

            div.innerHTML = `
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${temp}°C</p>
            `;

            forecastContainer.appendChild(div);
        });

        if (forecastContainer.children.length > 0) {
            forecastSection.style.display = "block";
        }

    } catch (err) {
        console.log("Forecast error", err);
    }
}


// Load recent searches on page load
loadRecentSearches();


