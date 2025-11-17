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
}



// ---------------------
// Search Button Click
// ---------------------
searchBtn.addEventListener("click", () => {
    checkWeather(cityInput.value.trim());
    cityInput.value = "";
});


// ---------------------
// Load recent searches on page load
// ---------------------
loadRecentSearches();
