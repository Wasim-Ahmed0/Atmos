import React, { useContext, useState } from 'react';
import { ThemeContext } from './App.jsx';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { IoIosArrowDown, IoIosSearch } from "react-icons/io";
import { fetchCoordinatesForCity, fetchWeatherForCoordinates } from './weatherService.js';
import Banner from './Banner.jsx';
import Card from './Card.jsx';
import AddCard from './AddCard.jsx';
import 'swiper/css/bundle';
import '../styles/home.css';


function Home(props) {
    const { theme } = useContext(ThemeContext);
    const [showAddCityForm, setShowAddCityForm] = useState(false); // Tracks whether to show pop up form
    const [cityInput, setCityInput] = useState(''); // Tracks the input from adding a city

    // Based on themecontext, adjust the class name for the swiper used below
    const swiperClass = theme === 'light' ? 'swiper-light' : 'swiper-dark'; 
    
    const handleOpenAddCityForm = () => {
        setShowAddCityForm(true);
    };

    const handleCloseAddCityForm = () => {
        setShowAddCityForm(false);
    };

    const handleCityInputChange = (event) => {
        setCityInput(event.target.value);
    };

    // Creating a new card and adding it to the view (Card Carousel)
    const addCard = (newCity, conditionCode, newTemp, newFeelTemp, sunrise, sunset) => {
        const currentTimeInSeconds = new Date().getTime() / 1000;
        const isDay = currentTimeInSeconds >= sunrise && currentTimeInSeconds < sunset;
        let conditionKey;

        // When the weather is clear, is it sunny during the day or is it clear at night. Timing is determined using the sunrise and sunset times
        if (conditionCode === 800) {
            conditionKey = isDay ? '800-day' : '800-night';
        } else {
            conditionKey = conditionCode.toString().startsWith('7') ? conditionCode.toString() : conditionCode.toString()[0]; // if code begins with 7 then keep the entire code, else only get the first digit
        }

        let conditionText = props.atmosphereCodes[conditionCode.toString()] || props.weatherConditions[conditionKey]; // If atmosphere code then render accordingly, else render the correct pic
        
        const newCard = {
            city: newCity,
            weatherIconSrc: props.weatherIcons[conditionText] || props.weatherIcons["clouds"],
            temp: Math.round(newTemp),
            condition: conditionText,
            feelTemp: Math.round(newFeelTemp), 
        };

        props.setCardsData(currentCardsData => [...currentCardsData, newCard]);
        props.setHasCities(true);
    };

    // Calls functions from weatherService.js using city name as argument - then adds card
    const handleAddCityFormSubmit = async (event) => {
        event.preventDefault();
        const city = cityInput.trim();
        if (!city) return;

        try {
            const { lat, lon } = await fetchCoordinatesForCity(city);
            const data = await fetchWeatherForCoordinates(lat, lon);
            addCard(city, data.current.weather[0].id, data.current.temp, data.current.feels_like, data.current.sunrise, data.current.sunset);
        } catch (error) {
            alert("Failed to fetch weather data for the city");
        }

        setCityInput('');
        setShowAddCityForm(false);
    };


    // Initialize a timer ID for managing the long press
    let longPressTimerId;

    const handleLongPressStart = (index) => {
        // Start a timer of 2 seconds
        longPressTimerId = setTimeout(() => {
            const confirmDelete = window.confirm("Do you want to delete this card?");
            if (confirmDelete) {
                const newCardsData = props.cardsData.filter((_, cardIndex) => cardIndex !== index);
                props.setCardsData(newCardsData);
                props.setHasCities(newCardsData.length > 0);
            }
        }, 2000); // 2 seconds
    };

    const handleLongPressCancel = () => {
        // Clear the timer if the touch ends before 2 seconds
        clearTimeout(longPressTimerId);
    };


    // On change of card, update the activeIndex variable with the index of the active card
    const handleChange = (swiper) => {props.setActiveIndex(swiper.activeIndex)};
    
    // Renders the Card Carousel by iterating arr of added cities / cards. Only render the pop up form when the condition to render it is true
    return (
        <>
            <Banner />
            <Swiper className={swiperClass} onSlideChange={handleChange} slidesPerView='1.5' spaceBetween={4} centeredSlides={true} pagination={{clickable: false, dynamicBullets: true,}} modules={[Pagination]} >
                {props.cardsData.map((card, index) => (
                    <SwiperSlide key={index} onTouchStart={() => handleLongPressStart(index)} onTouchEnd={handleLongPressCancel}>
                        <Card city={card.city.toUpperCase()} weatherIconSrc={card.weatherIconSrc} temp={card.temp} condition={card.condition.toUpperCase()} feelTemp={card.feelTemp} />
                    </SwiperSlide>
                ))} 

                <SwiperSlide>
                    <AddCard onAddClick={handleOpenAddCityForm}/>
                </SwiperSlide>
            </Swiper>

            {showAddCityForm && (
                <div className="backdrop" onClick={handleCloseAddCityForm}>
                    <div className="add-city-form" onClick={(e) => e.stopPropagation()} style={{background: theme === 'light' ? '#1e667a' : '#2B244D'}}>
                        <form onSubmit={handleAddCityFormSubmit}>
                            <input className='city-search' type="text" placeholder="Enter city name" value={cityInput} onChange={handleCityInputChange} autoFocus/>
                            <button className="search-btn-container" type="submit">
                                <IoIosSearch className='search-btn'/>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <IoIosArrowDown className='arrow-down' style={{color: theme === 'light' ? 'white' : 'black'}} />
        </>
    );

}

export default Home;



    