import Capitals from "./Capitals.js";
import CITY from "./City.js";
import config from "./../../config/config.js";

// Focus the search input as the DOM loads
window.onload = function () {
  const searchBar = document.getElementsByName("search-bar")[0];
  if (searchBar) {
    searchBar.focus();
  }
};

const place = document.querySelector("#place");

// Populate city dropdown
if (place && CITY) {
  for (let i in CITY) {
    let option = document.createElement("option");
    option.value = CITY[i];
    option.text = CITY[i];
    place.appendChild(option);
  }
}

function formatAMPM(date) {
  return date.toLocaleString("en-US", {
    hour: '2-digit',
    minute: '2-digit'
  });
}

let isCelsius = true;
let selectedCity;

// Temperature unit toggle
$(".checkbox").change(function () {
  isCelsius = !this.checked;
  if (selectedCity) {
    weather.fetchWeather(selectedCity);
  }
});

// Air Quality functionality
const AirQuality = (city) => {
  fetchAirQuality(city)
    .then((aqi) => updateAirQuality(aqi))
    .catch((error) => {
      console.error("Air quality fetch error:", error);
      updateAirQuality(null);
    });
};

const fetchAirQuality = async (city) => {
  try {
    const url = `https://api.waqi.info/v2/search/?token=${config.AIR_KEY}&keyword=${encodeURIComponent(city)}`;
    
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch air quality data for ${city}: ${res.status}`);
    }
    
    const data = await res.json();
    if (!data.data || data.data.length === 0) {
      throw new Error(`No air quality data found for ${city}`);
    }
    
    const relevantLocation = data.data[0];
    return relevantLocation.aqi;
  } catch (error) {
    console.error("Air quality API error:", error);
    throw error;
  }
};

const updateAirQuality = (aqi) => {
  const airQualityElement = document.querySelector("#AirQuality");
  const qualityDescriptionElement = document.querySelector(".air-quality-label");
  
  if (!airQualityElement || !qualityDescriptionElement) return;
  
  if (aqi === null || aqi === undefined) {
    airQualityElement.innerText = "Air Quality: N/A";
    qualityDescriptionElement.innerText = "Not Available";
    qualityDescriptionElement.className = "air-quality-label ml-0 not-available";
    return;
  }
  
  airQualityElement.innerText = `Air Quality: ${aqi}`;
  
  const airQuality = getAirQualityDescription(aqi);
  const textClass = getAirQualityClass(aqi);
  
  qualityDescriptionElement.innerText = airQuality;
  qualityDescriptionElement.className = "air-quality-label ml-0 " + textClass;
};

const getAirQualityDescription = (aqi) => {
  if (aqi === null || aqi === undefined) return "Not Available";
  
  switch (true) {
    case aqi >= 0 && aqi <= 50:
      return "Good";
    case aqi > 50 && aqi <= 100:
      return "Satisfactory";
    case aqi > 100 && aqi <= 150:
      return "Sensitive";
    case aqi > 150 && aqi <= 200:
      return "Unhealthy";
    case aqi > 200 && aqi <= 300:
      return "Very Unhealthy";
    case aqi > 300:
      return "Hazardous";
    default:
      return "Not Available";
  }
};

const getAirQualityClass = (aqi) => {
  if (aqi === null || aqi === undefined) return "not-available";
  
  switch (true) {
    case aqi >= 0 && aqi <= 50:
      return "good-quality";
    case aqi > 50 && aqi <= 100:
      return "satisfactory-quality";
    case aqi > 100 && aqi <= 150:
      return "sensitive-quality";
    case aqi > 150 && aqi <= 200:
      return "unhealthy-quality";
    case aqi > 200 && aqi <= 300:
      return "very-unhealthy-quality";
    case aqi > 300:
      return "hazardous-quality";
    default:
      return "not-available";
  }
};

// Main weather object
let weather = {
  fetchWeather: function (city) {
    if (!city || city.trim() === "") {
      toastFunction("Please enter a valid city name.");
      return;
    }

    let isCountry = false;
    let index;
    
    // Check if input is a country name
    if (Capitals && Array.isArray(Capitals)) {
      for (let i = 0; i < Capitals.length; i++) {
        if (Capitals[i].country && Capitals[i].country.toUpperCase() === city.toUpperCase()) {
          isCountry = true;
          index = i;
          break;
        }
      }
      if (isCountry && Capitals[index].city) {
        city = Capitals[index].city;
      }
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${config.API_KEY}&lang=en`;
    
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("City not found");
          } else if (response.status === 401) {
            throw new Error("Invalid API key");
          } else {
            throw new Error(`Weather API error: ${response.status}`);
          }
        }
        return response.json();
      })
      .then((data) => {
        const tempElement = document.getElementById("temp");
        const dataWrapper = document.querySelector(".weather-component__data-wrapper");
        
        if (tempElement) tempElement.style.display = "block";
        if (dataWrapper) dataWrapper.style.display = "block";
        
        this.displayWeather(data, city);
      })
      .catch((error) => {
        console.error("Weather fetch error:", error);
        toastFunction(error.message || "No weather found.");
        
        const cityElement = document.getElementById("city");
        const tempElement = document.getElementById("temp");
        const dataWrapper = document.querySelector(".weather-component__data-wrapper");
        
        if (cityElement) cityElement.innerHTML = "City not Found";
        if (tempElement) tempElement.style.display = "none";
        if (dataWrapper) dataWrapper.style.display = "none";
      });
  },

  displayWeather: function (data, city) {
    try {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      const { sunrise, sunset } = data.sys;
      const { lat, lon } = data.coord;

      let date1 = new Date(sunrise * 1000);
      let date2 = new Date(sunset * 1000);

      // Update air quality
      AirQuality(city);

      // Update DOM elements safely
      const updateElement = (id, content) => {
        const element = document.getElementById(id);
        if (element) element.innerText = content;
      };

      updateElement("dynamic", `Weather in ${name}`);
      updateElement("city", `Weather in ${name}`);
      updateElement("description", description);

      // Update weather icon
      const iconElement = document.getElementById("icon");
      if (iconElement) {
        iconElement.src = `https://openweathermap.org/img/wn/${icon}.png`;
        iconElement.alt = description;
      }

      // Temperature conversion and display
      let temperature = temp;
      if (!isCelsius) {
        temperature = temperature * (9 / 5) + 32;
        temperature = (Math.round(temperature * 100) / 100).toFixed(1);
        temperature = temperature + "°F";
      } else {
        temperature = Math.round(temperature) + "°C";
      }
      updateElement("temp", temperature);

      // Update other weather data
      updateElement("humidity", `Humidity: ${humidity}%`);
      updateElement("wind", `Wind speed: ${speed}km/h`);
      updateElement("sunrise", `Sunrise: ${formatAMPM(date1)}`);
      updateElement("sunset", `Sunset: ${formatAMPM(date2)}`);

      // Remove loading class
      const weatherElement = document.getElementById("weather");
      if (weatherElement) {
        weatherElement.classList.remove("loading");
      }

      // Fetch weekly forecast
      const forecastUrl = `${config.API_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${config.API_KEY}`;
      getWeatherWeekly(forecastUrl);

    } catch (error) {
      console.error("Error displaying weather:", error);
      toastFunction("Error displaying weather data");
    }
  },

  search: function () {
    const searchBar = document.querySelector(".weather-component__search-bar");
    if (!searchBar) return;

    const searchValue = searchBar.value.trim();
    if (searchValue !== "") {
      selectedCity = searchValue;
      this.fetchWeather(selectedCity);
    } else {
      toastFunction("Please add a location.");
    }
  },
};

// Weekly weather forecast
async function getWeatherWeekly(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Forecast API error: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.list || data.list.length === 0) {
      throw new Error("No forecast data available");
    }

    // Extract one forecast per day (closest to 12:00)
    const dailyMap = {};
    data.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toLocaleDateString("en-US", { weekday: "long" });
      const hour = date.getHours();
      
      // Pick the forecast closest to 12:00 for each day
      if (!dailyMap[day] || Math.abs(hour - 12) < Math.abs(dailyMap[day].hour - 12)) {
        dailyMap[day] = {
          ...item,
          hour: hour,
          day: day,
          date: date.getDate()
        };
      }
    });
    
    // Convert map to array and keep only the next 5 days
    const dailyArray = Object.values(dailyMap).slice(0, 5);
    showWeatherData(dailyArray);
    
  } catch (error) {
    console.error("Weekly forecast error:", error);
    const container = document.getElementById("weather-forecast");
    if (container) {
      container.innerHTML = "<div class='text-danger'>Unable to load forecast data.</div>";
    }
  }
}

function generateWeatherItem(dayString, iconName, nightTemperature, dayTemperature) {
  let container = document.createElement("div");
  container.className = "forecast-component__item rounded text-center";

  let day = document.createElement("div");
  day.innerText = dayString;
  day.style.color = "#00dcff";
  day.style.fontFamily = "Inter";
  day.style.fontWeight = "bolder";
  day.style.textTransform = "uppercase";
  day.style.fontSize = "20px";

  let newDiv = document.createElement("div");
  newDiv.className = "image-wrapper";

  let icon = document.createElement("img");
  icon.src = `https://openweathermap.org/img/wn/${iconName}.png`;
  icon.alt = `Weather icon for ${dayString}`;

  let dayTemp = document.createElement("div");
  dayTemp.classList.add("weather-forecast-day");
  
  let nightTemp = document.createElement("div");
  
  // Temperature conversion
  if (!isCelsius) {
    let dayTempF = dayTemperature * (9 / 5) + 32;
    let nightTempF = nightTemperature * (9 / 5) + 32;
    dayTempF = Math.round(dayTempF);
    nightTempF = Math.round(nightTempF);
    dayTemp.innerHTML = `Day ${dayTempF}&#176;F`;
    nightTemp.innerHTML = `Night ${nightTempF}&#176;F`;
  } else {
    dayTemp.innerHTML = `Day ${Math.round(dayTemperature)}&#176;C`;
    nightTemp.innerHTML = `Night ${Math.round(nightTemperature)}&#176;C`;
  }
  
  dayTemp.style.fontFamily = "Inter";
  dayTemp.style.fontWeight = "bolder";
  dayTemp.style.textTransform = "uppercase";

  nightTemp.style.color = "#00dcff";
  nightTemp.style.fontFamily = "Inter";
  nightTemp.style.fontWeight = "bolder";
  nightTemp.style.textTransform = "uppercase";

  container.appendChild(day);
  container.appendChild(newDiv);
  newDiv.appendChild(icon);
  container.appendChild(dayTemp);
  container.appendChild(nightTemp);
  
  return container;
}

function showWeatherData(dailyArray) {
  let container = document.getElementById("weather-forecast");
  if (!container) return;
  
  container.innerHTML = "";
  
  if (!dailyArray || !Array.isArray(dailyArray) || dailyArray.length === 0) {
    container.innerHTML = "<div class='text-danger'>No forecast data available.</div>";
    return;
  }
  
  dailyArray.forEach((item) => {
    if (!item.weather || !item.weather[0] || !item.main) return;
    
    let dayString = item.day;
    let dateString = item.date;
    let element = generateWeatherItem(
      dayString,
      item.weather[0].icon,
      item.main.temp_min,
      item.main.temp_max
    );
    showCurrDay(dayString, parseInt(dateString), element);
    container.appendChild(element);
  });
}

// Toast notification function
function toastFunction(val) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  
  toast.className = "show";
  toast.innerText = val;
  
  setTimeout(function () {
    toast.className = toast.className.replace("show", "");
  }, 3000);
}

// Event listeners
const searchButton = document.querySelector(".weather-component__search button");
if (searchButton) {
  searchButton.addEventListener("click", function () {
    weather.search();
  });
}

const searchBar = document.querySelector(".weather-component__search-bar");
if (searchBar) {
  searchBar.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      weather.search();
    }
  });
  
  // Set placeholder
  searchBar.placeholder = "Search for a city...";
}

// Get user's location and fetch weather
async function initializeWeather() {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) {
      throw new Error("Failed to get location");
    }
    
    const data = await response.json();
    if (data.city) {
      selectedCity = data.city;
      weather.fetchWeather(data.city);
    } else {
      // Fallback to a default city
      selectedCity = "London";
      weather.fetchWeather("London");
    }
  } catch (error) {
    console.error("Location fetch error:", error);
    // Fallback to a default city
    selectedCity = "London";
    weather.fetchWeather("London");
  }
}

// Initialize the app
initializeWeather();

// Show current day in forecast
function showCurrDay(dayString, dateString, element) {
  const days = [
    "Sunday", "Monday", "Tuesday", "Wednesday", 
    "Thursday", "Friday", "Saturday"
  ];
  const date = new Date();
  const dayName = days[date.getDay()];
  const dayNumber = date.getDate();
  
  if (dayString === dayName && dateString === dayNumber) {
    element.classList.add("forecast-component__item-current-day");
  }
}

// Live time display
const weekday = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday"
];

const month = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const formatLeadingZero = (value) => {
  return value.toString().padStart(2, '0');
};

function updateDateTime() {
  const now = new Date();
  const time = `${weekday[now.getDay()]}  ${now.getDate()}  ${month[now.getMonth()]} ${now.getFullYear()}, Clock: ${formatLeadingZero(now.getHours())}:${formatLeadingZero(now.getMinutes())}:${formatLeadingZero(now.getSeconds())}`;
  
  const dateTimeElement = document.getElementById("date-time");
  if (dateTimeElement) {
    dateTimeElement.innerHTML = time;
  }
}

// Update time every second
setInterval(updateDateTime, 1000);

// Scroll to top functionality
const scrollTop = function () {
  const scrollBtn = document.createElement("button");
  scrollBtn.innerHTML = "&#8679;";
  scrollBtn.setAttribute("id", "scroll-btn");
  document.body.appendChild(scrollBtn);

  const scrollBtnDisplay = function () {
    if (window.scrollY > window.innerHeight) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  };
  
  window.addEventListener("scroll", scrollBtnDisplay);

  const scrollWindow = function () {
    window.scroll({ top: 0, behavior: "smooth" });
  };
  
  scrollBtn.addEventListener("click", scrollWindow);
};

scrollTop();

// Speech recognition functionality
if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  const microphoneButton = document.querySelector(".weather-component__button-microphone");
  const searchBar = document.querySelector(".weather-component__search-bar");

  if (microphoneButton && searchBar) {
    microphoneButton.addEventListener("click", () => {
      try {
        recognition.start();
        microphoneButton.classList.add("listening");
      } catch (error) {
        console.error("Speech recognition start error:", error);
      }
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      searchBar.value = transcript;
      microphoneButton.classList.remove("listening");
      
      // Auto-search after speech input
      setTimeout(() => {
        weather.search();
      }, 500);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      microphoneButton.classList.remove("listening");
      toastFunction("Voice recognition failed. Please try again.");
    };

    recognition.onend = () => {
      microphoneButton.classList.remove("listening");
    };
  }
} else {
  console.warn("Speech recognition is not supported in this browser.");
}

// Mouse follower circle
let follower = document.getElementById("circle");
let timer = null;

if (follower) {
  window.addEventListener("mousemove", function (event) {
    let y = event.clientY;
    let x = event.clientX;
    
    if (timer) {
      clearTimeout(timer);
    }
    
    timer = setTimeout(function () {
      follower.style.top = `${y}px`;
      follower.style.left = `${x}px`;
    }, 16); // ~60fps
  });
}