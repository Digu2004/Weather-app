import React, { useState, useEffect } from 'react';

// Card component to show weather information for a given city
export default function Card({ city }) {
  // State to store coordinates of the city
  const [coords, setCoords] = useState(null);
  // State to store weather data
  const [weather, setWeather] = useState(null);
  // State to track loading status
  const [loading, setLoading] = useState(false);
  // State to store error messages
  const [error, setError] = useState('');

  // Whenever the 'city' prop changes, fetch its coordinates and weather
  useEffect(() => {
    if (!city) return; // Do nothing if city is empty

    // Fetch coordinates for the city
    const fetchCoordinates = async () => {
      setLoading(true); // Show loading
      setError(''); // Reset any previous error
      try {
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}`;
        const response = await fetch(url);
        const data = await response.json();

     if (data.results && data.results.length > 0) {
  // Define which types of places we consider valid (major cities, towns, villages)
  const validFeatureCodes = ["PPLC", "PPLA", "PPLA2", "PPL"]; 

  // Find the first result that matches a valid feature code
  const cityResult = data.results.find(r => validFeatureCodes.includes(r.feature_code));

  if (cityResult) {
    // If a valid city is found, extract its coordinates and info
    const { latitude, longitude, name, country } = cityResult;

    // Save the city details to state
    setCoords({ latitude, longitude, name, country });

    // Fetch weather data using the city's coordinates
    fetchWeather(latitude, longitude);
  } else {
    // If no valid city is found in the results
    setError("City not found"); // Show error message
    setCoords(null);            // Clear previous coordinates
    setWeather(null);           // Clear previous weather data
    setLoading(false);          // Stop loading spinner
  }
} else {
  // If API returned no results at all
  setError("City not found"); // Show error message
  setCoords(null);            // Clear previous coordinates
  setWeather(null);           // Clear previous weather data
  setLoading(false);          // Stop loading spinner
}

      } catch (err) {
        console.error(err);
        setError('Failed to fetch coordinates'); // Show error if API fails
        setLoading(false);
      }
    };

    // Fetch weather data for given coordinates
    const fetchWeather = async (latitude, longitude) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`;
        const response = await fetch(url);
        const data = await response.json();

        // Get current hour index to show current weather
        const now = new Date();
        const currentHourISO = now.toISOString().slice(0, 13) + ":00";
        const hourIndex = data.hourly.time.findIndex(t => t === currentHourISO);

        // Store weather info in state
        setWeather({
          currentTemperature: hourIndex !== -1 ? data.hourly.temperature_2m[hourIndex] : data.hourly.temperature_2m[0],
          humidity: hourIndex !== -1 ? data.hourly.relative_humidity_2m[hourIndex] : data.hourly.relative_humidity_2m[0],
          wind_speed: hourIndex !== -1 ? data.hourly.wind_speed_10m[hourIndex] : data.hourly.wind_speed_10m[0],
          temp_min: data.daily.temperature_2m_min[0],
          temp_max: data.daily.temperature_2m_max[0],
          sunrise: new Date(data.daily.sunrise[0]).toLocaleTimeString(),
          sunset: new Date(data.daily.sunset[0]).toLocaleTimeString(),
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch weather'); // Show error if weather API fails
      } finally {
        setLoading(false); // Stop loading once done
      }
    };

    fetchCoordinates(); // Start by fetching coordinates
  }, [city]);

  return (
    <div className="container my-5 mx-5">
      {/* Heading showing which city's weather is displayed */}
      <div><h3>Weather for {city || '...'}</h3></div>

      {/* Show loading message */}
      {loading && <p>Loading weather data...</p>}

      {/* Show error message if any */}
      {error && <p className="text-danger">{error}</p>}

      {/* If city exists but no data yet */}
      {!loading && !weather && !error && city && <p>No data available</p>}

      {/* Display weather cards if data is available */}
      {weather && (
        <div className="row row-cols-1 row-cols-md-3 mb-3 text-center mt-3">
          
          {/* Temperature card */}
          <div className="col mb-4">
            <div className="card h-100 rounded-3 shadow-sm">
              <div className="card-header py-3">
                <h4 className="my-0 fw-normal">Temperature</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">{weather.currentTemperature} °C</h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Current: {weather.currentTemperature} °C</li>
                  <li>Min: {weather.temp_min} °C</li>
                  <li>Max: {weather.temp_max} °C</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Humidity card */}
          <div className="col mb-4">
            <div className="card h-100 rounded-3 shadow-sm">
              <div className="card-header py-3">
                <h4 className="my-0 fw-normal">Humidity</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">{weather.humidity} %</h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Humidity: {weather.humidity} %</li>
                  <li>Wind: {weather.wind_speed} m/s</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Wind & Sun card */}
          <div className="col mb-4 ">
            <div className="card h-100 rounded-3 shadow-sm border-primary">
              <div className="card-header py-3 text-bg-primary border-primary">
                <h4 className="my-0 fw-normal">Wind & Sun</h4>
              </div>
              <div className="card-body">
                <h1 className="card-title pricing-card-title">{weather.wind_speed} m/s</h1>
                <ul className="list-unstyled mt-3 mb-4">
                  <li>Wind speed: {weather.wind_speed} m/s</li>
                  <li>Sunrise: {weather.sunrise}</li>
                  <li>Sunset: {weather.sunset}</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
