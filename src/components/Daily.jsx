import calendar from '../assets/calendar.png';
import Sunny from '../assets/sunny.png';
import '../styles/daily.css';

function Daily(props) {

    return(
        <>
            <div className="daily-container">
                <div className="daily-header">
                    <img src={calendar} alt="calendar-icon" />
                    <h4 className='header-title'>DAILY FORECAST</h4>
                </div>
                {props.dailyData.map((day, index) => {
                    let conditionKey;

                    // If its clear then set the key to look up against the dictionary = 800-day
                    if (day.weatherID === 800) {
                        conditionKey = "800-day";
                    } else {
                        conditionKey = day.weatherID.toString().startsWith('7') ? day.weatherID.toString() : day.weatherID.toString()[0]; // if code begins with 7 then keep entire code, else only get first digit
                    }
                    
                    // If atmospher weather id then get the text for that, but if its not then get the appropriate condition text from the dictionary defined in App.jsx
                    let conditionText = props.atmosphereCodes[day.weatherID.toString()] || props.weatherConditions[conditionKey];
                    let iconSrc = props.weatherIcons[conditionText];

                    return (
                        <div key={index} className="day-entry">
                            <div className="day">
                                <p className="day-txt">{day.day}</p>
                            </div>
                            <div className="img-condition">
                                <img src={iconSrc} alt="weather-icon" className="weather-icon" />
                                <p className="condition-txt">{conditionText}</p>
                            </div>
                            <div className="temps">
                                <div className="lo-temps">
                                    <p>LO: {Math.round(day.minTemp)}°</p>
                                </div>
                                <div className="hi-temps">
                                    <p>HI: {Math.round(day.maxTemp)}°</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default Daily;