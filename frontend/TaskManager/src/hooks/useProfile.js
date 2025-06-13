// src/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../utils/api';
import { getBrowserTimezone } from '../utils/dateUtils';

const useProfile = () => {
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [userTimezone, setUserTimezone] = useState(getBrowserTimezone());
  
  // Fetch profile data
  const fetchProfileData = useCallback(async () => {
    setProfileLoading(true);
    try {
      const data = await userService.getProfile();
      setProfileData(data);
      
      // Update user timezone if available from profile
      if (data.preferred_timezone) {
        setUserTimezone(data.preferred_timezone);
      }
      return data;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);
  
  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    if (!profileDropdownOpen && !profileData) {
      fetchProfileData();
    }
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  
  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };
  
  // Initial load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    }
  }, []);
  
  return {
    profileData,
    profileLoading,
    profileDropdownOpen,
    userTimezone,
    setProfileDropdownOpen,
    fetchProfileData,
    toggleProfileDropdown,
    logout
  };
};

export default useProfile;