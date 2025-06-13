// src/components/Header/ProfileDropdown.jsx
import React from 'react';
import { FiUser, FiClock } from 'react-icons/fi';

const ProfileDropdown = ({ 
  profileDropdownOpen, 
  profileLoading, 
  profileData, 
  currentTime, 
  fetchProfileData, 
  logout 
}) => {
  if (!profileDropdownOpen) {
    return null;
  }
  
  return (
    <div className="absolute right-0 top-10 w-56 bg-gray-900 border border-cyan-600 rounded-lg shadow-lg shadow-cyan-500/20 z-20">
      {profileLoading ? (
        <div className="flex justify-center p-4">
          <FiClock className="animate-spin w-6 h-6 text-cyan-500" />
        </div>
      ) : profileData ? (
        <div className="p-3">
          <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-gray-700">
            <div className="w-9 h-9 rounded-full bg-cyan-800 flex items-center justify-center">
              <FiUser className="w-5 h-5 text-cyan-200" />
            </div>
            <div>
              <p className="text-cyan-300 font-medium">{profileData.name}</p>
              <p className="text-xs text-gray-400">@{profileData.username}</p>
            </div>
          </div>
          
          <div className="mb-3 text-xs">
            <p className="flex justify-between mb-1">
              <span className="text-gray-400">Timezone:</span> 
              <span className="text-cyan-300">{profileData.preferred_timezone || 'UTC'}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-400">Current time:</span> 
              <span className="text-cyan-300">{currentTime.format('HH:mm:ss')}</span>
            </p>
          </div>
          
          <button 
            onClick={logout} 
            className="w-full mt-2 text-left py-2 px-3 text-red-400 hover:bg-gray-800 rounded-md transition flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      ) : (
        <div className="p-3 text-center">
          <button onClick={fetchProfileData} className="text-cyan-400 hover:text-cyan-300">
            Load Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;