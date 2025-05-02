const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = 5000;
const API_KEY = '16c3aa3900365e00df9bd4d3648fc9d0'; // OpenWeatherMap API Key

app.use(cors());

app.get('/', (req, res) => {
  res.send('🎧 Welcome to TuneCast Backend API!');
});

app.get('/api/weather', async (req, res) => {
  const city = req.query.city;
  if (!city) return res.status(400).json({ error: 'City is required' });

  try {
    const weatherRes = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const weather = weatherRes.data;
    const main = weather.weather[0].main.toLowerCase();
    const description = weather.weather[0].description;
    const icon = weather.weather[0].icon;
    const temperature = weather.main.temp;
    const humidity = weather.main.humidity;
    const windSpeed = weather.wind.speed;

    // Song suggestions based on weather
    const songMap = {
      clear: ["Here Comes the Sun", "Walking on Sunshine", "Good Day Sunshine"],
      clouds: ["Cloudy Day", "Mr. Blue Sky", "Both Sides Now"],
      rain: ["Set Fire to the Rain", "Umbrella", "Rain On Me"],
      snow: ["Let It Snow", "Snow (Hey Oh)", "Cold as Ice"],
      thunderstorm: ["Thunder", "Stormy Weather", "Electric Feel"],
      default: ["Weather With You", "Seasons in the Sun"]
    };

    const songs = songMap[main] || songMap.default;

    res.json({
      city: weather.name,
      temperature,
      description,
      humidity,
      windSpeed,
      icon,
      songs
    });
  } catch (err) {
    console.error('❌ Error:', err.message || err);
    res.status(500).json({ error: 'Failed to fetch weather or music data' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TuneCast Backend running on http://localhost:${PORT}`);
});
