# CDC Portal - Career Development Centre

A comprehensive Recruitment and Internship management portal designed for smooth coordination between companies, students, and the Career Development Centre. This project features AI-powered form extraction, professional PDF generation, and a modern mentorship dashboard.

## 🚀 Features

- **JNF/INF Management**: Streamlined Job Notification Form (JNF) and Internship Notification Form (INF) submission and tracking.
- **AI-Powered Autofill**: Integration with Google Gemini API to automatically extract company details from uploaded PDFs.
- **Dynamic PDF Generation**: Generate professional, formatted JNF/INF documents directly from the portal.
- **Alumni Mentorship**: A dedicated platform for students to connect with alumni mentors.
- **Multi-Role Access**: Tailored dashboards for Admin, Recruiters, and Students.
- **Responsive Design**: Built with a mobile-first approach using Next.js and Material UI.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Material UI (MUI) & Vanilla CSS
- **State Management**: React Hooks & Context API
- **Forms**: React Hook Form
- **Networking**: Axios

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8.2+
- **Database**: MySQL
- **AI Integration**: Google Gemini AI (Vertex AI/Generative AI SDK)
- **Authentication**: Laravel Sanctum

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- PHP (v8.2+)
- Composer
- MySQL Server

### 1. Clone the Repository
```bash
git clone https://github.com/deepakkumar-deb/CDC_PORTAL.git
cd CDC_PORTAL
```

### 2. Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=0.0.0.0 --port=8000
```
*Note: Update the `.env` file with your Database credentials and Gemini API Key.*

### 3. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env.local
npm run dev
```
*Note: Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your backend IP (e.g., `http://localhost:8000/api`).*

## 🌐 Local Network Access (Mobile)
To access the portal on a mobile device connected to the same Wi-Fi:
1. Find your local IP address using `ipconfig` (Windows) or `ifconfig` (Mac/Linux).
2. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_API_URL` in `frontend/.env.local` to use your IP.
3. Update `allowedDevOrigins` in `frontend/next.config.ts`.
4. Ensure the backend is started with `php artisan serve --host=0.0.0.0`.
5. Access via `http://<your-ip>:3000` on your mobile phone.

## 📄 License
This project is proprietary and intended for institutional use.

---
*Developed with ❤️ for the Career Development Centre.*
