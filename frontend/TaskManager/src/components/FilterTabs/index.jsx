// src/components/FilterTabs/index.jsx
import React from 'react';

const FilterTabs = ({ filter, setFilter }) => {
  return (
    <div className="flex space-x-2 mb-6 bg-gray-800 p-1 rounded-lg overflow-x-auto">
      <button 
        className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'all' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
        onClick={() => setFilter('all')}
      >
        Semua Task
      </button>
      <button 
        className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'upcoming' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
        onClick={() => setFilter('upcoming')}
      >
        Completed
      </button>
      <button 
        className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'ongoing' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
        onClick={() => setFilter('ongoing')}
      >
        Incompleted
      </button>
      <button 
        className={`px-4 py-2 rounded-md whitespace-nowrap ${filter === 'expired' ? 'bg-cyan-600 text-white' : 'text-gray-300'}`}
        onClick={() => setFilter('expired')}
      >
        Expired
      </button>
    </div>
  );
};

export default FilterTabs;