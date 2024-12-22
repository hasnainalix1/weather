document.getElementById('toggle-btn').addEventListener('click', function () {
    document.body.classList.toggle('dark-mode');
    const currentMode = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
    document.getElementById('toggle-btn').textContent = currentMode;
});

function getweather() {
    let city = document.getElementById('city').value;
    let APIKey = '28742e6ee8ba827cd53e474bd8196316';
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${APIKey}&units=metric`;

    fetch(url)
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                return Promise.reject(`City not found or API error. Status code: ${response.status}`);
            }
        })
        .then(function (data) {
            let weatherinfo = document.getElementById('weather-info');

            let emoji = getWeatherEmoji(data.weather[0].main);

            let weatherHTML = `
                <h2>Weather in ${data.name}</h2>
                <div class="current-weather">
                    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].main}">
                    <p>${data.main.temp}°C ${emoji}</p>
                    <p>${data.weather[0].description}</p>
                    <p>Humidity: ${data.main.humidity}%</p>
                    <p>Wind Speed: ${data.wind.speed} m/s</p>
                </div>
            `;

            weatherinfo.innerHTML = weatherHTML;

            saveCity(city);
        })
        .catch(function (error) {
            let weatherinfo = document.getElementById('weather-info');
            weatherinfo.innerHTML = `<p>${error}</p>`;
        });
}

function getWeatherEmoji(weatherType) {
    switch (weatherType) {
        case 'Clear': return '☀️';
        case 'Clouds': return '☁️';
        case 'Rain': return '🌧️';
        case 'Snow': return '❄️';
        case 'Thunderstorm': return '⚡';
        default: return '🌥️';
    }
}

function saveCity(city) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(city)) {
        favorites.push(city);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesList();
    }
}

function updateFavoritesList() {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    let favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';
    favorites.forEach(function(city) {
        let li = document.createElement('li');
        li.textContent = city;
        li.onclick = function() {
            document.getElementById('city').value = city;
            getweather();
        };
        favoritesList.appendChild(li);
    });
}

window.onload = function() {
    updateFavoritesList();
};
