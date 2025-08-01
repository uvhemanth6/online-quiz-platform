Online Quiz Platform

Project Overview:
The Online Quiz Platform is a full-stack web application built on the MERN stack. It provides a dynamic and engaging environment for users to take quizzes and for administrators to easily create and manage content.

✨ Features
🔐 Authentication & Security

Secure JWT-based authentication
Role-based access control (User/Admin)
Protected routes and API endpoints

🤖 AI-Powered Content Generation

Automatic question generation using Google Gemini API
Intelligent multiple-choice question creation
AI-generated answer explanations

📊 Interactive Quiz Experience

Real-time timer functionality
Instant score calculation
Detailed performance analytics
Progress tracking

👨‍💼 Comprehensive Admin Dashboard

Create, edit, and delete quizzes
Visual performance statistics with charts
User submission management
Searchable data tables

📱 Modern UI/UX

Responsive dark-themed design
Built with Tailwind CSS
Mobile-first approach
Intuitive user interface

🛠️ Tech Stack
Frontend:

React.js with Vite
Tailwind CSS
React Router
Axios

Backend:

Node.js
Express.js
MongoDB with Mongoose
JWT Authentication

APIs & Services:

Google Gemini API
RESTful API architecture

📋 Prerequisites
Before you begin, ensure you have the following installed:

Node.js (v14.x or higher)
npm (v6.x or higher)
MongoDB (Local installation or Atlas cluster)
Google Gemini API Key

⚡ Quick Start
1. Clone the Repository
bashgit clone (https://github.com/uvhemanth6/online-quiz-platform.git)
cd edubot-quiz-platform
2. Backend Setup
bash# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
Configure your .env file:
envPORT=5000
MONGO_URI=mongodb://localhost:27017/quizdb
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=1h
NODE_ENV=development
bash# Start the backend server
npm run dev
🚀 Backend server running at http://localhost:5000
3. Frontend Setup
bash# Open new terminal and navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
Configure your frontend .env file:
envVITE_API_BASE_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
bash# Start the frontend development server
npm run dev
🎉 Application live at http://localhost:5173
📖 Usage Guide
For Users

Registration: Create your account at /register
Login: Access your dashboard at /login
Take Quizzes: Browse and start quizzes from your dashboard
View Results: Check detailed results and AI explanations
Track Progress: Monitor your performance over time

For Administrators

Admin Access: Login with admin credentials
Dashboard: View comprehensive analytics and user data
Create Quiz:

Navigate to /create-quiz
Fill in quiz details
Use AI generation for instant question creation


Manage Content: Edit or delete existing quizzes
Monitor Performance: Track user engagement and quiz statistics

🗂️ Project Structure
edubot-quiz-platform/
├── backend/
│   ├── controllers/          # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   ├── config/              # Database configuration
│   └── server.js            # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Helper functions
│   │   ├── context/         # React context
│   │   └── App.jsx          # Main App component
│   ├── public/              # Static assets
│   └── index.html           # HTML template
└── README.md
🔧 API Endpoints
Authentication

POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/auth/profile - Get user profile

Quizzes

GET /api/quizzes - Get all quizzes
POST /api/quizzes - Create new quiz (Admin)
PUT /api/quizzes/:id - Update quiz (Admin)
DELETE /api/quizzes/:id - Delete quiz (Admin)

Results

POST /api/results - Submit quiz results
GET /api/results/user/:userId - Get user results
GET /api/results/quiz/:quizId - Get quiz statistics (Admin)

🧪 Testing
bash# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Run integration tests
npm run test:integration
📦 Deployment
Using Docker
bash# Build and run with Docker Compose
docker-compose up --build
Manual Deployment

Backend: Deploy to services like Heroku, Vercel, or DigitalOcean
Frontend: Deploy to Netlify, Vercel, or GitHub Pages
Database: Use MongoDB Atlas for production

Environment Variables for Production
envNODE_ENV=production
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=(https://online-quiz-platform-e6ca.onrender.com/)
🤝 Contributing
We welcome contributions! Please follow these steps:

Fork the repository
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

Development Guidelines

Follow the existing code style
Write meaningful commit messages
Add tests for new features
Update documentation as needed

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

👥 Authors

UMMADISETTY VENKATA HEMANTH  - (https://github.com/uvhemanth6)

🙏 Acknowledgments

Google Gemini API for AI-powered question generation
MongoDB for database solutions
Tailwind CSS for the amazing styling framework
React community for continuous inspiration

📞 Support
If you have any questions or need help:

📧 Email: venkatahemanth488@gmail.com
🐛 Issues: GitHub Issues
