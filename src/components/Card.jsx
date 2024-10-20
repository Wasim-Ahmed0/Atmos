import PropTypes from "prop-types";
import '../styles/card.css';

function Card({ city, weatherIconSrc, temp, condition, feelTemp }) {

    return(
        <>
            <div className="card-container">
                <div className="cityName">
                    <p>{city}</p>
                </div>
                <div className="imgCondition">
                    <img src={weatherIconSrc} alt="Weather Condition Icon"/>
                </div>
                <div className="tempCondition">
                    <p id="temp">{temp}°</p>
                    <p id="cond">{condition}</p>
                </div>
                <div className="feelsLike">
                    <p>FEELS LIKE {feelTemp}°</p>
                </div>
            </div>
        </>
    );

}

Card.propTypes = {
    city: PropTypes.string,
    weatherIconSrc: PropTypes.string,
    temp: PropTypes.number,
    condition: PropTypes.string,
    feelTemp: PropTypes.number,
};


export default Card;