const apiKey = '67678bdb629b68d36147f11bd4b6a739';

document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    getWeather(city);
});

document.getElementById('history-list').addEventListener('click', function(event) {
    const city = event.target.textContent;
    getWeather(city);
});

function getWeather(city) {
    // Clear previous forecast data
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    // Clear previous search history
    clearHistory();

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('City not found');
            }
            return response.json();
        })
        .then(function(data) {
            displayForecast(data);
            addToHistory(city);
        })
        .catch(function(error) {
            console.log('Error fetching weather:', error);
            displayErrorMessage('Please input an actual city');
        });
}


function displayForecast(data) {
    const forecastList = data.list;
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

    // Counter to keep track of the number of forecasts displayed
    let forecastCount = 0;

    forecastList.forEach(function(item) {
        // Stop displaying forecasts after the next five
        if (forecastCount >= 5) {
            return;
        }

        const date = new Date(item.dt * 1000);
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');

        const dateElement = document.createElement('p');
        dateElement.textContent = date.toLocaleDateString(undefined, options);
        forecastItem.appendChild(dateElement);

        const iconCode = item.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}.png`;
        const iconElement = document.createElement('img');
        iconElement.src = iconUrl;
        forecastItem.appendChild(iconElement);

        const tempCelsius = item.main.temp - 273.15;
        const tempFahrenheit = (tempCelsius * 9/5) + 32;
        const tempElement = document.createElement('p');
        tempElement.textContent = `Temperature: ${Math.round(tempFahrenheit)}°F`;
        forecastItem.appendChild(tempElement);

        const windSpeed = item.wind.speed;
        const windElement = document.createElement('p');
        windElement.textContent = `Wind Speed: ${windSpeed} m/s`;
        forecastItem.appendChild(windElement);

        const humidity = item.main.humidity;
        const humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${humidity}%`;
        forecastItem.appendChild(humidityElement);

        forecastContainer.appendChild(forecastItem);

        // Increment the forecast counter
        forecastCount++;
    });
}


function addToHistory(city) {
    const listItem = document.createElement('li');
    listItem.textContent = city;
    document.getElementById('history-list').appendChild(listItem);
}

function clearHistory() {
    document.getElementById('history-list').innerHTML = '';
}

function displayErrorMessage(message) {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    const weatherContainer = document.querySelector('.weather-container');
    weatherContainer.appendChild(errorMessage);
    setTimeout(function() {
        weatherContainer.removeChild(errorMessage);
    }, 3000);
}
