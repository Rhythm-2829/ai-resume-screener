# 🎯 AI Resume Screener — Full-Stack ATS Evaluation Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-LLaMA%20%2F%20GPT--OSS-f55036?style=for-the-badge)](https://groq.com/)
[![Railway](https://img.shields.io/badge/Deployed%20on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

An end-to-end, production-grade **AI Resume Screener and ATS (Applicant Tracking System) Optimizer**. Job seekers and recruiters can upload PDF resumes, paste job descriptions, and receive real-time, LLM-powered evaluation reports with **ATS match scores**, **strengths assessment**, **missing skill gaps**, and **actionable bullet point rewrites**.

---

## 🌐 Live Demos

- **Frontend Web Application (Vercel):** [https://ai-resume-screener-beryl.vercel.app](https://ai-resume-screener-beryl.vercel.app)
- **Backend REST API (Railway):** [https://ai-resume-screener-production-4d74.up.railway.app](https://ai-resume-screener-production-4d74.up.railway.app)
- **API Health Endpoint:** [https://ai-resume-screener-production-4d74.up.railway.app/api/health](https://ai-resume-screener-production-4d74.up.railway.app/api/health)

---

## ✨ Key Features

- **🔐 Stateless JWT Authentication**: Secure user registration and login with BCrypt password hashing, Spring Security 7 filter chains, and protected API routes.
- **📄 In-Memory PDF Parsing**: High-performance text extraction from uploaded resume documents using **Apache PDFBox 3.x**.
- **🤖 Structured LLM Inference (Groq)**: Strict JSON schema prompting to extract match scores (0–100%), strengths, skill deficiencies, and bullet point rewrites within 4–8 seconds.
- **🛡️ Daily Rate Limiting & Quotas**: Built-in cost governance and token protection limiting users to **5 AI analyses per day**, backed by automated midnight timestamp resets and live frontend progress meters.
- **📊 Interactive Candidate Dashboard**: View historical evaluations, search past screenings by keywords, and track candidate ATS improvement over time.
- **⚡ Bullet Rewriter Studio**: 1-click clipboard copy of improved bullet points directly tailored to keywords in the target job description.
- **🎨 Modern SaaS Design**: Responsive interface built with React 19, custom design tokens, Lucide icons, and animated SVG radial gauges.

---

## 🏗️ Architecture & Data Flow

```
[ Candidate / Recruiter ]
          │
          ▼
┌─────────────────────────────────────────────────┐
│     React 19 + Vite Frontend (Vercel)           │
│  - JWT Bearer Interceptors                      │
│  - Interactive Drag-and-Drop Dropzone           │
│  - Radial SVG ATS Match Gauge                   │
│  - Daily Quota Tracking Progress Bar            │
└───────────────────────┬─────────────────────────┘
                        │ HTTPS / REST (CORS Whitelisted)
                        ▼
┌─────────────────────────────────────────────────┐
│     Spring Boot 4.x Backend (Railway)           │
│  - JwtAuthFilter (OncePerRequestFilter)         │
│  - SecurityConfig (BCrypt, Stateless Session)   │
│  - Apache PDFBox Text Extraction                │
│  - Rate Limiter & Quota Service (5/day/user)    │
└──────────────┬──────────────────┬───────────────┘
               │                  │
               ▼                  ▼
┌─────────────────────────┐  ┌─────────────────────────┐
│  PostgreSQL (Railway)   │  │   Groq Cloud LLM API    │
│  - users table          │  │   - High-throughput     │
│  - resumes table (TEXT) │  │     inference           │
│  - analyses table (JSON)│  │   - Structured JSON ATS │
└─────────────────────────┘  │     analysis response   │
                             └─────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Spring Boot 4.1.1 / Spring Framework 7
- **Security**: Spring Security 7, JJWT (0.12.6) for stateless token management, BCrypt
- **ORM / Database**: Spring Data JPA, Hibernate 7, PostgreSQL 16
- **PDF Engine**: Apache PDFBox 3.0.1
- **JSON Serialization**: Jackson Databind

### Frontend
- **Framework**: React 19, React Router DOM 7
- **Bundler & Tooling**: Vite 8
- **Networking**: Axios with request/response authorization interceptors
- **Icons & Styling**: Lucide React, Custom Plus Jakarta Sans design system

### Cloud & AI
- **LLM Engine**: Groq Cloud API (`openai/gpt-oss-120b` / `llama3-70b-8192`)
- **Hosting**: Railway (Spring Boot + Managed PostgreSQL), Vercel (React Frontend)

---

## 📡 REST API Reference

All protected endpoints require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register user, hashes password, returns JWT |
| `POST` | `/api/auth/login` | Public | Authenticates credentials, returns JWT |
| `GET` | `/api/health` | Public | Railway health check probe (`{"status":"UP"}`) |
| `POST` | `/api/resumes/upload` | Authenticated | Multipart upload of PDF resume, parses text |
| `GET` | `/api/resumes` | Authenticated | List all resumes uploaded by current user |
| `POST` | `/api/analysis/run` | Authenticated | Evaluates resume against JD with Groq AI (Rate limited) |
| `GET` | `/api/analysis/quota` | Authenticated | Returns current user's daily quota `{used, limit, remaining}` |
| `GET` | `/api/analysis/history` | Authenticated | Retrieve user's past ATS evaluations in reverse chron order |
| `GET` | `/api/analysis/{id}` | Authenticated | Retrieve a single detailed ATS evaluation report |

---

## 💻 Local Development Setup

### Prerequisites
- **Java 17 or 21** installed (`java -version`)
- **Node.js 18+** installed (`node -v`)
- **PostgreSQL** running locally (`localhost:5432`)

### 1. Clone the Repository
```bash
git clone https://github.com/Rhythm-2829/ai-resume-screener.git
cd ai-resume-screener
```

### 2. Configure Backend
Create `backend/resumescreener/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/resume_screener
    username: postgres
    password: your_postgres_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
  servlet:
    multipart:
      max-file-size: 5MB
      max-request-size: 5MB

server:
  port: 8080

groq:
  api-key: your_groq_api_key
  model: openai/gpt-oss-120b
```

Run the backend:
```bash
cd backend/resumescreener
mvn spring-boot:run
```

### 3. Configure Frontend
Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

Run the frontend:
```bash
cd frontend
npm install
npm run dev
```

Visit **`http://localhost:5173`** in your browser!

---

## 👤 Author

**Rhythm**  
- GitHub: [@Rhythm-2829](https://github.com/Rhythm-2829)
- Project: [AI Resume Screener](https://github.com/Rhythm-2829/ai-resume-screener)
