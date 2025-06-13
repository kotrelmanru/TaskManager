// src/hooks/useTimezone.js
import { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { getCurrentTime } from '../utils/dateUtils';

const useTimezone = (initialTimezone = 'UTC') => {
  const [userTimezone, setUserTimezone] = useState(initialTimezone);
  const [currentTime, setCurrentTime] = useState(getCurrentTime(initialTimezone));
  
  // Update the current time periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime(userTimezone));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [userTimezone]);
  
  // Get current time formatted
  const getCurrentTimeFormatted = (format = 'YYYY-MM-DD HH:mm:ss') => {
    return currentTime.format(format);
  };
  
  // Convert a date to user's timezone
  const convertToUserTimezone =     (date) => {
    return moment(date).tz(userTimezone);
  };
  
  return {
    userTimezone,
    setUserTimezone,
    currentTime,
    getCurrentTimeFormatted,
    convertToUserTimezone
  };
};

export default useTimezone;