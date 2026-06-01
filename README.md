# RestaurantPro

RestaurantPro is a modern MERN stack restaurant management system built using React, Bootstrap 5, Axios, React Router DOM, Node.js, Express, MongoDB, Mongoose, and JWT-based authentication.

## Workspace Structure

- `client/` — React frontend and UI components
- `server/` — Express backend, API routes, and MongoDB integration

## Quick Start

1. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```
2. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```
3. Start backend in development:
   ```bash
   cd ../server
   npm run dev
   ```
4. Start frontend:
   ```bash
   cd ../client
   npm run dev
   ```

## Environment

Create a `.env` file in `server/` with:

```env
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
PORT=5000
```
