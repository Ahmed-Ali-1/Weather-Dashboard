// const apiKey = "0e59dae15ac0a8aa871a6987a34e2380"
// const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
// const cityInput = document.getElementById('cityInput');
// const searchBtn = document.getElementById('searchBtn');
// const weatherImage = document.getElementById('weatherImage')
// const loadingText = document.getElementById('loading');
// const errorText = document.getElementById('error');
// const recentList = document.getElementById('recentList');

// async function checkWeather(city) {
//     document.querySelector(`.weather-card`).style.display = "none"
//     loadingText.style.display = "block";
//     errorText.style.display = "none";

//     try {
//         const response = await fetch(apiUrl + city + `&appid=${apiKey}`);

//         if (!response.ok) {
//             throw new Error("City not found");
//         }

//         const data = await response.json();
//         loadingText.style.display = "none";

//         document.getElementById('cityName').innerHTML = data.name;
//         document.getElementById('weatherType').innerHTML = data.weather[0].main;
//         document.getElementById('temp').innerHTML = Math.round(data.main.temp) + "°C";
//         document.getElementById('humidity').innerHTML = data.main.humidity + "%";
//         document.getElementById('wind').innerHTML = data.wind.speed + "km/h ";

//         if (data.weather[0].main == "Clouds") {
//             weatherImage.src = ".//assets/images/cloudy.png"

//         } else if (data.weather[0].main == "Clear") {
//             weatherImage.src = ".//assets/images/sunny.png"

//         } else if (data.weather[0].main == "Rain") {
//             weatherImage.src = ".//assets/images/heavy-rain.png"

//         } else if (data.weather[0].main == "Drizzle") {
//             weatherImage.src = ".//assets/images/drizzle.png"

//         } else if (data.weather[0].main == "Mist") {
//             weatherImage.src = ".//assets/images/mist.png"
//         }
//         document.querySelector(`.weather-card`).style.display = "block"

//     } catch (error) {
//         loadingText.style.display = "none";
//         errorText.style.display = "block";
//     }

// }

// searchBtn.addEventListener('click', () => {
//     checkWeather(cityInput.value.trim());
//     cityInput.value = ""

// })


const apiKey = "0e59dae15ac0a8aa871a6987a34e2380";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const weatherImage = document.getElementById("weatherImage");
const loadingText = document.getElementById("loading");
const errorText = document.getElementById("error");
const recentList = document.getElementById("recentList");


// ---------------------
// Load Recent Searches
// ---------------------
function loadRecentSearches() {
    const items = JSON.parse(localStorage.getItem("recentSearches")) || [];
    recentList.innerHTML = "";

    items.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.style.cursor = "pointer";

        // Click to search again
        li.addEventListener("click", () => {
            checkWeather(city);
        });

        recentList.appendChild(li);
    });
}


// ---------------------
// Save Recent Searches
// ---------------------
function saveRecentSearch(city) {
    let items = JSON.parse(localStorage.getItem("recentSearches")) || [];

    items = items.filter(item => item.toLowerCase() !== city.toLowerCase());
    items.unshift(city);

    localStorage.setItem("recentSearches", JSON.stringify(items));
    loadRecentSearches();
}



// ---------------------
// Render Weather UI
// ---------------------
function renderWeather(data) {
    document.getElementById("cityName").textContent = data.name;
    document.getElementById("weatherType").textContent = data.weather[0].main;
    document.getElementById("temp").textContent = Math.round(data.main.temp) + "°C";
    document.getElementById("humidity").textContent = data.main.humidity + "%";
    document.getElementById("wind").textContent = data.wind.speed + "km/h";

    if (data.weather[0].main == "Clouds") {
        weatherImage.src = ".//assets/images/cloudy.png"

    } else if (data.weather[0].main == "Clear") {
        weatherImage.src = ".//assets/images/sunny.png"

    } else if (data.weather[0].main == "Rain") {
        weatherImage.src = ".//assets/images/heavy-rain.png"

    } else if (data.weather[0].main == "Drizzle") {
        weatherImage.src = ".//assets/images/drizzle.png"

    } else if (data.weather[0].main == "Mist") {
        weatherImage.src = ".//assets/images/mist.png"
    }

    document.querySelector(".weather-card").style.display = "block";
}



// ---------------------
// Main Weather Function
// ---------------------
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



// ---------------------
// Search Button Click
// ---------------------
searchBtn.addEventListener("click", () => {
    checkWeather(cityInput.value.trim());
    cityInput.value = "";
});




// ---------------------
// 3-Day Forecast Function
// ---------------------
async function getForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        const forecastContainer = document.getElementById("forecastContainer");
        forecastContainer.innerHTML = "";

        // Roz 8 entries hoti hain (3 hours interval)
        // Har din ka 12pm (index 4, 12, 20...) pick kar lenge
        const selectionIndexes = [4, 12, 20]; // 3-day basic

        selectionIndexes.forEach(i => {
            if (!data.list[i]) return;

            const day = data.list[i];
            const date = new Date(day.dt_txt).toLocaleDateString("en-US", {
                weekday: "short"
            });

            const temp = Math.round(day.main.temp);
            const icon = day.weather[0].icon;

            // Card create
            const div = document.createElement("div");
            div.className = "forecast-day";

            div.innerHTML = `
                <p>${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png">
                <p>${temp}°C</p>
            `;

            forecastContainer.appendChild(div);
        });

    } catch (err) {
        console.log("Forecast error", err);
    }
}



// ---------------------
// Load recent searches on page load
// ---------------------
loadRecentSearches();


