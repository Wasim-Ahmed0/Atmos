import React, { useContext } from 'react';
import Switch from 'react-switch';
import { ThemeContext } from './App.jsx';
import '../styles/banner.css';

function Banner() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    // Switch for Dark / Light theme is built upon the react-switch library
    return(
        <>
            <div className="banner" style={{background: theme === 'light' ? '#1e667a' : '#2B244D'}}>
                <div className="title">
                    <p>ATMOS</p>
                </div>
                
                <div className="toggle">
                    <Switch className="react-switch" onChange={toggleTheme} checked={theme === 'dark'} uncheckedIcon={false} checkedIcon={false} onColor='#ea2c79' offColor='#7096b8' />
                </div>
            </div>
        </>
    );
}

export default Banner;