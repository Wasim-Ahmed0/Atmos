import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';
import clock from '../assets/clock.png';
import '../styles/hourly.css';
import 'swiper/css/bundle';

function Hourly(props) {

    return(
		<>
      		<div className="widget-container">
        		<div className="widget-header">
          			<img src={clock} className='clock' alt='clock' />
          			<h4 className="forecast-title">HOURLY FORECAST</h4>
        		</div>
        		<Swiper className='hourly-slider' slidesPerView={8} spaceBetween={0} modules={[Scrollbar]} scrollbar={{ hide: true, draggable: true }}>
          			{props.hourlyData.map((hour, index) => {
            			const isDay = hour.time >= props.sunriseTime && hour.time < props.sunsetTime;
						let conditionKey;
						let conditionText;
						
						// When the weather is clear, is it sunny during the day or is it clear at night. Timing is determined using the sunrise and sunset times
						if (hour.weatherID === 800) {
							conditionKey = isDay ? '800-day' : '800-night';
						} else {
							conditionKey = hour.weatherID.toString().startsWith('7') ? hour.weatherID.toString() : hour.weatherID.toString()[0]; // if code begins with 7 then keep entire code, else only get first digit
						}
						
						// If its day time then render the image like normal BUT if its night time then show the moon imagea
						if (isDay) {
							conditionText = props.atmosphereCodes[hour.weatherID.toString()] || props.weatherConditions[conditionKey];
						} else {
							conditionText = props.weatherConditions["800-night"];
						}

						// Use the appropriate weather icon for the current weather condition BUT default to the clouds image
            			let iconSrc = props.weatherIcons[conditionText] || props.weatherIcons["clouds"];

            			return (
              				<SwiperSlide key={index}>
                				<div className="hour-entry">
                  					<p className="hour">{hour.time}</p>
                  					<img src={iconSrc} className='weatherpic' alt='Weather Icon' />
                  					<p className="temperature">{Math.round(hour.temperature)}°</p>
                				</div>
              				</SwiperSlide>
            			);
          			})}
        		</Swiper>
      		</div>
    	</>
	);
};

export default Hourly;