const User = require('../models/User');
const Task = require('../models/Task');
const moment = require('moment-timezone');

// Create Task
exports.createTask = async (req, res) => {
  try {
    const creator_id = req.user.id;
    const { title, description, participants = [], start, end } = req.body;

    // Convert usernames to user IDs
    const users = await User.find({ username: { $in: participants } });
    const participantIds = users.map(u => u._id); // Gunakan _id sebagai referensi
    
    // Validasi semua username valid
    if (users.length !== participants.length) {
      const missing = participants.filter(u => !users.some(dbUser => dbUser.username === u));
      return res.status(400).json({ message: `Invalid usernames: ${missing.join(', ')}` });
    }

    const allParticipants = [...new Set([...participantIds, creator_id])];

    const invalid = [];
    for (let userId of allParticipants) {
      const user = await User.findById(userId);
      if (!user) continue;
      const tz = user.preferred_timezone || 'UTC';
      const sLocal = moment.tz(start, tz);
      const eLocal = moment.tz(end, tz);
      if (sLocal.hour() < 9 || eLocal.hour() > 17) {
        invalid.push({ user: user.username, tz, start: sLocal.format(), end: eLocal.format() });
      }
    }
    if (invalid.length) {
      return res.status(400).json({
        message: 'Task outside working hours for some participants.',
        invalid
      });
    }

    const task = await Task.create({
      title,
      description,
      creator_id,
      participants: allParticipants,
      start: new Date(start),
      end: new Date(end)
    });

    res.status(201).json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

// Get all upcoming tasks (for everyone)
exports.getAllUpcomingTasks = async (req, res) => {
  try {
    const now = new Date();

    // Hanya filter end >= now, tanpa membatasi peserta atau creator
    const tasks = await Task.find({
      end: { $gte: now }
    })
      // .populate('creator_id', 'id name username preferred_timezone')
      // .populate('participants', 'id name username preferred_timezone')
      // .sort({ start: 1 });

    res.json({ tasks });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error fetching all upcoming tasks', error: err.message });
  }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id)
      .populate('creator_id', 'id name username preferred_timezone')
      .populate('participants', 'id name username preferred_timezone');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching task', error: err.message });
  }
};

// Invite additional users
exports.inviteParticipants = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { participants = [] } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.creator_id !== userId) {
      return res.status(403).json({ message: 'Only creator can invite participants' });
    }

    const allParticipants = Array.from(new Set([...task.participants, ...participants]));
    task.participants = allParticipants;
    await task.save();

    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Error inviting participants', error: err.message });
  }
};

// Update Task
exports.updateTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, description, start, end, participants = [] } = req.body;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.creator_id !== userId) {
      return res.status(403).json({ message: 'Only creator can update this task' });
    }

    // Convert usernames to user IDs if participants were provided
    if (participants && participants.length > 0) {
      const users = await User.find({ username: { $in: participants } });
      
      // Validate all usernames are valid
      if (users.length !== participants.length) {
        const missing = participants.filter(u => !users.some(dbUser => dbUser.username === u));
        return res.status(400).json({ message: `Invalid usernames: ${missing.join(', ')}` });
      }
      
      const participantIds = users.map(u => u._id);
      // Add creator_id if not already in participants
      const allParticipants = [...new Set([...participantIds, userId])];
      task.participants = allParticipants;
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (start) task.start = new Date(start);
    if (end) task.end = new Date(end);

    await task.save();
    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.creator_id !== userId) {
      return res.status(403).json({ message: 'Only creator can delete this task' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};

// Add to taskController.js

// Add to taskController.js

// Check timezone compatibility and suggest available times
exports.checkTimezoneCompatibility = async (req, res) => {
  try {
    const { participants = [], start, end } = req.body;
    const creator_id = req.user.id;
    
    // Get creator's timezone
    const creator = await User.findById(creator_id);
    const creatorTz = creator.preferred_timezone || 'UTC';
    
    // Convert usernames to user objects
    const users = await User.find({ username: { $in: participants } });
    
    // Check if all usernames are valid
    if (users.length !== participants.length) {
      const missing = participants.filter(u => !users.some(dbUser => dbUser.username === u));
      return res.status(400).json({ message: `Invalid usernames: ${missing.join(', ')}` });
    }
    
    // Add creator to participants list
    const allUsers = [...users, creator];
    
    // Calculate working hours in each user's timezone
    const conflicts = [];
    for (let user of allUsers) {
      const userTz = user.preferred_timezone || 'UTC';
      const startLocal = moment.tz(start, userTz);
      const endLocal = moment.tz(end, userTz);
      
      const startHour = startLocal.hour();
      const endHour = endLocal.hour();
      const endMinute = endLocal.minute();
      
      // Check if outside working hours (8:00-17:00)
      if (startHour < 8 || (endHour > 17 || (endHour === 17 && endMinute > 0))) {
        conflicts.push({
          user: user.username,
          tz: userTz,
          start: startLocal.format(),
          end: endLocal.format()
        });
      }
    }
    
    // If there are conflicts, calculate suggested times
    if (conflicts.length > 0) {
      const suggestedTimes = calculateAvailableMeetingTimes(allUsers, moment.duration(moment(end).diff(moment(start))).asMinutes());
      
      return res.status(200).json({
        message: 'Timezone conflicts detected',
        conflicts,
        suggestedTimes: suggestedTimes.slice(0, 10) // Return top 10 suggestions
      });
    }
    
    // If no conflicts, return success
    return res.status(200).json({ 
      message: 'No timezone conflicts',
      compatible: true 
    });
    
  } catch (err) {
    res.status(500).json({ 
      message: 'Error checking timezone compatibility', 
      error: err.message 
    });
  }
};

  // Toggle completed/incomplete
  exports.toggleTaskCompletion = async (req, res) => {
    try {
      const userId = req.user.id;
      const { task_id } = req.params;
  
      const task = await Task.findOne({ id: task_id });
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
      // Hanya creator yang boleh toggle
      if (task.creator_id !== userId) {
        return res.status(403).json({ message: 'Only creator can toggle completion' });
      }
  
      task.completed = !task.completed;
      await task.save();
  
      res.json({ 
        message: `Task marked as ${task.completed ? 'completed' : 'incomplete'}`, 
        task: { id: task.id, completed: task.completed } 
      });
    } catch (err) {
      res.status(500).json({ message: 'Error toggling task completion', error: err.message });
    }
  }

// Helper function to calculate available meeting times
function calculateAvailableMeetingTimes(users, durationMinutes) {
  // Default to 60 minutes if not specified
  const meetingDuration = durationMinutes || 60;
  
  // Find common working hours across all timezones
  const suggestions = [];
  const today = moment().startOf('day');
  
  // Look for slots in the next 5 business days
  for (let dayOffset = 0; dayOffset < 5; dayOffset++) {
    const currentDay = moment(today).add(dayOffset, 'days');
    
    // Skip weekends
    if (currentDay.day() === 0 || currentDay.day() === 6) {
      continue;
    }
    
    // Try different start times (hour slots from 8 to 16)
    for (let startHour = 8; startHour <= 16; startHour++) {
      const startTime = moment(currentDay).hour(startHour).minute(0);
      const endTime = moment(startTime).add(meetingDuration, 'minutes');
      
      // Skip if end time goes beyond 17:00
      if (endTime.hour() > 17 || (endTime.hour() === 17 && endTime.minute() > 0)) {
        continue;
      }
      
      // Check if this time works for all users
      let compatible = true;
      for (const user of users) {
        const userTz = user.preferred_timezone || 'UTC';
        const userStartTime = moment(startTime).tz(userTz);
        const userEndTime = moment(endTime).tz(userTz);
        
        // Check if within working hours in user's timezone
        if (userStartTime.hour() < 8 || userEndTime.hour() > 17 || 
            (userEndTime.hour() === 17 && userEndTime.minute() > 0)) {
          compatible = false;
          break;
        }
      }
      
      // If compatible for all users, add to suggestions
      if (compatible) {
        suggestions.push({
          start: startTime.format(),
          end: endTime.format()
        });
      }
    }
  }
  
  return suggestions;
}