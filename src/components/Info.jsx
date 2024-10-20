import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from './App.jsx';
import { IoIosArrowUp } from "react-icons/io";
import { fetchCoordinatesForCity, fetchWeatherForCoordinates } from './weatherService.js';
import SunriseSunset from './SunriseSunset.jsx';
import Hourly from './Hourly.jsx';
import Daily from './Daily.jsx';
import Visibility from './Visibility.jsx';
import PHWWidget from './PHWWidget.jsx';
import sunriseImg from '../assets/sunrise.png';
import sunsetImg from '../assets/sunset.png';
import '../styles/info.css';


function Info(props) {
    const { theme } = useContext(ThemeContext);
    const [sunrise, setSunrise] = useState(''); // To track sunrise time from api
    const [sunset, setSunset] = useState(''); // To track sunset time from api
    const [hourlyForecast, setHourlyForecast] = useState([]); // To track the hourly forecasts array of data from api
    const [dailyForecast, setDailyForecast] = useState([]); // To track the daily forecasts array of data from api
    const [visibility, setVisibility] = useState(0); // To track visibility distance from api
    const [chanceOfPOP, setPOP] = useState(0); // To track chance of Precipitation from api
    const [humidityLevel, setHumidity] = useState(0); // To track humidity lvl from api
    const [windSpeed, setWindSpeed] = useState(0); // To track wind speed from api

    // Only get cityname if there is at least 1 city added to the view (card array of cities) AND it has to be of the active index card i.e the card currently in view
    const cityName = props.cardsData.length > 0 && props.cardsData[props.activeIndex] ? props.cardsData[props.activeIndex].city.trim().toLowerCase() : null;

    // each time city name changes (new card / city in view) then update all the widget info on this page
    useEffect(() => {
        const fetchCoordinates = async () => {
            if (!cityName) return;

            try {
                const { lat, lon } = await fetchCoordinatesForCity(cityName); // Calls function from weatherService.js
                const weatherData = await fetchWeatherForCoordinates(lat, lon); // Calls function from weatherService.js



                const sunriseTime = props.timeConversion(weatherData.current.sunrise, weatherData.timezone_offset, true); // Calls convertUnixTimeToLocalTime in App.jsx
                const sunsetTime = props.timeConversion(weatherData.current.sunset, weatherData.timezone_offset, true); // Calls convertUnixTimeToLocalTime in App.jsx

                
                const hourlyData = weatherData.hourly.map(hour => ({
                    time: props.timeConversion(hour.dt, weatherData.timezone_offset, false), // Calls convertUnixTimeToLocalTime in App.jsx
                    temperature: hour.temp,
                    weatherID: hour.weather[0].id
                }));

                const dailyData = weatherData.daily.map(day => {
                    const dayOfWeek = new Date(day.dt * 1000).toLocaleDateString('en-GB', { weekday: 'short' }); 
                    return {
                        day: dayOfWeek,
                        minTemp: day.temp.min,
                        maxTemp: day.temp.max,
                        weatherID: day.weather[0].id
                    };
                });
                
                // Manually update the first day's name in the array, to show today instead of the day's name
                dailyData[0].day = "Today";

                const currentDayWindSpeed = Math.round(weatherData.daily[0].wind_speed);
                const currentDayHumidity = weatherData.daily[0].humidity;
                const currentDayPop = weatherData.daily[0].pop * 100;
                const visiMetres = weatherData.current.visibility;
                const visibilityData = visiMetres / 1000;
                
                // Update useState variables
                setWindSpeed(currentDayWindSpeed);
                setHumidity(currentDayHumidity);
                setPOP(currentDayPop);
                setVisibility(visibilityData);
                setDailyForecast(dailyData);
                setHourlyForecast(hourlyData);
                setSunrise(sunriseTime);
                setSunset(sunsetTime);
                
            } catch (error) {
                console.error("Failed to fetch coordinateas: ", error);
            }
        };

        fetchCoordinates();
    }, [cityName]);

    // Only need 24 hours for hourlyForecasts and only need 8 days for dailyForecasts
    const hourlyForecastsForWidget = hourlyForecast.slice(0, 24);
    const dailyForecastsForWidget = dailyForecast.slice(0, 8);

    // Render the widgets whilst also passing in the appropriate variables and the dictionaries for the weather codes and weather images that are defined in App.jsx
    return(
        <>
            <IoIosArrowUp className="arrow-up" style={{color: theme === 'light' ? 'white' : 'black'}}/>
            <SunriseSunset sunriseIcon={sunriseImg} sunsetIcon={sunsetImg} sunriseTime={sunrise} sunsetTime={sunset}/>
            <Hourly hourlyData={hourlyForecastsForWidget} weatherIcons={props.weatherIcons} weatherConditions={props.weatherConditions} atmosphereCodes={props.atmosphereCodes} sunriseTime={sunrise} sunsetTime={sunset} />
            <Daily dailyData={dailyForecastsForWidget} weatherIcons={props.weatherIcons} weatherConditions={props.weatherConditions} atmosphereCodes={props.atmosphereCodes} />
            <Visibility visibility={visibility}/>
            <PHWWidget precip={chanceOfPOP} humidlvl={humidityLevel} windSpeed={windSpeed}/>
        </>
    );
}

export default Info;