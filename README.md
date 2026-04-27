# EduTrack - Modern Student Management System

Welcome to **EduTrack**, a comprehensive and modern Student Management System built using the MERN stack (MongoDB, Express, React, Node.js). It provides a robust solution for administrators and students to manage academic records, course registrations, and enrollments seamlessly.

## Features

### 🎓 For Students
- **Personal Dashboard**: View your enrolled classes, available courses, and track your academic progress.
- **Course Registration**: Browse open courses and register for seats in real-time.
- **Profile Management**: View and maintain your student profile details.

### 🛡️ For Administrators
- **Student Management**: Create, Read, Update, and Delete (CRUD) student records with detailed profiles including family and contact information.
- **Course Management**: Create new courses, set credit limits, assign instructors, and manage maximum seating capacity.
- **Enrollment Tracking**: Monitor course enrollments, track available seats, and manage student rosters.
- **Role-based Access Control**: Secure admin routes ensuring that only authorized personnel can make changes.

## Technologies Used

- **Frontend**: React, React Router, Tailwind CSS for a beautiful, responsive UI.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB & Mongoose.
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs for secure password hashing.
- **State & Routing**: React Router v6, Axios for API calls.

## Getting Started

Follow these steps to set up the project locally:

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Student_management
```

### 2. Backend Setup
Navigate to the `server` directory, install dependencies, and start the server:
```bash
cd server
npm install
npm start
```
*Note: Make sure your `server/.env` file is properly configured with your `MONGO_URI`, `JWT_SECRET`, and `PORT=5000`.*

### 3. Frontend Setup
Open a new terminal, navigate to the `client` directory, install dependencies, and start the React app:
```bash
cd client
npm install
npm start
```
*Note: Ensure your `client/.env` file is configured with `REACT_APP_API_URL=http://localhost:5000`.*



