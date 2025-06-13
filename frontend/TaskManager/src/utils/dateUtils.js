// src/utils/dateUtils.js
import moment from 'moment-timezone';

// Format date with timezone
export const formatDate = (dateStr, tz) => {
  return moment(dateStr).tz(tz).format('YYYY-MM-DD HH:mm:ss');
};

// Format date with timezone displayed
export const formatDateWithTz = (dateStr, tz) => {
  return `${moment(dateStr).tz(tz).format('YYYY-MM-DD HH:mm:ss')} (${tz})`;
};

// Group tasks by month
export const groupTasksByMonth = (tasks, timezone) => {
  const grouped = {};
  
  if (!tasks || !Array.isArray(tasks)) {
    return grouped;
  }
  
  tasks.forEach(appt => {
    const monthKey = moment(appt.start).tz(timezone).format('MMMM YYYY');
    if (!grouped[monthKey]) {
      grouped[monthKey] = [];
    }
    grouped[monthKey].push(appt);
  });
  
  Object.keys(grouped).forEach(month => {
    grouped[month].sort((a, b) => new Date(a.start) - new Date(b.start));
  });
  
  return grouped;
};

// Get current time in user's timezone
export const getCurrentTime = (timezone) => {
  return moment().tz(timezone || moment.tz.guess());
};

// Get user's browser timezone
export const getBrowserTimezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
};

// Format datetime for datetime-local input
export const formatForDateTimeInput = (dateStr, timezone) => {
  return moment(dateStr).tz(timezone).format('YYYY-MM-DDTHH:mm');
};