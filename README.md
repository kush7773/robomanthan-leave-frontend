# Robomanthan Leave Management System – Frontend

This repository contains the frontend application for the Robomanthan Leave & Employee Management System. The application is built using Next.js (App Router) and provides secure, role-based dashboards for Employees and Employers with a responsive user interface.

---

## Tech Stack

- Next.js (App Router)
- React
- JavaScript
- CSS
- JWT-based Authentication
- react-hot-toast for notifications

---

## Features

Authentication:
- Employee and Employer login
- Forgot password and reset password flow
- Secure session handling using cookies and browser storage
- Middleware-based route protection

Employee Module:
- Dashboard with leave balance cards
- Apply for leave
- View leave history
- Profile management
- Responsive UI for mobile and desktop

Employer Module:
- Dashboard overview
- Manage employees
- Approve and reject leave requests
- Attendance calendar
- Reports with CSV downloads
- Add new employees

Reports:
- Employee list export (CSV)
- Leave history export (CSV)
- Daily absentees export (CSV)

---

## Project Structure

robomanthan-frontend/
├── app/
│   ├── login/
│   ├── employee/
│   │   ├── profile/
│   │   └── components/
│   ├── employer/
│   │   ├── add-employee/
│   │   ├── employees/
│   │   └── components/
│   ├── forgot-password/
│   ├── reset-password/
│   ├── layout.js
│   └── page.js
├── public/
│   └── logo.png
├── services/
│   └── auth.js
├── utils/
│   ├── auth.js
│   └── api.js
├── middleware.js
├── package.json
├── package-lock.json
└── README.md

---

## Environment Setup

Create a file named .env.local in the project root and add:

NEXT_PUBLIC_API_URL=http://localhost:4000

Replace the URL with your backend IP address or domain when testing on another device or deploying to production.

---

## Running the Project Locally

npm install  
npm run dev  

Open in browser:  
http://localhost:3000

---

## Production Build

npm run build  
npm run start  

---

## Route Protection

Public routes:
- /login
- /forgot-password
- /reset-password

Protected routes:
- /employee/*
- /employer/*

Route protection is implemented using Next.js middleware and authentication cookies.

---

## Collaboration Setup

git clone https://github.com/Ojas-Sinha/robomanthan-leave-management-system-frontend.git  
cd robomanthan-leave-management-system-frontend  
npm install  

Create .env.local and set:

NEXT_PUBLIC_API_URL=http://<backend-ip>:4000

Start the app:

npm run dev

---

## Author

Robomanthan Leave Management System – Frontend  
Developed by Ojas Sinha
