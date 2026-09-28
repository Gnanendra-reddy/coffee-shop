# ☕ Artisan Roast — Full-Stack Craft Coffee E-Commerce Platform

A production-ready, full-stack coffee ordering and shop management web application built with **FastAPI**, **React (Vite + Tailwind CSS)**, **PostgreSQL / SQLAlchemy**, and containerized with **Docker & Docker Compose**.

---

## 🌟 Key Features

### ☕ Customer Experience
- **Interactive Coffee Menu:** Browse artisanal brews, single-origin pour-overs, nitro cold brews, espresso specialties, and freshly baked pastries.
- **Search & Real-time Filters:** Search by title/origin, filter by roast category, filter by price range, and sort by price, name, or popularity.
- **Coffee Details & Customer Reviews:** View detailed roast descriptions, tasting notes, star ratings, and leave reviews.
- **Cart & Slide-Over Drawer:** Real-time quantity adjustments, price calculations, and promo code support.
- **Discount Promo Coupons:** Apply discount coupons (e.g. `WELCOME20`, `COFFEE10`, `FLAT5`) with instant discount previews.
- **Checkout & Simulated Payments:** Support for Card, Digital Wallet (Apple Pay / UPI), and Cash on Delivery with celebration animations.
- **Order Tracking & Audit History:** Real-time order status tracking (`Pending`, `Processing`, `Completed`, `Cancelled`) with complete audit trails and cancellation support.
- **Wishlist & Saved Favorites:** Save favorite blends and move them to cart individually or in bulk.
- **User Authentication:** Secure JWT-based registration, login, profile management, and password updates.

### 👑 Admin Management Dashboard
- **Business KPI Analytics:** Real-time revenue tracking, lifetime order count, registered customer metrics, and average order value (AOV).
- **Top Roasts Breakdown:** Best-selling coffee analytics and highest customer-rated blends.
- **Inventory & Product Catalog Manager:** Add new coffee items, edit pricing/descriptions, set stock levels, and quick restock with low-stock alerts.
- **Order Processing:** View all customer orders and update status progression (`Pending` ➔ `Processing` ➔ `Completed` ➔ `Cancelled`).
- **User Accounts Administration:** Monitor registered accounts, toggle active/deactivation status, and manage role permissions (`admin` / `customer`).
- **Voucher Generator:** Create custom percentage or flat discount promo codes with expiry limits.

---

## 🏗️ Architecture & Tech Stack

```
coffee-shop/
├── backend/                  # FastAPI Application
│   ├── app/
│   │   ├── api/              # API Route Controllers
│   │   ├── core/             # Security, JWT, Error handlers
│   │   ├── db/               # Database Engine & Session
│   │   ├── models/           # SQLAlchemy ORM Models
│   │   ├── schemas/          # Pydantic Schemas & Validation
│   │   ├── services/         # Business Logic Layer
│   │   └── main.py           # FastAPI Application Entry
│   ├── tests/                # Pytest Test Suite
│   ├── Dockerfile            # Multi-stage Python 3.13 Slim Image
│   ├── seed_data.py          # Database Seeder Script
│   └── requirements.txt      # Python Dependencies
├── frontend/                 # React SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/       # UI Components (Menu, Modals, Admin, Cart, etc.)
│   │   ├── context/          # State Contexts (Auth, Cart, Wishlist, Toast)
│   │   ├── services/         # Axios API Client
│   │   ├── App.jsx           # Main Router & Coordinator
│   │   └── main.jsx          # React DOM Root
│   ├── Dockerfile            # Multi-stage Node.js Build + Nginx Alpine Runner
│   ├── nginx.conf            # Nginx Web Server & SPA Fallback
│   └── package.json          # Frontend Dependencies
├── compose.yaml              # Docker Compose Full-Stack Orchestration
├── .env.example              # Environment Variable Template
└── README.md                 # Documentation
```

### Technologies Used
- **Frontend:** React 18, Vite, Tailwind CSS, Lucide React, Axios, Canvas Confetti.
- **Backend:** Python 3.13, FastAPI, SQLAlchemy 2.0, Pydantic V2, Uvicorn, Python-Jose (JWT), Passlib (Bcrypt).
- **Database:** PostgreSQL 17 (production/docker) / SQLite (local unit tests).
- **Containerization:** Docker, Docker Compose, Multi-stage builds, Nginx.

---

## 🚀 Quick Start with Docker Compose (Recommended)

Run the entire fullstack stack (Database + Backend + Frontend) in one command:

### 1. Clone the repository & copy environment variables
```bash
cp .env.example .env
```

### 2. Launch the services
```bash
docker compose up --build -d
```

### 3. Seed initial sample menu and accounts
```bash
docker compose exec backend python seed_data.py
```

### 4. Access the applications
- 🌐 **Frontend Web App:** [http://localhost:3000](http://localhost:3000)
- ⚡ **Backend REST API:** [http://localhost:8000](http://localhost:8000)
- 📖 **Interactive Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
- 🗄️ **PostgreSQL Database:** `localhost:5432`

---

## 🔑 Demo Credentials

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@coffeeshop.com` | `Admin@123` | Full Admin Dashboard, Catalog, Orders, Inventory, Users |
| **Customer** | `customer@coffeeshop.com` | `Customer@123` | Browse Menu, Place Orders, Reviews, Wishlist, Profile |

*(Quick-fill demo buttons are also built directly into the frontend Sign In modal for 1-click access!)*

---

## 💻 Manual Local Development Setup

If you prefer to run the backend and frontend locally without Docker:

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# On macOS / Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database seeder (uses local DB configured in .env)
python seed_data.py

# Start FastAPI server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start Vite development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Running Automated Tests

Run backend pytest test suite:

```bash
cd backend
pytest -v
```

---

## 📦 Docker Best Practices & Suggested Improvements

Here are the key optimizations implemented in the Docker configuration:

1. **UTF-8 Encoded `requirements.txt`:** Prevents `UnicodeDecodeError` in Linux container builds.
2. **Multi-Stage Builds:**
   - **Backend:** A `builder` stage prepares dependencies into `/opt/venv`, and a slim `runtime` stage contains only required wheels and application code.
   - **Frontend:** A `node:20-alpine` stage builds static assets (`npm run build`), which are copied to a lightweight `nginx:alpine` image with gzip compression and caching headers.
3. **Least-Privilege Security:** The backend runs under an unprivileged user (`appuser`) rather than `root`.
4. **Healthchecks:** Native health checks in `backend` (`/health`), `db` (`pg_isready`), and `frontend` ensure dependent services only start when prerequisites are fully healthy.
5. **Configurable Environment Variables:** All database passwords, tokens, and CORS domains are extracted into `.env` instead of hardcoded strings.

---

## 📤 How to Push this Project to GitHub

Follow these steps to publish this repository to your GitHub account:

### 1. Initialize Git (if not already initialized)
Open a terminal in the root directory `coffee-shop/`:

```bash
# Initialize local git repository
git init
```

### 2. Stage and Commit the Files
```bash
# Stage all files (.gitignore automatically excludes venv, node_modules, and dist)
git add .

# Create initial commit
git commit -m "feat: complete full-stack coffee shop system with FastAPI, React, and Docker"
```

### 3. Create a New Repository on GitHub
1. Go to [GitHub.com](https://github.com) and log in.
2. Click the **`+`** icon in the top right corner and select **New repository**.
3. Name your repository (e.g. `coffee-shop` or `artisan-roast-coffee`).
4. Choose **Public** or **Private**.
5. **Do NOT** check "Add a README file", "Add .gitignore", or "Choose a license" (we already created them).
6. Click **Create repository**.

### 4. Link Remote and Push
Copy the remote repository URL from GitHub and run:

```bash
# Rename the default branch to main
git branch -M main

# Add your GitHub repository as remote origin (replace with your URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY_NAME>.git

# Push your code to GitHub
git push -u origin main
```

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.