# Lyys Store

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5-0170FE?logo=ant-design)
![NextAuth](https://img.shields.io/badge/Auth-NextAuth.js-000000)
![License](https://img.shields.io/badge/license-MIT-blue)

**A modern full-stack e-commerce platform built with Next.js, NestJS, MongoDB, and TypeScript.**

</div>

---

# Table of Contents

- Overview
- Features
- Tech Stack
- Architecture
- Project Structure
- Screenshots
- Installation
- Environment Variables
- Running the Project
- Build for Production
- Deployment
- Authentication
- File Upload System
- Database Schema
- API Modules
- Frontend Features
- Future Improvements
- Contributing
- License

---

# Overview

Lyys Store is a full-stack e-commerce application designed with scalability, maintainability, and modern development practices in mind.

The project consists of two independent applications:

- **Frontend** built with Next.js 16 (App Router)
- **Backend** built with NestJS 11
- **MongoDB Atlas** as the database
- **NextAuth.js** for authentication
- **Ant Design** for the administration dashboard

The application provides both a customer-facing storefront and a powerful administration system for managing products, users, categories, uploads, and orders.

---

# Features

## Customer

- User Registration
- Login / Logout
- Google Login
- Facebook Login
- Product Browsing
- Product Details
- Shopping Cart
- Quantity Management
- Search Products
- Product Categories
- Responsive UI
- Persistent Cart
- Session Authentication

---

## Admin Dashboard

- Dashboard
- User Management
- Role Management
- Permission Management
- Product Management
- Category Management
- Upload Management
- Image Preview
- Folder Upload
- File Upload
- Search
- Filters
- Pagination
- CRUD Operations

---

## Authentication

Supports:

- Credentials Login
- Google OAuth
- Facebook OAuth
- JWT Session
- Protected Routes
- Role-based Authorization

---

## Upload System

Advanced upload manager including:

- Upload Images
- Upload Files
- Upload Entire Folder
- Image Preview
- Product Image Assignment
- File Search
- Entity Filter
- Folder Tree
- Toolbar Actions
- Delete Files
- Upload Progress

---

# Tech Stack

## Frontend

- Next.js 16
- React
- TypeScript
- Ant Design
- Axios
- NextAuth.js
- React Hook Form
- React Context
- SCSS

---

## Backend

- NestJS
- TypeScript
- Mongoose
- MongoDB Atlas
- JWT
- Passport
- Multer
- Serve Static
- Class Validator
- Swagger

---

## Database

MongoDB Atlas

Collections include:

- Users
- Roles
- Permissions
- Products
- Categories
- Uploads
- Carts
- Orders

---

# Architecture

```
                    Client
                       │
                       ▼
              Next.js Frontend
                       │
          REST API (Axios)
                       │
                       ▼
               NestJS Backend
                       │
                Mongoose ODM
                       │
                       ▼
                MongoDB Atlas
```

---

# Project Structure

```
lyys-store/

├── frontend/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── layouts/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   └── utils/
│
├── backend/
│
├── src/
│   ├── auth/
│   ├── users/
│   ├── roles/
│   ├── permissions/
│   ├── products/
│   ├── categories/
│   ├── uploads/
│   ├── carts/
│   ├── orders/
│   ├── database/
│   └── common/
│
└── README.md
```

---

# Screenshots

You can place screenshots here.

```
docs/

home.png

product-details.png

cart.png

admin-dashboard.png

upload-manager.png
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/lyys-store.git
```

```
cd lyys-store
```

---

## Install Frontend

```bash
cd frontend

npm install
```

---

## Install Backend

```bash
cd backend

npm install
```

---

# Environment Variables

## Backend

Create:

```
backend/.env
```

```env
PORT=8080

MONGODB_URI=

JWT_SECRET=

NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

FRONTEND_URL=http://localhost:3000
```

---

## Frontend

Create

```
frontend/.env.local
```

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080

NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET=
```

---

# Running the Project

## Backend

```bash
npm run start:dev
```

Runs on

```
http://localhost:8080
```

---

## Frontend

```bash
npm run dev
```

Runs on

```
http://localhost:3000
```

---

# Build for Production

Frontend

```bash
npm run build
```

```bash
npm run start
```

Backend

```bash
npm run build
```

```bash
npm run start:prod
```

---

# Deployment

Frontend

- Vercel
- Render

Backend

- Render

Database

- MongoDB Atlas

---

# Authentication Flow

```
Login

↓

NextAuth

↓

JWT Session

↓

Protected Route

↓

REST API

↓

NestJS Guard

↓

MongoDB
```

---

# File Upload System

Supported Features

- Image Upload
- Multiple Upload
- Folder Upload
- Product Images
- Preview Images
- Search
- Filter by Entity
- Folder Tree
- Delete
- Pagination

Upload directory

```
uploads/

products/

avatars/

categories/
```

---

# Database Schema

## User

```
_id
email
password
name
role
avatar
createdAt
updatedAt
```

---

## Product

```
_id
name
slug
description
price
stock
category
images
createdAt
updatedAt
```

---

## Category

```
_id
name
slug
description
```

---

## Upload

```
_id
filename
originalName
path
url
mimeType
size
entity
createdBy
createdAt
```

---

## Cart

```
_id
user
items
totalPrice
totalQuantity
```

---

# Backend Modules

- Auth Module
- User Module
- Role Module
- Permission Module
- Product Module
- Category Module
- Upload Module
- Cart Module
- Order Module

---

# Frontend Pages

Public

- Home
- Products
- Product Details
- Categories
- Login
- Register
- Cart

Admin

- Dashboard
- Users
- Roles
- Permissions
- Products
- Categories
- Uploads
- Orders

---

# API Features

- RESTful API
- JWT Authentication
- Role Guards
- Validation Pipe
- DTO Validation
- Pagination
- Search
- Filter
- File Upload
- Image Serving

---

# Security

- JWT Authentication
- Password Hashing
- Route Guards
- Role-based Access Control
- DTO Validation
- Input Sanitization
- Environment Variables

---

# Performance

- Server-side Rendering
- Static Rendering
- Image Optimization
- Lazy Loading
- Pagination
- MongoDB Indexing

---

# Future Improvements

- Wishlist
- Product Reviews
- Coupons
- Online Payments
- Order Tracking
- Email Verification
- Password Reset
- Notification System
- Inventory Analytics
- Multi-language
- Dark Mode
- Docker Support
- CI/CD Pipeline
- Unit Testing
- E2E Testing

---

# Contributing

Contributions are welcome.

1. Fork the repository

2. Create a new branch

```bash
git checkout -b feature/my-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to your branch

```bash
git push origin feature/my-feature
```

5. Open a Pull Request

---

# License

This project is licensed under the MIT License.

---

<div align="center">

Made with ❤️ using

Next.js • NestJS • MongoDB • TypeScript

</div>
