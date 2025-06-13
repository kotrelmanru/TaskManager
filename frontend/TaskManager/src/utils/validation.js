// src/utils/validation.js
import moment from 'moment-timezone';

// Validate business hours (8:00 AM - 5:00 PM)
export const validateBusinessHours = (start, end, timezone = 'UTC') => {
  const mStart = moment(start).tz(timezone);
  const startHour = mStart.hour();
  const startMinute = mStart.minute();

  // Check start: min 08:00, max exactly 17:00:00
  const isStartValid =
    startHour > 8 && startHour < 17      // 9-16 hours
    || (startHour === 8 && startMinute >= 0)  // starting from 08:00
    || (startHour === 17 && startMinute === 0); // exactly 17:00

  return isStartValid;
};

// Validate business hours for all participants
export const validateBusinessHoursForAll = (start, end, participants, availableUsers, userTimezone) => {
  // First check for the creator (current user)
  const creatorValid = validateBusinessHours(start, end, userTimezone);
  
  if (!creatorValid) {
    return {
      valid: false,
      conflicts: [{ 
        user: 'You (Creator)', 
        tz: userTimezone,
        start: moment(start).tz(userTimezone).format('HH:mm'),
        end: moment(end).tz(userTimezone).format('HH:mm')
      }]
    };
  }
  
  // Check for all participants
  const conflicts = [];
  
  if (participants && participants.length > 0) {
    participants.forEach(username => {
      const user = availableUsers.find(u => u.username === username);
      if (user && user.preferred_timezone) {
        const tz = user.preferred_timezone;
        const isValid = validateBusinessHours(start, end, tz);
        
        if (!isValid) {
          conflicts.push({
            user: user.name || user.username,
            tz: tz,
            start: moment(start).tz(tz).format('HH:mm'),
            end: moment(end).tz(tz).format('HH:mm')
          });
        }
      }
    });
  }
  
  return {
    valid: conflicts.length === 0,
    conflicts: conflicts
  };
};

// Validate basic task form data
export const validateTaskForm = (formData) => {
  const errors = {};
  
  if (!formData.title) {
    errors.title = 'Title is required';
  }
  
  if (!formData.start) {
    errors.start = 'Start time is required';
  }
  
  if (!formData.end) {
    errors.end = 'End time is required';
  }
  
  if (formData.start && formData.end) {
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);
    
    if (endDate <= startDate) {
      errors.end = 'End time must be after start time';
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};