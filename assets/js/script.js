const apiKey = '67678bdb629b68d36147f11bd4b6a739';

document.getElementById('search-btn').addEventListener('click', () => {
    const city = document.getElementById('city-input').value;
    getWeather(city);
});

function getWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('city-name').textContent = data.name;
            document.getElementById('temperature').textContent = `${Math.round(data.main.temp - 273.15)}°C`;
            document.getElementById('description').textContent = data.weather[0].description;
        })
        .catch(error => console.log('Error fetching weather:', error));
}
