import React from 'react';
import visibilityIcon from '../assets/view.jpg';
import '../styles/visibility.css';


function Visibility({ visibility }) {
    return (
        <div className="visibility-container">
            <div className="visibility-box">
                <img src={visibilityIcon} alt="visibility-icon" className="visibility-icon" />
                <h4 className='visibility-title'>VISIBILITY</h4>
            </div>
            <div className="value-container">
                <p>{visibility} KM</p>
            </div>
        </div>
    );
  }

export default Visibility