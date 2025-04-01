# X Clone - MERN Project

A Twitter/X-like social media platform built with the MERN stack (MongoDB, Express, React, Node.js).

![screenshot](https://github.com/user-attachments/assets/41b1c686-0969-411f-8706-b82d8fde8300)

## Features

- User authentication (signup, login, logout)
- Create, read, update, and delete posts
- User profiles
- Follow/unfollow users
- Like and comment on posts
- Real-time updates
- Responsive design

## Tech Stack

### Frontend
- React.js
- Redux for state management
- Styled Components/CSS
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose ODM
- JSON Web Tokens for authentication

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- cross-env

## Installation & Setup

1. Clone the repository
```bash
git clone https://github.com/paulustimothy/x-clone-mern.git
cd X_clone
```

2. Install backend dependencies
```bash
npm install
npm install --save-dev cross-env
```

3. Install frontend dependencies
```bash
cd frontend
npm install
```

4. Configure environment variables
Create a `.env` file in the root directory with the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

## Running the Application

### Development Mode

1. Start the backend server:
```bash
# From the root directory
npm run dev
```

2. Start the frontend development server:
```bash
# From the frontend directory
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:5173`
The backend API will be available at `http://localhost:5000/api`

### Production Mode

To build and run the application in production mode:

```bash
# Build the frontend
cd frontend
npm run build

# Start the production server from the root directory
cd ..
npm start
```


## API Endpoints

- **Auth**
  - `POST /api/users/register` - Register a new user
  - `POST /api/users/login` - Login user
  - `GET /api/users/profile` - Get user profile

- **Posts**
  - `GET /api/posts` - Get all posts
  - `GET /api/posts/:id` - Get a specific post
  - `POST /api/posts` - Create a new post
  - `PUT /api/posts/:id` - Update a post
  - `DELETE /api/posts/:id` - Delete a post

- **Comments**
  - `POST /api/posts/:id/comments` - Add a comment
  - `DELETE /api/posts/:id/comments/:commentId` - Delete a comment

- **Likes**
  - `POST /api/posts/:id/like` - Like/unlike a post

- **Follow**
  - `POST /api/users/:id/follow` - Follow/unfollow a user

Special thanks to As a Programmer
