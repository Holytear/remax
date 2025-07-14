#  RE/MAX Türkiye Case Study

## Overview
A full-stack web application featuring:
- **Responsive Next.js frontend** (with Tailwind CSS)
- **FastAPI backend** (with SQLite database)
- **User management** (list, detail, create, login)
- **Products page** (CRUD, favorites, chatbot)
- **Chatbot** for product Q&A and small talk
- **Dockerized** for easy setup and deployment

---

##  Project Structure
```
frontend/   # Next.js app (TypeScript, Tailwind CSS)
backend/    # FastAPI app (SQLite, SQLAlchemy)
docker-compose.yml
README.md
```

---

##  Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Python](https://www.python.org/) (v3.10 or higher recommended)
- [Docker Desktop](https://www.docker.com/products/docker-desktop) (for Dockerized setup)
- [Git](https://git-scm.com/) (for cloning the repository)

---

##  Quick Start (with Docker)

1. **Clone this repository:**
   ```sh
   git clone <your-repo-url>
   cd <your-repo-folder>
   ```
2. **Run the app:**
   ```sh
   docker compose up --build
   ```
3. **Access the app:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API/Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

---

##  Manual Setup (Development Mode)

### 1. Frontend (Next.js)
```sh
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

### 2. Backend (FastAPI)
```sh
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
# Visit http://localhost:8000/docs
```

---

##  Configuration

### Environment Variables
- **Frontend:** No environment variables required for local/dev use.
- **Backend:** No environment variables required for local/dev use. SQLite DB is created as `backend/products.db` by default.

> **Note:** For production, you may want to set environment variables for database URL, allowed origins, etc.

---

##  Features
- **User List:** Paginated, colored buttons, detail view
- **Create User:** Modal form, API integration
- **Login:** Modal form, token storage
- **Products:** Add, edit, delete, favorite, list
- **Chatbot:** Product Q&A, small talk
- **OpenAPI Docs:** `/docs` on backend
- **Mobile-first, animated UI**

---

##  Docker Compose Reference
- `frontend` (Next.js): http://localhost:3000
- `backend` (FastAPI): http://localhost:8000
- Data persists in `backend/products.db`

---

##  API Endpoints
### Users (external API)
- `GET https://reqres.in/api/users`
- `GET https://reqres.in/api/users/{id}`
- `POST https://reqres.in/api/users`
- `POST https://reqres.in/api/login`
- `GET https://reqres.in/api/unknown` (button colors)

### Products (local API)
- `GET /products`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`
- `POST /products/{id}/favorite`
- `POST /chatbot` (Q&A, small talk)

---

##  Responsive Design
- Mobile-first, works from 320px to 1440px+
- Animations: hover, skeletons, transitions

---

##  Running Tests

### Frontend
- (Add your test instructions here, e.g., `npm test` if tests are implemented)

### Backend
- (Add your test instructions here, e.g., `pytest` if tests are implemented)

---

## 🆘 Troubleshooting
- **Docker build fails:** Ensure Docker Desktop is running and in Linux container mode.
- **Port already in use:** Stop any other apps using ports 3000 or 8000.
- **Database issues:** Delete `backend/products.db` to reset the local DB (data will be lost).
- **CORS errors:** Ensure both frontend and backend are running on the correct ports.
