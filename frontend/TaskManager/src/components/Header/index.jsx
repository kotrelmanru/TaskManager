// src/components/Header/index.jsx
import React, { useRef, useEffect } from 'react';
import { FiUser, FiClock } from 'react-icons/fi';
import { GiCircuitry } from 'react-icons/gi';
import ProfileDropdown from './ProfileDropdown';

const Header = ({ 
  currentTime, 
  userTimezone, 
  openModal, 
  profileDropdownOpen, 
  setProfileDropdownOpen,
  profileData,
  profileLoading,
  fetchProfileData,
  toggleProfileDropdown,
  logout
}) => {
  const profileDropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownRef, setProfileDropdownOpen]);

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-2">
        <GiCircuitry className="text-cyan-400 w-8 h-8" />
        <h1 className="text-3xl font-bold tracking-wide">Task Manager</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 bg-gray-800 px-3 py-2 rounded-lg">
          <FiClock />
          <span>{currentTime.format('YYYY-MM-DD HH:mm:ss')}</span>
          <span className="text-xs text-cyan-300">({userTimezone})</span>
        </div>
        <button 
          onClick={() => openModal()} 
          className="bg-cyan-600 hover:bg-cyan-500 px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-cyan-500/30"
        >
          Buat Task 
        </button>
        
        {/* Profile dropdown */}
        <div className="relative" ref={profileDropdownRef}>
          <FiUser 
            onClick={toggleProfileDropdown} 
            className="w-7 h-7 cursor-pointer text-cyan-300 hover:text-white transition" 
          />
          
          <ProfileDropdown 
            profileDropdownOpen={profileDropdownOpen}
            profileLoading={profileLoading}
            profileData={profileData}
            currentTime={currentTime}
            fetchProfileData={fetchProfileData}
            logout={logout}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;