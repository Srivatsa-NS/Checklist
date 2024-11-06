Checklist Web App

A web application that allows users to manage checklists, register, login, and submit responses to various questions. It has a React frontend and an Express backend, using PostgreSQL for data storage.

Features

- User authentication (login and registration)
- Create, view, and manage checklists
- Submit responses to questions
- PDF generation of checklists
- Categorize questions for better organization

Technologies

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express.js
- Database: PostgreSQL
- Authentication: Session-based (no JWT)
- PDF Generation: pdfMake
- Styling: Tailwind CSS

Project Structure

Checklist-Project/
├── client/                  # Frontend React app
│   ├── public/              # Public assets
│   ├── src/                 # React source code
│   ├── package.json         # Frontend dependencies and scripts
├── server/                  # Backend Express app
│   ├── src/                 # Backend source code
│   ├── package.json         # Backend dependencies and scripts
├── .env                     # Environment variables
├── README.md                # This file

Prerequisites

- Node.js (v14 or later)
- PostgreSQL

Installation

Backend (Server)

1. Navigate to the `server` directory:

    cd server

2. Install the required packages:

    npm install

3. Create a `.env` file in the `server` directory to configure your environment variables (e.g., database connection details).

4. Run the backend server:

    npm run dev

Frontend (Client)

1. Navigate to the `client` directory:

    cd client

2. Install the required packages:

    npm install

3. Set the environment variable to change the default React port:

    Create a `.env` file in the `client` directory with the following content:

    PORT=5173

4. Run the frontend server:

    npm start

Running Both Servers

You can run both frontend and backend servers concurrently using [concurrently](https://www.npmjs.com/package/concurrently). Install it in the `server` folder:

npm install concurrently

Then, modify the `server/package.json` to add a script for running both servers:

```json
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "nodemon ./src/index.js",
  "client": "npm start --prefix ../client"
}
