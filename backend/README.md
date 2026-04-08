# CDC Portal — Backend (Laravel 12)

Recruitment portal for IIT (ISM) Dhanbad — Career Development Centre.

## Tech Stack
- Laravel 12
- MySQL
- Laravel Sanctum (API Auth)
- PHP 8.2

## Setup
```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed
php artisan storage:link
php artisan serve
```

## API Base URL
`http://localhost:8000/api`

## Admin Login
Email: `deepakksingh209@gmail.com`
Password: `admin@123`

## Team
| Member | Role |
|--------|------|
| Member 1 | Team Lead / DB Schema |
| Member 2 | Auth API |
| Member 3 | JNF / INF API |
| Member 4 | Frontend Auth |
| Member 5 | Frontend Forms |