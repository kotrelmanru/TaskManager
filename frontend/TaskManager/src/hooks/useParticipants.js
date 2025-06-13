// src/hooks/useParticipants.js
import { useState, useEffect, useCallback } from 'react';
import { userService } from '../utils/api';
import { validateBusinessHoursForAll } from '../utils/validation';

const useParticipants = (userTimezone) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [participantTimezones, setParticipantTimezones] = useState({});
  const [timezoneConflicts, setTimezoneConflicts] = useState([]);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  
  // Fetch available users
  const fetchAvailableUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const users = await userService.getUsers();
      setAvailableUsers(users);
      return users;
    } catch (err) {
      console.error('Error fetching users:', err);
      return [];
    } finally {
      setLoadingUsers(false);
    }
  }, []);
  
  // Process participant string into array
  const updateParticipants = useCallback((participantString, start, end) => {
    // Keep the string as is for the form
    setSelectedParticipants(participantString.split(',').map(p => p.trim()).filter(p => p));
    
    // For validation, parse string into array
    const participantList = participantString.split(',').map(p => p.trim()).filter(p => p);
    
    // Check for participant validity if start/end dates set
    if (start && end && participantList.length > 0) {
      // Validate business hours for all participants
      const validation = validateBusinessHoursForAll(
        start, 
        end, 
        participantList, 
        availableUsers, 
        userTimezone
      );
      
      if (!validation.valid) {
        setTimezoneConflicts(validation.conflicts);
      } else {
        // Clear previous conflicts
        setTimezoneConflicts([]);
      }
    }
    
    return participantList;
  }, [availableUsers, userTimezone]);
  
  // Get a participant by username
  const getUserByUsername = useCallback((username) => {
    return availableUsers.find(u => u.username === username);
  }, [availableUsers]);
  
  // Initial fetch
  useEffect(() => {
    fetchAvailableUsers();
  }, [fetchAvailableUsers]);
  
  return {
    availableUsers,
    loadingUsers,
    selectedParticipants,
    participantTimezones,
    timezoneConflicts,
    suggestedTimes,
    setSuggestedTimes,
    setTimezoneConflicts,
    updateParticipants,
    fetchAvailableUsers,
    getUserByUsername
  };
};

export default useParticipants;