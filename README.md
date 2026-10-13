# 🧭 College Navigator Backend (`collegeNavigatorBackend`)

> RESTful API service for the **Smart Campus Navigator** at **Hindustan Institute of Technology and Science (Hindustan University), Padur**. Built with **Node.js**, **Express.js 5**, and integrated with the **Google Routes API v2**.

---

## 🌟 Key Features

- **📍 Campus Points of Interest (POI) API**:
  - Full catalog of campus locations including Academic Blocks, Laboratories, Administration, Libraries, Auditoriums, Canteens, and Facilities.
  - Supports category filtering (`category=Academic`, `category=Canteen`, etc.) and fuzzy text search (`search=library`).
  - Single location lookup by ID (`/api/locations/:id`).

- **🧭 Route & Navigation Engine**:
  - Proxy integration with Google Routes API v2 (`computeRoutes`).
  - Supports walking (`WALK`) and driving (`DRIVE`) travel modes.
  - Returns encoded polylines, step-by-step turn guidance, distance (meters), and duration (seconds).

- **🛡️ CORS & Environment-Driven**:
  - Pre-configured CORS middleware for seamless communication with the frontend client.
  - Configurable server port and API keys via environment variables.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **[Node.js](https://nodejs.org/)** | Server-side JavaScript runtime |
| **[Express.js 5](https://expressjs.com/)** | RESTful routing and middleware framework |
| **[CORS](https://www.npmjs.com/package/cors)** | Cross-Origin Resource Sharing handling |
| **[dotenv](https://www.npmjs.com/package/dotenv)** | Environment variable loading |
| **[Google Routes API v2](https://developers.google.com/maps/documentation/routes)** | Accurate pathfinding and walking directions |

---

## 📁 Project Structure

```text
backend/
├── routes/
│   ├── locations.js    # Campus location database & search/filter endpoints
│   └── routes.js       # Google Routes API integration & route computation
├── .env.example        # Environment variable template
├── package.json        # Dependencies and scripts
└── server.js           # Server initialization, middleware & health routes
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** (v18 or higher) and **npm** installed:
```bash
node -v
npm -v
```

### 2. Installation
Navigate into the backend directory and install dependencies:
```bash
cd backend
npm install
```

### 3. Configure Environment Variables
Copy the example environment configuration:
```bash
cp .env.example .env
```

Open `.env` and set your configuration:
```env
# Server Port (default: 5050)
PORT=5050

# Google Maps API Key (required for /api/routes Google Routes API v2 integration)
GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

### 4. Run the Server
```bash
# Start server
npm start

# Or using dev script
npm run dev
```

The backend server will start at `http://localhost:5050`.

---

## 📡 API Reference

### Health Check
- **`GET /api/health`**
  - Response:
    ```json
    {
      "success": true,
      "message": "Smart Campus Navigator API is running",
      "timestamp": "2026-10-13T16:30:00.000Z"
    }
    ```

### Locations
- **`GET /api/locations`**
  - Optional Query Params:
    - `category`: Filter by category (e.g. `Academic`, `Canteen`, `Facility`, `Entrance`, `Events`)
    - `search`: Filter by name or description keyword (e.g. `library`, `hangar`)
  - Sample Response:
    ```json
    {
      "success": true,
      "count": 15,
      "data": [
        {
          "id": "central-library",
          "name": "HITS Central Library & Research Centre",
          "category": "Facility",
          "type": "Facility",
          "description": "Central University Library, Digital Hub & Research Centre",
          "lat": 12.80092,
          "lng": 80.22485
        }
      ]
    }
    ```

- **`GET /api/locations/:id`**
  - Returns a single campus location by ID (e.g. `/api/locations/founders-block`).

### Route Directions
- **`POST /api/routes`**
  - Request Body:
    ```json
    {
      "origin": { "lat": 12.79892, "lng": 80.22815 },
      "destination": { "lat": 12.80092, "lng": 80.22485 },
      "travelMode": "WALK"
    }
    ```
  - Response:
    ```json
    {
      "success": true,
      "data": {
        "distanceMeters": 450,
        "durationSeconds": 360,
        "encodedPolyline": "...",
        "steps": [...]
      }
    }
    ```

---

## 🔗 Connected Frontend
This service acts as the backend data and routing engine for the **[collegeNavigatorFrontend](https://github.com/Praveenkumar1207/collegeNavigatorFrontend)** React application.

---

## 📄 License
This project is open-source under the [ISC License](package.json).
