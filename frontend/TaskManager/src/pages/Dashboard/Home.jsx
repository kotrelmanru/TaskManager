// src/pages/Dashboard/Home.jsx
import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import FilterTabs from '../../components/FilterTabs';
import TasksList from '../../components/TasksList';
import TaskModal from '../../components/TaskModal';

// Custom hooks
import useProfile from '../../hooks/useProfile';
import useTimezone from '../../hooks/useTimezone';
import useTasks from '../../hooks/useTasks';
import useParticipants from '../../hooks/useParticipants';

const Home = () => {
  // State untuk modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentAppt, setCurrentAppt] = useState(null);
  const [showTimezoneAlert, setShowTimezoneAlert] = useState(false);

  // Hooks
  const { 
    profileData, 
    profileLoading, 
    profileDropdownOpen, 
    userTimezone, 
    setProfileDropdownOpen,
    fetchProfileData, 
    toggleProfileDropdown, 
    logout 
  } = useProfile();
  
  const { currentTime } = useTimezone(userTimezone);
  
  const { 
    groupedTasks, 
    loading, 
    error, 
    filter, 
    setFilter, 
    fetchTasks, 
    createTask, 
    updateTask, 
    toggleCompletion,  // gunakan toggleCompletion dari hook
    confirmDelete 
  } = useTasks(userTimezone);
  
  const { 
    availableUsers, 
    loadingUsers, 
    timezoneConflicts, 
    setTimezoneConflicts, 
    suggestedTimes, 
    setSuggestedTimes 
  } = useParticipants(userTimezone);
  
  // Buka modal (add / edit)
  const openModal = (task) => {
    if (task) {
      setEditMode(true);
      setCurrentAppt(task);
    } else {
      setEditMode(false);
      setCurrentAppt(null);
    }
    setModalOpen(true);
  };
  
  // Tutup modal
  const closeModal = () => {
    setModalOpen(false);
  };
  
  // Tutup timezone alert
  const closeTimezoneAlert = () => {
    setShowTimezoneAlert(false);
  };

  // Fetch initial data
  useEffect(() => {
    fetchProfileData().then(fetchTasks);
  }, [fetchProfileData, fetchTasks]);

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-900 min-h-screen text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1/4 h-full bg-gradient-to-r from-cyan-900/10 to-transparent -z-10" />
      <div className="absolute top-0 right-0 w-1/4 h-full bg-gradient-to-l from-cyan-900/10 to-transparent -z-10" />

      <Header 
        currentTime={currentTime}
        userTimezone={userTimezone}
        openModal={openModal}
        profileDropdownOpen={profileDropdownOpen}
        setProfileDropdownOpen={setProfileDropdownOpen}
        profileData={profileData}
        profileLoading={profileLoading}
        fetchProfileData={fetchProfileData}
        toggleProfileDropdown={toggleProfileDropdown}
        logout={logout}
      />

      <FilterTabs 
        filter={filter}
        setFilter={setFilter}
      />

      <TasksList 
        groupedTasks={groupedTasks}
        loading={loading}
        error={error}
        filter={filter}
        userTimezone={userTimezone}
        openModal={openModal}
        confirmDelete={confirmDelete}
        onToggleCompletion={toggleCompletion}  // langsung gunakan toggleCompletion
      />

      <TaskModal 
        modalOpen={modalOpen}
        closeModal={closeModal}
        editMode={editMode}
        currentAppt={currentAppt}
        userTimezone={userTimezone}
        availableUsers={availableUsers}
        loadingUsers={loadingUsers}
        createTask={createTask}
        updateTask={updateTask}
        showTimezoneAlert={showTimezoneAlert}
        setShowTimezoneAlert={setShowTimezoneAlert}
        timezoneConflicts={timezoneConflicts}
        setTimezoneConflicts={setTimezoneConflicts}
        suggestedTimes={suggestedTimes}
        closeTimezoneAlert={closeTimezoneAlert}
      />
    </div>
  );
};

export default Home;
