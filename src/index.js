// ------------------Time-------------------

let week = ["Sunday", "Monday", "Thuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function updateTime() {
	let currentTime = new Date();
	let hour = currentTime.getHours();
	let minutes = currentTime.getMinutes();
	if (hour < 10) {
		hour = `0${hour}`;
	}
	if (minutes < 10) {
		minutes = `0${minutes}`;
	}
	let dayGlobal = currentTime.getDay();

	let changeTime = document.querySelector("#current-time");
	changeTime.innerHTML = `${week[dayGlobal]} ${hour}:${minutes}`;
}
updateTime();
getCurrentCityData("Canberra");
// ------------------Search City-------------------
function searchCity(event) {
	event.preventDefault();
	let cityInput = document.querySelector("#search-input");
	getCurrentCityData(cityInput.value);
}
//-------------------getCurrentCityTemperature
function getCurrentGeo() {
	navigator.geolocation.getCurrentPosition(placeGeoData);
	function placeGeoData(position) {
		let apiKey = "6a48a550fc04f170639e60d52b8a6bc5";
		let lat = position.coords.latitude;
		let lon = position.coords.longitude;
		let apiGeoUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&&units=metric`;
		axios.get(apiGeoUrl).then(placeData);
		let cityInput = document.querySelector("#search-input");
		cityInput.value = "";
		cityInput.placeholder = "GEO found(Enter city)";
		updateTime();
	}
}

function getCurrentCityData(cityInput) {
	let apiKey = "6a48a550fc04f170639e60d52b8a6bc5";
	let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}&&units=metric`;
	axios.get(apiUrl).then(placeData);
}
function getCurrentCityForecast(coordinates) {
	let apiKey = "6a48a550fc04f170639e60d52b8a6bc5";
	let apiUrlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&&units=metric`;
	axios.get(apiUrlForecast).then(displayForecast);
}
function placeData(response) {
	let temperature = document.querySelector("#current-temp-value");
	temperature.innerHTML = Math.round(response.data.main.temp);
	let currentCity = document.querySelector("#current-city");
	currentCity.innerHTML = response.data.name;
	let weatherDecription = document.querySelector("#weather-decription");
	weatherDecription.innerHTML = response.data.weather[0].description;
	let icon = document.querySelector("#current-weather");
	icon.src = `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`;
	let currentWind = response.data.wind.deg;
	let currentWindSpeed = Math.round(response.data.wind.speed * 3.6);
	getCurrentWind(currentWind);
	let currentWindDirection = document.querySelector("#current-direction");
	currentWindDirection.src = `images/Directions/${WindIcon}.png`;
	let windText = document.querySelector("#wind-text");
	windText.innerHTML = `${WindIcon} wind ${currentWindSpeed} km/h`;
	getCurrentCityForecast(response.data.coord);
}

function getCurrentWind(currentWind) {
	// North
	if (currentWind > 335 || currentWind < 24) {
		WindIcon = "north";
	}
	// North-East
	if (currentWind > 25 && currentWind < 64) {
		WindIcon = "north-east";
	}
	// East
	if (currentWind > 65 && currentWind < 114) {
		WindIcon = "east";
	}
	// South-East
	if (currentWind > 115 && currentWind < 154) {
		WindIcon = "south-east";
	}
	// South
	if (currentWind > 155 && currentWind < 204) {
		WindIcon = "south";
	}
	// South-West
	if (currentWind > 205 && currentWind < 244) {
		WindIcon = "south-west";
	}
	// West
	if (currentWind > 245 && currentWind < 294) {
		WindIcon = "west";
	}
	// North-West
	if (currentWind > 295 && currentWind < 334) {
		WindIcon = "north-west";
	}
	return WindIcon;
}
function formatDay(timeStamp) {
	let date = new Date(timeStamp * 1000);
	let day = date.getDay();
	return week[day];
}
function displayForecast(response) {
	let forecastElement = document.querySelector("#future-forecast-section");
	let forecastHTML = "";

	for (let i = 1; i < 5; i++) {
		let forecast = response.data.daily[i];
		let forecastWindDirection = forecast.wind_deg;
		let icon = forecast.weather[0].icon;
		let tempDay = Math.ceil(forecast.temp.day);
		let tempNight = Math.ceil(forecast.temp.night);
		getCurrentWind(forecastWindDirection);

		forecastHTML =
			forecastHTML +
			`<div class="row row-border">
              <div class="col-sm-3 day">
                <h4 class="card-title">${formatDay(forecast.dt)}</h4>
              </div>
              <div class="col-sm-2 wind-direction">
                <img
                  src="images/Directions/${WindIcon}.png"
                  alt="${WindIcon} wind direction"
                  class="directions"
                />
              </div>

              <div class="col-sm-2">
                <img src="http://openweathermap.org/img/wn/${icon}@2x.png" class="weather-day" alt="">
              </div>
              <div class="col-sm-4">
                <p class="card-text temepature-day"> 
                <span id="temepature-day">${tempDay}</span>
                /
                <span id="temperature-night">${tempNight}</span>
                °C</p>
              </div>
            </div>`;
	}
	forecastElement.innerHTML = forecastHTML;
	updateTime();
}

let temperature = document.querySelector("#current-temp-value");
let forecastTempDay = document.querySelector("#temepature-day");
let forecastTempNight = document.querySelector("#temepature-night");
let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", searchCity);
let position = document.querySelector("#magnifying-glass");
position.addEventListener("click", getCurrentGeo);
let WindIcon;
