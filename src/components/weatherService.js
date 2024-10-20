const API_KEY = 'c989b743d32fb1ad7b24437ad6dc56b3';
const BASE_URL = "https://api.openweathermap.org/data/3.0/onecall";

// given a city name, it will return the lat and lon coordinates
async function fetchCoordinatesForCity(city) {
  const response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
    if (!response.ok) {
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      throw new Error('No location found');
    }
  
  return {
    lat: data[0].lat,
    lon: data[0].lon,
  };
}

// given the lat and lon coordinates, it will return the weather data response from api
async function fetchWeatherForCoordinates(lat, lon) {
  const response = await fetch(`${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
  if (!response.ok) {
    throw new Error(`Weather data fetch failed: ${response.statusText}`);
  }
  
  return await response.json();
}
  
export { fetchCoordinatesForCity, fetchWeatherForCoordinates };