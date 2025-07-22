import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="classic-bg min-h-screen flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-4 drop-shadow-xl">
                404
            </h1>
            <p className="text-3xl text-white mb-6">Page Not Found</p>
            <p className="text-xl text-gray-200 mb-8">
                Oops! The page you are looking for doesn't exist or has been moved.
            </p>
            <Button
                onClick={() => navigate('/')}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-600 font-bold text-lg transition-all duration-300 hover:-translate-y-1"
            >
                Go to Home
            </Button>
        </div>
    );
};

export default NotFoundPage;