import PropTypes from "prop-types";
import '../styles/sunrise-sunset.css';

function SunriseSunset({sunriseIcon, sunsetIcon, sunriseTime, sunsetTime}) {
    return(
        <>
           <div className="sun-container">
                <div className="sunrise">
                    <img className="comp-img" src={sunriseIcon} alt="Sunrise"/>
                    <div className="sunrise-time">
                        <p className="sun-header">SUNRISE</p>
                        <p>{sunriseTime}</p>
                    </div>
                </div>
                <div className="sunset">
                    <div className="sunset-time">
                        <p className="sun-header">SUNSET</p>
                        <p>{sunsetTime}</p>
                    </div>
                    <img className='comp-img' src={sunsetIcon} alt="Sunset"/>
                </div>
            </div> 
        </>
    );
}

SunriseSunset.propTypes = {
    sunriseIcon: PropTypes.string,
    sunsetIcon: PropTypes.string,
    sunriseTime: PropTypes.string,
    sunsetTime: PropTypes.string,
}

export default SunriseSunset;