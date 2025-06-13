// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from 'react';
import Swal from 'sweetalert2';
import { taskService } from '../utils/api';
import { groupTasksByMonth } from '../utils/dateUtils';

const useTasks = (userTimezone) => {
  const [tasks, setTasks] = useState([]);
  const [groupedTasks, setGroupedTasks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskService.fetchAll();
      setTasks(data);
      setGroupedTasks(groupTasksByMonth(data, userTimezone));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [userTimezone]);

  // Create a new task
  const createTask = async (taskData) => {
    try {
      await taskService.create(taskData);
      await fetchTasks();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error creating task'
      };
    }
  };

  // Update an existing task
  const updateTask = async (id, taskData) => {
    try {
      await taskService.update(id, taskData);
      await fetchTasks();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || 'Error updating task'
      };
    }
  };

  // Toggle task completion
  const toggleCompletion = async (id) => {
    // Find current task and its completed status
    const task = tasks.find(t => t._id === id);
    if (!task) {
      return { success: false, error: 'Task not found' };
    }
    const newCompleted = !task.completed;
    try {
      // Optimistic update locally
      const updatedTasks = tasks.map(t =>
        t._id === id ? { ...t, completed: newCompleted } : t
      );
      setTasks(updatedTasks);
      setGroupedTasks(groupTasksByMonth(updatedTasks, userTimezone));

      // Send update to server
      await taskService.update(id, { completed: newCompleted });
      return { success: true };
    } catch (err) {
      // Rollback on error
      setTasks(tasks);
      setGroupedTasks(groupTasksByMonth(tasks, userTimezone));
      return {
        success: false,
        error: err.response?.data?.message || 'Error toggling completion'
      };
    }
  };

  // Delete a task
  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      await fetchTasks();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        timer: 2000,
        showConfirmButton: false
      });
      return { success: true };
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Could not delete task', 'error');
      return { success: false };
    }
  };

  // Prompt user to confirm delete
  const confirmDelete = (id) => Swal.fire({
    title: 'Delete this task?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete',
    cancelButtonText: 'Cancel'
  }).then(result => {
    if (result.isConfirmed) {
      return deleteTask(id);
    }
    return { success: false, canceled: true };
  });

  // Initial fetch
  useEffect(() => {
    if (userTimezone) {
      fetchTasks();
    }
  }, [fetchTasks, userTimezone]);

  return {
    tasks,
    groupedTasks,
    loading,
    error,
    filter,
    setFilter,
    fetchTasks,
    createTask,
    updateTask,
    toggleCompletion,
    deleteTask,
    confirmDelete
  };
};

export default useTasks;
