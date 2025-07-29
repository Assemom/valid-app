# Valid App: Node.js API with MySQL

## Overview
A Node.js Express API for managing program records with MySQL. Features CORS, input validation, and is ready for free deployment (Render/Railway).

## Features
- RESTful API: POST and GET endpoints for programs
- MySQL database auto-initialization
- CORS enabled
- Input validation and error handling
- Ready for deployment on Render or Railway

## Folder Structure
```
valid-app/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── routes/
│   │   └── programs.js
│   └── server.js
├── .env
├── package.json
└── README.md
```

## Setup
1. **Clone the repo and install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   - Create a `.env` file in the root directory with the following content:
     ```env
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=yourpassword
     DB_NAME=valid_app_db
     PORT=3000
     ```
3. **Start MySQL server** (locally or use a free service like PlanetScale).
4. **Run the app locally:**
   ```bash
   npm start
   ```

## API Endpoints
### POST `/api/programs`
- **Body:**
  ```json
  {
    "program_name": "string",
    "is_active": boolean
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "id": number,
      "program_name": "string",
      "is_active": boolean
    }
  }
  ```

### GET `/api/programs/:id`
- **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "id": number,
      "program_name": "string",
      "is_active": boolean
    }
  }
  ```
- **404 Not Found:**
  ```json
  { "status": "error", "message": "Program not found" }
  ```

## Deployment (Render Example)
1. **Push your code to GitHub.**
2. **Create a new Web Service on [Render](https://render.com/):**
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variables from your `.env` file.
3. **Provision a MySQL database** (e.g., [PlanetScale](https://planetscale.com/)) and update `.env`.
4. **Deploy!**

## Notes
- The database and table are auto-created on app start.
- Use tools like Postman or curl to test endpoints.
- For production, secure your `.env` and database credentials. 