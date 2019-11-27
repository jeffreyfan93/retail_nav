import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const navigation = require('./json/navigation.json');
  const [currCity, updateCurrCity] = useState(navigation.cities[0].section);
  const [currTime, updateCurrTime] = useState();
  const timeZone = {
    'cupertino': -8,
    'new-york-city': -5,
    'london': 0,
    'amsterdam': +1,
    'tokyo': +9,
    'hong-kong': +8,
    'sydney': +11
  };

  useEffect(() => {
    // resize the slider to update position and size to match the text.
    const currDiv = document.getElementById(currCity);
    const sliderUnderline = document.getElementById('slider-underline');
    sliderUnderline.style.left = `${currDiv.offsetLeft}px`;
    sliderUnderline.style.width = `${currDiv.offsetWidth}px`;
  }, [currCity, window.innerWidth]);
  
  useEffect(() => {
    getTime();
    const startTimer = setInterval(() => {
      getTime();
    }, 1000)
    return () => {clearInterval(startTimer)}
  }, [currCity]);

  const getTime = () => {
    const time = new Date();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const second = time.getSeconds();
    const adjustedHour = getCorrectTimeZone(hour);
    const formattedTime = formatTime(adjustedHour, minute, second);

    updateCurrTime(formattedTime);
  };

  const getCorrectTimeZone = (hour) => {
    switch (currCity) {
      case 'cupertino':
        return hour;
      case 'new-york-city':
      case 'london':
      case 'amsterdam':
      case 'tokyo':
      case 'hong-kong':
      case 'sydney':
          return (hour - timeZone['cupertino'] + timeZone[currCity]) % 24;
      default:
        return null;
    }
  };

  const formatTime = (hour, minute, second) => {
    let suffix = 'AM';
    if (hour > 11) {
      suffix = 'PM';
    }
    if (hour > 12) {
      hour -= 12;
    } else if (hour === 0) {
      hour = 12;
    }
    if (minute < 10) {
      minute = `0${minute}`;
    }
    if (second < 10) {
      second = `0${second}`;
    }

    return `${hour}:${minute}:${second} ${suffix}`
  };

  const renderCities = (cities) => {
    let citiesList = [];

    cities.forEach((city, cityKey) => {
      citiesList.push(
        <button
          id={city.section}
          className={currCity === city.section ? 'current-city' : null}
          onClick={handleClick}
          key={cityKey}
        >
          {city.label}
        </button>
      )
    });

    return citiesList;
  };

  const handleClick = (e) => {
    const city = e.currentTarget.id;
    updateCurrCity(city);
  };

  return (
    <div>
      <div className='cities-list'>
        {
          navigation &&
          navigation.cities &&
          renderCities(navigation.cities)
        }
      </div>
      <div className='slider'>
        <div id='slider-underline'/>
      </div>
      <div className='time-display'>
        {currTime}
      </div>
    </div>
  );
}

export default App;
