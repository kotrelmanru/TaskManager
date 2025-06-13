import React from 'react';
import PropTypes from 'prop-types';
import { FiClock, FiCheckCircle, FiCircle } from 'react-icons/fi';
import { getStatus, statusStyles } from '../../utils/statusUtils';
import { formatDateWithTz } from '../../utils/dateUtils';

const TaskCard = ({
  task,
  userTimezone,
  openModal,
  confirmDelete,
  onToggleCompletion,
}) => {
  const status = getStatus(task, userTimezone);
  const styles = statusStyles[status];

  const handleToggle = () => {
    // Pastikan onToggleCompletion memang ter-passing dan bertipe function
    console.log('TaskCard: handleToggle for', task._id);
    onToggleCompletion(task._id);
  };

  return (
    <div
      className={`
        p-5 rounded-xl border
        ${styles.bg} ${styles.border} ${styles.shadow}
        ${task.completed ? 'opacity-60 line-through' : ''}
        transition-all hover:scale-[1.02]
      `}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className={`text-xl font-semibold ${styles.text}`}>{task.title}</h2>
        <div className="flex items-center">
          {styles.icon}
          <span className={`ml-2 text-sm uppercase font-bold ${styles.statusText}`}>
            {status}
          </span>
        </div>
      </div>

      {task.description && (
        <p className={`text-sm mb-3 ${status === 'EXPIRED' ? 'text-gray-500' : 'text-gray-300'}`}>
          {task.description}
        </p>
      )}

      <div className="mb-3">
        <div className="flex items-center text-sm mb-1">
          <FiClock className={`mr-1 ${styles.text}`} />
          <span className={status === 'EXPIRED' ? 'text-gray-500' : ''}>
            {formatDateWithTz(task.start, userTimezone)}
          </span>
        </div>
        <div className="flex items-center text-sm">
          <FiClock className={`mr-1 ${styles.text}`} />
          <span className={status === 'EXPIRED' ? 'text-gray-500' : ''}>
            {formatDateWithTz(task.end, userTimezone)}
          </span>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <button
          onClick={handleToggle}
          className={`
            flex items-center px-3 py-1 rounded transition-all
            ${task.completed
              ? 'bg-yellow-600 text-white hover:bg-yellow-500'
              : 'bg-green-700 text-white hover:bg-green-600'}
            hover:shadow-md
          `}
        >
          {task.completed ? (
            <>
              <FiCircle className="mr-1" /> Mark Incomplete
            </>
          ) : (
            <>
              <FiCheckCircle className="mr-1" /> Mark Complete
            </>
          )}
        </button>

        <button
          onClick={() => confirmDelete(task._id)}
          className={`
            px-3 py-1 rounded transition-all
            ${status === 'EXPIRED'
              ? 'bg-gray-800 text-gray-500 hover:bg-gray-700'
              : 'bg-red-700 text-white hover:bg-red-600'}
            hover:shadow-md
          `}
        >
          Hapus
        </button>
      </div>
    </div>
  );
};

TaskCard.propTypes = {
  task: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  userTimezone: PropTypes.string.isRequired,
  openModal: PropTypes.func.isRequired,
  confirmDelete: PropTypes.func.isRequired,
  onToggleCompletion: PropTypes.func.isRequired,
};

export default TaskCard;
