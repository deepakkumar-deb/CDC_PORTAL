# CDC Portal — Frontend (Next.js)

## Tech Stack

- Next.js (App Router)
- MUI v6.5
- NextAuth.js
- TypeScript

## Setup

```bash
npm install
cp .env.local.example .env.local
# Fill in .env.local values
npm run dev
```

## Environment Variables

## Pages

| Route                | Description             |
| -------------------- | ----------------------- |
| `/auth/login`        | Recruiter login         |
| `/auth/register`     | OTP registration wizard |
| `/dashboard`         | Recruiter dashboard     |
| `/dashboard/company` | Company profile         |
| `/jnf/new`           | Create new JNF          |
| `/inf/new`           | Create new INF          |
| `/admin`             | Admin panel             |
