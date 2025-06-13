import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';
import { FiClock } from 'react-icons/fi';
import { getStatus } from '../../utils/statusUtils';
import TaskCard from './TaskCard';

const TasksList = ({
  groupedTasks,
  loading,
  error,
  filter,
  userTimezone,
  openModal,
  confirmDelete,
  onToggleCompletion,
}) => {
  if (loading) {
    return (
      <div className="flex justify-center">
        <FiClock className="animate-spin w-12 h-12 text-cyan-500" />
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-700 text-red-100 px-4 py-2 rounded-lg">{error}</div>;
  }

  if (Object.keys(groupedTasks).length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-400">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.keys(groupedTasks)
        .sort((a, b) => moment(a, 'MMMM YYYY').diff(moment(b, 'MMMM YYYY')))
        .map(month => {
          let tasks = groupedTasks[month];

          if (filter !== 'all') {
            tasks = tasks.filter(task => {
              const status = getStatus(task, userTimezone);
              switch (filter) {
                case 'upcoming':
                  return status === 'UPCOMING';
                case 'soon':
                  return status === 'SOON';
                case 'ongoing':
                  return status === 'ONGOING';
                case 'expired':
                  return status === 'EXPIRED';
                default:
                  return true;
              }
            });
          }

          if (!tasks.length) return null;

          return (
            <div key={month} className="mb-6">
              <h2 className="text-2xl font-bold mb-4 text-cyan-300 border-b border-cyan-800 pb-2">
                {month}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    userTimezone={userTimezone}
                    openModal={openModal}
                    confirmDelete={confirmDelete}
                    onToggleCompletion={onToggleCompletion}
                  />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
};

TasksList.propTypes = {
  groupedTasks: PropTypes.objectOf(PropTypes.array).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string,
  filter: PropTypes.oneOf(['all', 'upcoming', 'soon', 'ongoing', 'expired']).isRequired,
  userTimezone: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  onToggleCompletion: PropTypes.func.isRequired,
};

export default TasksList;
