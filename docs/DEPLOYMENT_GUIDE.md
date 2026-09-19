# Nyayavanta: Production & Local Deployment Guide

> **Stack**: Python 3.14 + FastAPI + PostgreSQL/SQLite (Backend) & React 19 + Vite + TypeScript (Frontend)

---

## 1. Prerequisites
- **Python**: 3.11+ (Python 3.14 supported)
- **Node.js**: v18+ (Node v24 supported) with `npm`
- **Optional**: PostgreSQL instance (if not specified, system defaults to SQLite `nyayavanta.db`)
- **Optional**: `GEMINI_API_KEY` for live generative responses (falls back automatically to statutory knowledge synthesis if absent)

---

## 2. Environment Configuration

Create a `.env` file in the project root:
```env
PROJECT_NAME="Nyayavanta"
SECRET_KEY="your-secure-jwt-secret-key-here"
DATABASE_URL="sqlite:///./nyayavanta.db"
# Or for PostgreSQL:
# DATABASE_URL="postgresql://nyayavanta_user:password@localhost:5432/nyayavanta_db"
GEMINI_API_KEY=""
```

---

## 3. Running the Backend Server

1. Install Python dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Start the FastAPI development server:
   ```bash
   python backend/run.py
   ```
   - The backend runs at `http://localhost:8000`
   - Interactive Swagger API docs are available at `http://localhost:8000/docs`
   - Database tables and initial Indian legal corpus are seeded automatically on first startup.

3. Run Backend Automated Tests:
   ```bash
   python -m pytest backend/tests/ -v
   ```

---

## 4. Running the Frontend Server

1. Install Node dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
   - Access the platform at `http://localhost:3000`
   - All `/api` requests are automatically proxied to the FastAPI server on port 8000.

3. Build Production Bundle:
   ```bash
   npm run build
   ```

---

## 5. Dockerized Deployment (Optional)

### `Dockerfile.backend`
```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ backend/
EXPOSE 8000
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### `Dockerfile.frontend`
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
