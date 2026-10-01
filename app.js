const weatherCard = document.getElementById('weatherCard');
const weatherLocation = document.getElementById('weatherLocation');
const weatherIcon = document.getElementById('weatherIcon');
const weatherTemp = document.getElementById('weatherTemp');
const weatherCondition = document.getElementById('weatherCondition');
const weatherStatus = document.getElementById('weatherStatus');

const weatherCodeMap = {
  0: { icon: '☀️', label: 'Clear sky' },
  1: { icon: '🌤️', label: 'Mainly clear' },
  2: { icon: '⛅', label: 'Partly cloudy' },
  3: { icon: '☁️', label: 'Cloudy' },
  45: { icon: '🌫️', label: 'Foggy' },
  48: { icon: '🌫️', label: 'Depositing rime fog' },
  51: { icon: '🌦️', label: 'Light drizzle' },
  53: { icon: '🌦️', label: 'Drizzle' },
  55: { icon: '🌧️', label: 'Dense drizzle' },
  56: { icon: '🌧️', label: 'Freezing drizzle' },
  57: { icon: '🌧️', label: 'Heavy freezing drizzle' },
  61: { icon: '🌦️', label: 'Light rain' },
  63: { icon: '🌧️', label: 'Rain' },
  65: { icon: '🌧️', label: 'Heavy rain' },
  66: { icon: '🌧️', label: 'Freezing rain' },
  67: { icon: '🌧️', label: 'Heavy freezing rain' },
  71: { icon: '🌨️', label: 'Light snow' },
  73: { icon: '❄️', label: 'Snow' },
  75: { icon: '❄️', label: 'Heavy snow' },
  77: { icon: '❄️', label: 'Snow grains' },
  80: { icon: '🌦️', label: 'Rain showers' },
  81: { icon: '🌧️', label: 'Heavy rain showers' },
  82: { icon: '⛈️', label: 'Violent rain showers' },
  85: { icon: '🌨️', label: 'Snow showers' },
  86: { icon: '❄️', label: 'Heavy snow showers' },
  95: { icon: '⛈️', label: 'Thunderstorm' },
  96: { icon: '⛈️', label: 'Thunderstorm with hail' },
  99: { icon: '⛈️', label: 'Severe thunderstorm' }
};

function updateWeatherCard(statusText, tempText, labelText, iconText, locationText) {
  weatherStatus.textContent = statusText;
  weatherTemp.textContent = tempText;
  weatherCondition.textContent = labelText;
  weatherIcon.textContent = iconText;
  weatherLocation.textContent = locationText;
}

function handleWeatherResponse(data) {
  const current = data.current;
  const weatherCode = current?.weather_code ?? 0;
  const weather = weatherCodeMap[weatherCode] || { icon: '🌤️', label: 'Current conditions' };
  const temperature = Math.round(Number(current?.temperature_2m ?? 0));

  updateWeatherCard(
    'Updated just now',
    `${temperature}°F`,
    weather.label,
    weather.icon,
    'Your location'
  );

  weatherCard.classList.remove('is-loading');
  weatherCard.classList.remove('is-error');
}

function showWeatherError(message) {
  weatherCard.classList.remove('is-loading');
  weatherCard.classList.add('is-error');
  weatherLocation.textContent = 'Location unavailable';
  weatherIcon.textContent = '📍';
  weatherTemp.textContent = '--°F';
  weatherCondition.textContent = 'Weather unavailable';
  weatherStatus.textContent = message;
}

function fetchWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=auto`;

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Weather request failed.');
      }
      return response.json();
    })
    .then(handleWeatherResponse)
    .catch(() => showWeatherError('Unable to load local weather.'));
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      fetchWeather(position.coords.latitude, position.coords.longitude);
    },
    () => {
      showWeatherError('Enable location to see your weather.');
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
} else {
  showWeatherError('Browser location is unavailable.');
}