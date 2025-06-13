// src/context/TaskContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentTime, getBrowserTimezone } from '../utils/dateUtils';
import { userService } from '../utils/api';

// Create context
const TaskContext = createContext();

// Context provider component
export const TaskProvider = ({ children }) => {
  // Global state
  const [userTimezone, setUserTimezone] = useState(getBrowserTimezone());
  const [currentTime, setCurrentTime] = useState(getCurrentTime(userTimezone));
  const [availableUsers, setAvailableUsers] = useState([]);
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getCurrentTime(userTimezone));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [userTimezone]);
  
  // Fetch available users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userService.getUsers();
        setAvailableUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Context value
  const value = {
    userTimezone,
    setUserTimezone,
    currentTime,
    availableUsers,
  };
  
  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within an TaskProvider');
  }
  return context;
};

export default TaskContext;