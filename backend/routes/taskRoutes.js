// Updated taskRoutes.js
const express = require('express');
const {
  createTask,
  getAllUpcomingTasks,
  getTaskById,
  inviteParticipants,
  updateTask,
  deleteTask,
  checkTimezoneCompatibility, // Add this import
  toggleTaskCompletion,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new task
router.post('/', protect, createTask);

// Get all upcoming tasks
router.get('/', protect, getAllUpcomingTasks);

// Get single task details
router.get('/:id', protect, getTaskById);

// Invite additional users to an task
router.post('/:id/invite', protect, inviteParticipants);

// Update an existing task (only creator)
router.put('/:id', protect, updateTask);

// Delete an task (only creator)
router.delete('/:id', protect, deleteTask);

// Check timezone compatibility for an task
router.post('/check-timezones', protect, checkTimezoneCompatibility);

 // Toggle completion
 router.patch('/:id', protect, toggleTaskCompletion);

module.exports = router;