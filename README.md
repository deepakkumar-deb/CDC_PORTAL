# 🎓 CDC Portal — IIT (ISM) Dhanbad

> **Career Development Centre Recruitment Portal** — A full-stack web application for managing Job Notification Forms (JNF), Internship Notification Forms (INF), company registrations, and alumni mentorship at IIT (ISM) Dhanbad.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup (Laravel)](#backend-setup-laravel)
  - [Frontend Setup (Next.js)](#frontend-setup-nextjs)
- [Environment Variables](#environment-variables)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)

---

## Overview

The **CDC Portal** is a modern recruitment management system built for the Career Development Centre at IIT (ISM) Dhanbad. It streamlines the end-to-end recruitment process — from company onboarding and form submission to admin approval workflows and placement slot scheduling.

Key highlights:
- 🤖 **AI-powered PDF extraction** using Gemini API for auto-filling JNF/INF forms
- 🔐 **Role-based access control** — Admin, Company (Recruiter), and Alumni roles
- 📄 **JNF & INF management** with multi-stage approval workflows
- 📬 **Email notifications** at every stage of the recruitment process
- 🧑‍🎓 **Alumni Mentor module** for connecting students with alumni
- 📊 **Admin dashboard** with placement statistics and slot management

---

## Features

### 👔 For Companies (Recruiters)
- Register and manage company profile
- Submit **Job Notification Forms (JNF)** with detailed salary, eligibility, and selection round info
- Submit **Internship Notification Forms (INF)** with stipend and project details
- AI-assisted PDF-to-form auto-fill for JNF and INF
- Request edits on submitted forms
- View form approval status in real time

### 🛡️ For Admins (CDC Staff)
- Approve / reject JNFs and INFs with remarks
- Manage placement slots and assign JNFs to slots
- View and manage all company registrations
- Access placement statistics
- Manage alumni mentor registrations

### 🎓 For Alumni
- Register as a mentor with professional details
- Connect with current students for guidance

### 🔒 Authentication
- Email + password login with OTP verification
- Session management via Laravel Sanctum
- NextAuth.js on the frontend

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript |
| **UI Library** | MUI (Material UI) v6 |
| **Auth (Frontend)** | NextAuth.js v4 |
| **HTTP Client** | Axios |
| **Form Management** | React Hook Form |
| **Backend** | Laravel 12 (PHP 8.2+) |
| **Auth (Backend)** | Laravel Sanctum |
| **Database** | SQLite (dev) / MySQL (prod) |
| **PDF Generation** | Laravel DomPDF |
| **PDF Parsing** | smalot/pdfparser |
| **AI Extraction** | Google Gemini API |
| **Mail** | Laravel Mail (SMTP) |

---

## Project Structure

```
cdc_portal/
├── backend/               # Laravel 12 REST API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       ├── AuthController.php         # Auth, OTP, profile
│   │   │       ├── JnfController.php          # JNF CRUD & approval
│   │   │       ├── InfController.php          # INF CRUD & approval
│   │   │       ├── CompanyController.php      # Company management
│   │   │       ├── AdminController.php        # Admin dashboard & slots
│   │   │       ├── AlumniMentorController.php # Alumni mentorship
│   │   │       ├── ExtractionController.php   # AI PDF extraction
│   │   │       └── MetadataController.php     # Departments, programs
│   │   └── Models/                            # Eloquent models
│   ├── database/
│   │   └── migrations/                        # 39 DB migrations
│   └── routes/
│       └── api.php                            # API route definitions
│
└── frontend/              # Next.js 16 App Router
    └── src/
        ├── app/
        │   ├── page.tsx                       # Landing page
        │   ├── auth/                          # Login & Register
        │   ├── dashboard/                     # Company dashboard
        │   ├── jnf/                           # JNF list, create, view
        │   ├── inf/                           # INF list, create, view
        │   ├── admin/                         # Admin panel
        │   └── alumni-mentor/                 # Alumni mentor page
        ├── components/                        # Reusable UI components
        ├── lib/                               # API helpers & auth config
        └── types/                             # TypeScript interfaces
```

---

## Getting Started

### Prerequisites

- **PHP** >= 8.2
- **Composer**
- **Node.js** >= 18
- **npm**
- **SQLite** (for development) or **MySQL** (for production)
- **Gemini API Key** (optional, for AI PDF extraction) — [aistudio.google.com](https://aistudio.google.com/apikey)

---

### Backend Setup (Laravel)

```bash
# 1. Navigate to backend
cd backend

# 2. Install PHP dependencies
composer install

# 3. Copy and configure environment
cp .env.example .env

# 4. Generate application key
php artisan key:generate

# 5. Run database migrations
php artisan migrate

# 6. Start the development server
php artisan serve
```

The backend API will be available at `http://localhost:8000`.

> **Optional — AI Extraction**: Add your Gemini API key to `backend/.env` to enable PDF autofill:
> ```env
> GEMINI_API_KEY=your_gemini_api_key_here
> ```
> Get a free key at [aistudio.google.com](https://aistudio.google.com/apikey)

---

### Frontend Setup (Next.js)

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Copy and configure environment
cp .env.local.example .env.local
# Edit .env.local with your values (see below)

# 4. Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`.

---

## Environment Variables

### Backend — `backend/.env`

```env
APP_NAME="CDC Portal"
APP_URL=http://localhost:8000

# Database (SQLite for dev)
DB_CONNECTION=sqlite

# Mail configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="CDC IIT(ISM)"
```

### Frontend — `frontend/.env.local`

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/register` | Company registration |
| `POST` | `/api/login` | Login & get token |
| `POST` | `/api/verify-otp` | OTP verification |
| `GET` | `/api/jnf` | List all JNFs |
| `POST` | `/api/jnf` | Create new JNF |
| `GET` | `/api/jnf/{id}` | Get JNF details |
| `PUT` | `/api/jnf/{id}` | Update JNF |
| `POST` | `/api/jnf/{id}/approve` | Approve JNF (admin) |
| `GET` | `/api/inf` | List all INFs |
| `POST` | `/api/inf` | Create new INF |
| `PUT` | `/api/inf/{id}` | Update INF |
| `POST` | `/api/inf/{id}/approve` | Approve INF (admin) |
| `POST` | `/api/extract-pdf` | AI PDF data extraction |
| `GET` | `/api/admin/slots` | Get placement slots |
| `GET` | `/api/metadata/departments` | Get departments list |
| `GET` | `/api/alumni-mentors` | List alumni mentors |

---

## Database Schema

The application uses **39 migrations** covering:

- `users` — Auth users (company/admin/alumni)
- `companies` + `company_contact_details` — Company profiles
- `jnfs` — Job Notification Forms (with skills, programs, categories, CGPA, salary, attachments)
- `inf_details` — Internship Notification Forms (with stipend breakdowns, perks)
- `selection_rounds` + `selection_infrastructure` — Hiring process details
- `eligibility_rules` — Department-wise CGPA cutoffs
- `placement_slots` + `slot_jnfs` — Slot scheduling
- `approval_history` — Audit trail for approvals/rejections
- `alumni_mentors` — Alumni mentor registrations
- `otp_verifications` — Email OTP records
- `notifications` — In-app notifications

---

<p align="center">Made with ❤️ at IIT (ISM) Dhanbad</p>
