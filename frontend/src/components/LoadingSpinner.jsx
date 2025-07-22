import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="classic-bg fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xl">
      <div className="w-20 h-20 relative">
        {/* Gradient spinner */}
        <div className="absolute inset-0 border-4 border-transparent border-t-pink-500 border-r-purple-500 border-b-indigo-500 rounded-full animate-spin" style={{ borderImage: 'linear-gradient(90deg, #ec4899, #a21caf, #6366f1) 1' }}></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;