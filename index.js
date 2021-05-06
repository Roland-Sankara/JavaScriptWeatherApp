// Select Elements
const iconElement = document.querySelector('.weather-icon');
const tempElement = document.querySelector('.temperature-value');
const descElement = document.querySelector('.temperature-description p');
const locationElement = document.querySelector('.location p');
const notificationElement = document.querySelector('.notification');

// Weather Object
const weather = {
    temperature: {
        unit: "celsius"
    }
}

// App Constants and Variables.
const KELVIN = 273;
// Api key
let key = "e10a26cfe826693d03d42a297130341e";



function getLocation() {
    // check if browser supports Geolocation
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition,showError);
  } else { 
    console.log("Geolocation is not supported by this browser.");
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesnot support Geolocation</p>";

  }
}

// Set user's Positiion
function showPosition(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);

  getWeather(position.coords.latitude,position.coords.longitude);
}

// Show error if there is any issue
function showError(error){
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

getLocation();


// Get weather from the API provider
function getWeather(latitudeCoord,longitudeCoord){
  let url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitudeCoord}&lon=${longitudeCoord}&appid=${key}`
  fetch(url).then(response=>{
      if(!response.ok){
        throw new Error(`${response.status} error == Failed to Fetch data`);
      }
      return response.json();
  }).then(data=>{
      console.log(data);
    //   add the properties to the weather object
      weather.temperature.value = Math.floor(data.main.temp - KELVIN); // covert temprature to celsius
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
      console.log(weather)
      displayWeather();

  }).catch(error=>{
      console.error(error.message);
  })
}

// Display the Weather
function displayWeather(){
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `<p>${weather.temperature.value}&deg;<span>C</span></p>`;
    descElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F conversion
function celsiustoFahrenheit(temprature){
    return (temprature* 9/5)+32;
}

// when user clicks on the temp element
tempElement.addEventListener('click',()=>{
    if(weather.temperature.value === undefined ) return;
    if(weather.temperature.unit === "celsius"){
        let fahrenheit = celsiustoFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);

        tempElement.innerHTML = `<p>${fahrenheit}&deg;<span>F</span></p>`
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `<p>${weather.temperature.value}&deg;<span>C</span></p>`;
        weather.temperature.unit = "celsius";
    }
});