// src/components/TaskModal/TimezoneConflictAlert.jsx
import React from 'react';
import moment from 'moment-timezone';
import { FiAlertTriangle } from 'react-icons/fi';

const TimezoneConflictAlert = ({ 
  showTimezoneAlert, 
  closeTimezoneAlert, 
  timezoneConflicts, 
  suggestedTimes, 
  selectSuggestedTime 
}) => {
  if (!showTimezoneAlert) {
    return null;
  }
  
  return (
    <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50 bg-black bg-opacity-50">
      <div className="pointer-events-auto bg-gray-900 border border-red-500 rounded-lg p-4 w-full max-w-md mx-4 shadow-lg shadow-red-500/20">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl text-red-400 font-bold flex items-center">
            <FiAlertTriangle className="mr-2" /> Outside Working Hours
          </h2>
          <button onClick={closeTimezoneAlert} className="text-red-400 hover:text-white text-2xl">
            &times;
          </button>
        </div>
        
        <div className="mb-4">
          <p className="text-white mb-2">
            The task time falls outside working hours (08:00-17:00) for:
          </p>
          
          <div className="bg-gray-800 rounded-lg p-3 mb-3 max-h-40 overflow-y-auto">
            {timezoneConflicts.map((conflict, index) => (
              <div key={index} className="mb-2 pb-2 border-b border-gray-700 last:border-0">
                <p className="text-white text-sm font-medium">{conflict.user}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Timezone: {conflict.tz}</span>
                  <span className="text-red-400">
                    {conflict.start} - {conflict.end}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {suggestedTimes && suggestedTimes.length > 0 && (
            <>
              <p className="text-green-300 text-sm mb-2">Suggested times (within working hours):</p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {suggestedTimes.slice(0, 4).map((time, index) => (
                  <button
                    key={index}
                    onClick={() => selectSuggestedTime(time.start, time.end)}
                    className="bg-cyan-800 hover:bg-cyan-700 text-white rounded-lg p-2 text-xs transition"
                  >
                    {moment(time.start).format('MMM D, HH:mm')} - {moment(time.end).format('HH:mm')}
                  </button>
                ))}
              </div>
            </>
          )}
          
          <div className="text-gray-300 text-xs bg-gray-800/50 p-2 rounded">
            <p>Tasks must be scheduled between 08:00-17:00 in each participant's local timezone.</p>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={closeTimezoneAlert} 
            className="px-4 py-2 border border-red-600 text-red-400 rounded hover:bg-red-900/30 transition text-sm"
          >
            Adjust Time
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimezoneConflictAlert;