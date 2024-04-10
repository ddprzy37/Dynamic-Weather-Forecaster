const apiKey = '67678bdb629b68d36147f11bd4b6a739';

document.getElementById('search-btn').addEventListener('click', function() {
    const city = document.getElementById('city-input').value;
    getWeather(city);
});

document.getElementById('history-list').addEventListener('click', function(event) {
    const city = event.target.textContent;
    getWeather(city);
});

// Load search history from local storage when the page is loaded or refreshed
window.addEventListener('load', function() {
    const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
    history.forEach(function(city) {
        addToHistory(city);
    });
});

function getWeather(city) {
    // Clear previous forecast data
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = '';

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
                // Add city to local storage
            const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
            history.push(city);
            localStorage.setItem('searchHistory', JSON.stringify(history));
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

    let forecastCount = 0;
    const currentDate = new Date();
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(currentDate.getDate() + 5);

    // Track the dates we've already added to avoid duplicates
    const addedDates = new Set();

    forecastList.forEach(function(item) {
        const forecastDate = new Date(item.dt_txt.split(' ')[0]);
        if (forecastDate >= currentDate && forecastDate <= fiveDaysFromNow && !addedDates.has(forecastDate.toDateString())) {
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

            forecastCount++;
            addedDates.add(forecastDate.toDateString());
        }
    });
}








function addToHistory(city) {
    const historyList = document.getElementById('history-list');
    const historyItems = historyList.querySelectorAll('li');

    // Check if the city already exists in the search history
    let cityExists = false;
    historyItems.forEach(function(item) {
        if (item.textContent === city) {
            cityExists = true;
            return;
        }
    });

    if (!cityExists) {
        // If the city doesn't exist, add it to the search history
        const listItem = document.createElement('li');
        listItem.textContent = city;
        historyList.appendChild(listItem);

        // Add city to local storage
        const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
        history.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(history));
    }
}


function clearHistory() {
    document.getElementById('history-list').innerHTML = '';

    // Clear search history from local storage
    // localStorage.removeItem('searchHistory');


}
clearHistory();

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