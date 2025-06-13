// src/components/TaskModal/index.jsx
import React, { useState, useEffect } from 'react';
import { FiClock, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import moment from 'moment-timezone';
import Swal from 'sweetalert2';
import { formatForDateTimeInput } from '../../utils/dateUtils';
import { validateBusinessHoursForAll } from '../../utils/validation';
import TimezoneConflictAlert from './TimezoneConflictAlert';

const TaskModal = ({
  modalOpen,
  closeModal,
  editMode,
  currentAppt,
  userTimezone,
  availableUsers,
  loadingUsers,
  createTask,
  updateTask
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    participants: ''
  });
  const [modalError, setModalError] = useState('');
  const [timezoneConflicts, setTimezoneConflicts] = useState([]);
  const [suggestedTimes, setSuggestedTimes] = useState([]);
  const [showTimezoneAlert, setShowTimezoneAlert] = useState(false);
  
  // Initialize form data when modal opens
  useEffect(() => {
    if (modalOpen) {
      setModalError('');
      if (editMode && currentAppt) {
        let participantsList = '';
        if (currentAppt.participants && Array.isArray(currentAppt.participants)) {
          participantsList = currentAppt.participants
            .filter(p => p && p !== currentAppt.creator_id)
            .map(p => {
              if (typeof p === 'object' && p.username) {
                return p.username;
              } else if (typeof p === 'string') {
                const user = availableUsers.find(u => u._id === p || u.id === p);
                return user ? user.username : p;
              }
              return p;
            })
            .join(', ');
        }
        
        setFormData({
          title: currentAppt.title,
          description: currentAppt.description || '',
          start: formatForDateTimeInput(currentAppt.start, userTimezone),
          end: formatForDateTimeInput(currentAppt.end, userTimezone),
          participants: participantsList
        });
      } else {
        setFormData({
          title: '',
          description: '',
          start: '',
          end: '',
          participants: ''
        });
      }
    }
  }, [modalOpen, editMode, currentAppt, availableUsers, userTimezone]);
  
  const handleChange = (e) => {
    if (e.target.name === 'participants') {
      updateParticipants(e.target.value);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    setModalError('');
  };
  
  const updateParticipants = (participantString) => {
    // IMPORTANT: Keep the input string as is
    setFormData(prev => ({ ...prev, participants: participantString }));
    
    // For validation, parse string into array
    const participantList = participantString.split(',').map(p => p.trim()).filter(p => p);
    
    // Check for participant validity if start/end dates set
    if (formData.start && formData.end && participantList.length > 0) {
      // Validate business hours for all participants
      const validation = validateBusinessHoursForAll(
        formData.start,
        formData.end,
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
  };
  
  const closeTimezoneAlert = () => {
    setShowTimezoneAlert(false);
  };
  
  const selectSuggestedTime = (startTime, endTime) => {
    setFormData({
      ...formData,
      start: moment(startTime).format('YYYY-MM-DDTHH:mm'),
      end: moment(endTime).format('YYYY-MM-DDTHH:mm')
    });
    setShowTimezoneAlert(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDate = new Date(formData.start), endDate = new Date(formData.end);
    
    if (endDate <= startDate) {
      return setModalError('End time must be after start time.');
    }
    
    // Get participants array 
    const participants = formData.participants.split(',').map(p => p.trim()).filter(p => p);
    
    // Validate working hours for all (creator and participants)
    const validation = validateBusinessHoursForAll(
      formData.start,
      formData.end,
      participants,
      availableUsers,
      userTimezone
    );
    
    if (!validation.valid) {
      // Show timezone conflicts alert
      setTimezoneConflicts(validation.conflicts);
      setShowTimezoneAlert(true);
      return; // Don't proceed with task creation
    }
    
    try {
      const payload = { 
        title: formData.title,
        description: formData.description,
        start: formData.start,
        end: formData.end,
        participants: participants // Always include participants, even if empty array
      };
      
      let result;
      
      if (editMode && currentAppt) {
        result = await updateTask(currentAppt._id, payload);
      } else {
        result = await createTask(payload);
      }
      
      if (result.success) {
        closeModal();
        Swal.fire({ 
          icon: 'success', 
          title: editMode ? 'Task Updated!' : 'Task Created!',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        setModalError(result.error || 'Error saving task');
      }
    } catch (err) {
      setModalError(err.response?.data?.message || 'Error saving task');
      console.error('Error submitting form:', err);
    }
  };
  
  if (!modalOpen) {
    return null;
  }
  
  return (
    <>
      <div className="fixed inset-0 flex justify-center items-center pointer-events-none z-50 bg-black bg-opacity-50">
        <div className="pointer-events-auto bg-gray-900 border border-cyan-500 rounded-lg p-4 w-full max-w-md mx-4 shadow-lg shadow-cyan-500/20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl text-cyan-400 font-bold">
              {editMode ? 'Ubah Task' : 'Buat Task'}
            </h2>
            <button onClick={closeModal} className="text-cyan-400 hover:text-white text-2xl">
              &times;
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {modalError && (
              <p className="text-red-400 text-sm bg-red-900/30 p-2 rounded">
                {modalError}
              </p>
            )}
            <div>
              <label className="block text-sm mb-1 text-cyan-300">Judul</label>
              <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                className="w-full bg-gray-800 border border-cyan-600 rounded px-3 py-2 focus:outline-none focus:border-cyan-400 text-white" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-cyan-300">Deskripsi</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                className="w-full bg-gray-800 border border-cyan-600 rounded px-3 py-2 focus:outline-none focus:border-cyan-400 text-white" 
                rows="2"
              />
            </div>
            <div className="flex space-x-3">
              <div className="flex-1">
                <label className="block text-sm mb-1 text-cyan-300">Awal</label>
                <input 
                  type="datetime-local" 
                  name="start" 
                  value={formData.start} 
                  onChange={handleChange} 
                  className="w-full bg-gray-800 border border-cyan-600 rounded px-1 py-1 focus:outline-none focus:border-cyan-400 text-white" 
                  required 
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1 text-cyan-300">Akhir</label>
                <input 
                  type="datetime-local" 
                  name="end" 
                  value={formData.end} 
                  onChange={handleChange} 
                  className="w-full bg-gray-800 border border-cyan-600 rounded px-1 py-1 focus:outline-none focus:border-cyan-400 text-white" 
                  required 
                />
              </div>
            </div>
            
            {/* Compact participant selection */}
            <div>
              <label className="block text-sm mb-1 text-cyan-300">Peserta</label>
              <div className="relative">
                <input 
                  type="text" 
                  name="participants" 
                  value={formData.participants} 
                  onChange={handleChange} 
                  className="w-full bg-gray-800 border border-cyan-600 rounded px-3 py-2 focus:outline-none focus:border-cyan-400 text-white" 
                  placeholder="John, Jane, Alex" 
                />
                {loadingUsers ? (
                  <div className="absolute right-3 top-2">
                    <FiClock className="animate-spin w-5 h-5 text-cyan-400" />
                  </div>
                ) : null}
              </div>
              <small className="text-gray-400 block mt-1 text-xs">
                Masukkan username pisahkan dengan koma
              </small>
              
              {/* Compact participant timezone info */}
              {formData.participants && formData.participants.split(',').filter(p => p.trim()).length > 0 && (
                <div className="mt-2 bg-gray-800/50 p-2 rounded-lg">
                  <h4 className="text-cyan-300 text-xs font-medium mb-1 flex items-center">
                    <FiUsers className="mr-1" /> Participant Information:
                  </h4>
                  <div className="overflow-y-auto space-y-1 text-xs">
                    {availableUsers
                      .filter(user => formData.participants.split(',').map(p => p.trim()).includes(user.username))
                      .map(user => (
                        <div key={user.username} className="flex justify-between items-center py-1 border-b border-gray-700 last:border-b-0">
                          <span className="text-white">{user.username}</span>
                          <div className="flex flex-col items-end">
                            <span className="text-cyan-400">{user.preferred_timezone || 'UTC'}</span>
                            {formData.start && (
                              <span className="text-amber-300 text-[10px]">
                                Meeting: {moment(formData.start).tz(user.preferred_timezone || 'UTC').format('HH:mm')}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    }
                  </div>
                  <div className="mt-1 pt-1 border-t border-gray-700">
                    <p className="text-amber-300 text-[10px] flex items-center">
                      <FiAlertTriangle className="inline mr-1" />
                      Task time must be 08:00-17:00 for all participants
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 pt-2">
              <button 
                type="button" 
                onClick={closeModal} 
                className="px-4 py-2 border border-cyan-600 text-cyan-400 rounded hover:bg-cyan-900/30 transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded transition hover:shadow-md hover:shadow-cyan-500/30"
              >
                {editMode ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <TimezoneConflictAlert 
        showTimezoneAlert={showTimezoneAlert}
        closeTimezoneAlert={closeTimezoneAlert}
        timezoneConflicts={timezoneConflicts}
        suggestedTimes={suggestedTimes}
        selectSuggestedTime={selectSuggestedTime}
      />
    </>
  );
};

export default TaskModal;