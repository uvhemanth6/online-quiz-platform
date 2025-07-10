import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900/80 backdrop-blur-sm">
      <div className="w-16 h-16 relative">
        {/* Half-circle spinner */}
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-blue-500 rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;