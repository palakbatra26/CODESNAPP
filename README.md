# AI Image Generator MERN App

This is a complete MERN-stack AI Image Generator with Authentication, History, and an Admin dashboard built for robust performance and elegant aesthetics.
It uses **Pollinations AI** for completely free, keyless, and instant AI image generation.

## 🌟 Features
- **Frontend**: Vite + React + Tailwind CSS (Glassmorphism UI)
- **Backend**: Node.js + Express
- **Database**: MongoDB with Mongoose
- **Image Generation**: Integrated with Pollinations AI (No API Key Required!)
- **Authentication**: JWT-based Secure Login/Signup
- **User History**: Every generated image is automatically saved to MongoDB and viewable on a responsive grid timeline.
- **Admin Panel**: Dedicated dashboard for admins to monitor all user-generated content.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB Desktop / Atlas running locally on `mongodb://127.0.0.1:27017/ai-image-generator`

### 1. Backend Setup
1. CD into the backend directory
```bash
cd backend
```
2. Install dependencies
```bash
npm install
```
3. Run Development Server
```bash
npm run dev
```
*(Backend runs on http://localhost:5000)*

### 2. Frontend Setup
1. Open a new terminal and CD into the frontend directory
```bash
cd frontend
```
2. Install dependencies
```bash
npm install
```
3. Start the Vite App
```bash
npm run dev
```

### 3. How to create an Admin
By default new users have `isAdmin: false`. To test the admin dashboard route (`/admin`):
1. Register a new user in the web UI.
2. Open MongoDB Compass or mongosh.
3. Update that user's document in the `users` collection to set `"isAdmin": true`.
4. Relogin to see the Admin tab!

## API Documentation
| Method | Endpoint | Protection | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Create a new account |
| POST | `/api/auth/login` | None | Logon and receive JWT |
| POST | `/api/images/generate` | Auth Required | Send prompt to AI, returns generated image URL |
| GET | `/api/images/history` | Auth Required | Returns user's generated image history |
| GET | `/api/images/admin/history` | Auth + Admin Required | Returns total image generation history globally |
