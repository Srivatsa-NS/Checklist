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

2. Create a `.env` file in the `server` directory to configure your environment variables (e.g., database connection details like shown in .env.example file).
   
3. Install the required packages and start the server :

    npm run dev

Frontend (Client)

1. Navigate to the `client` directory:

    cd client

2. Install the required packages and run frontend :

    npm start
