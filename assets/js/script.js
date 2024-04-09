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
            displayErrorMessage('Please input an actual city');
        });
}

function displayWeather(data) {
    document.getElementById('city-name').textContent = data.name;
    const tempCelsius = data.main.temp - 273.15;
    const tempFahrenheit = (tempCelsius * 9/5) + 32;
    document.getElementById('temperature').textContent = `${Math.round(tempFahrenheit)}°F`;
    document.getElementById('description').textContent = data.weather[0].description;
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

