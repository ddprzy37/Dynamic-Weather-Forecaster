const apiKey = '67678bdb629b68d36147f11bd4b6a739';

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    getWeather(city);
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(data => {
            displayWeather(data);
            addToHistory(city);
        })
        .catch(error => {
            console.log('Error fetching weather:', error);
            displayErrorMessage(error.message);
        });
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    const date = new Date(data.dt * 1000);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('date').textContent = date.toLocaleDateString(undefined, options);

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
    document.getElementById('weather-icon').src = iconUrl;

    const tempFahrenheit = (data.main.temp - 273.15) * 9/5 + 32;
    document.getElementById('temperature').textContent = `${Math.round(tempFahrenheit)}°F`;

    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;

    // Convert wind speed from m/s to mph
    const windSpeedMph = data.wind.speed * 2.23694;
    document.getElementById('wind-speed').textContent = `Wind Speed: ${windSpeedMph.toFixed(2)} mph`;
}



function addToHistory(city) {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    document.getElementById('history-list').appendChild(listItem);
}

function displayErrorMessage(message) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    const weatherContainer = document.querySelector('.weather-container');
    weatherContainer.appendChild(errorMessage);
    setTimeout(() => {
        weatherContainer.removeChild(errorMessage);
    }, 3000);
}

