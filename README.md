# SweetFlow – Smart Sweet Shop Management System

Full-stack sweet shop management application built with NestJS, React, and MongoDB.

## 🚀 Quick Start

### 1. Setup MongoDB Atlas

Follow: `MONGODB_ATLAS_SETUP.md`

### 2. Backend Setup

```bash
cd backend
npm install
# Create .env file (see SETUP.md)
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run start:dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📋 Features

- User authentication (JWT)
- Role-based access (USER/ADMIN)
- Sweet inventory management
- Search and filter
- Purchase functionality
- Admin dashboard

## 🔐 Default Admin

- Email: `admin@sweetflow.com`
- Password: `admin123`

## 🛠️ Tech Stack

- **Backend**: NestJS + TypeScript + MongoDB + Prisma
- **Frontend**: React + TypeScript + Vite + Tailwind CSS

## 📚 Documentation

- **Setup Guide**: `SETUP.md`
- **MongoDB Atlas Setup**: `MONGODB_ATLAS_SETUP.md`

---

**Built with ❤️**
