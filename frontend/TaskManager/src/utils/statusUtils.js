// src/utils/statusUtils.js
import React from 'react';
import moment from 'moment-timezone';
import { FiClock, FiAlertTriangle } from 'react-icons/fi';

// Get task status based on time
export const getStatus = (task, timezone) => {
  const now = moment().tz(timezone);
  const start = moment(task.start).tz(timezone);
  const end = moment(task.end).tz(timezone);
  
  if (end.isBefore(now)) return 'EXPIRED';
  if (start.isBefore(now) && end.isAfter(now)) return 'ONGOING';
  if (start.diff(now, 'minutes') <= 60 && start.isAfter(now)) return 'SOON';
  return 'UPCOMING';
};

// Status styles for different task statuses
export const statusStyles = {
  UPCOMING: {
    bg: 'bg-gray-800',
    border: 'border-cyan-500',
    text: 'text-cyan-400',
    // icon: <FiClock className="text-cyan-400" />,
    statusText: 'text-cyan-400',
    shadow: 'shadow-lg shadow-cyan-500/20'
  },
  SOON: {
    bg: 'bg-amber-900/30',
    border: 'border-amber-500',
    text: 'text-amber-400',
    // icon: <FiAlertTriangle className="text-amber-400" />,
    statusText: 'text-amber-400',
    shadow: 'shadow-lg shadow-amber-500/20'
  },
  ONGOING: {
    bg: 'bg-green-900/30',
    border: 'border-green-500',
    text: 'text-green-400',
    // icon: <FiClock className="text-green-400" />,
    statusText: 'text-green-400',
    shadow: 'shadow-lg shadow-green-500/20'
  },
  EXPIRED: {
    bg: 'bg-gray-900/50',
    border: 'border-gray-600',
    text: 'text-gray-500',
    // icon: <FiClock className="text-gray-500" />,
    statusText: 'text-gray-500 line-through',
    shadow: 'shadow-md shadow-gray-500/10',
    cardOpacity: 'opacity-80'
  }
};