# 🎯 AI Resume Screener — Full-Stack ATS Evaluation Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.1-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Resilience4j](https://img.shields.io/badge/Resilience4j-Fault%20Tolerance-38B2AC?style=for-the-badge)](https://resilience4j.readme.io/)
[![Recharts](https://img.shields.io/badge/Recharts-Data%20Viz-22B5BF?style=for-the-badge)](https://recharts.org/)
[![Groq AI](https://img.shields.io/badge/Groq%20AI-LLaMA%20%2F%20GPT--OSS-f55036?style=for-the-badge)](https://groq.com/)
[![Railway](https://img.shields.io/badge/Deployed%20on-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

An enterprise-grade, full-stack **AI Resume Screener and ATS (Applicant Tracking System) Optimization Platform**. Candidates and recruiters can upload PDF resumes, benchmark qualifications against target job specifications, and receive real-time, LLM-powered diagnostics featuring **ATS match scores**, **in-line keyword heatmaps**, **side-by-side version comparisons**, **historical trajectory analytics**, and **quantified bullet point rewrites**.

Built with an enterprise-ready architecture featuring **Resilience4j circuit breaking**, **deterministic SHA-256 Redis caching**, and **zero-penalty quota preservation**.

---

## 🌐 Live Deployments

- **Frontend Web Application (Vercel):** [https://ai-resume-screener-beryl.vercel.app](https://ai-resume-screener-beryl.vercel.app)
- **Backend REST API (Railway):** [https://ai-resume-screener-production-4d74.up.railway.app](https://ai-resume-screener-production-4d74.up.railway.app)
- **API Health Endpoint:** [https://ai-resume-screener-production-4d74.up.railway.app/api/health](https://ai-resume-screener-production-4d74.up.railway.app/api/health)

---

## ✨ Flagship Capabilities & Features

### 🌟 1. Public Landing Page & Interactive ATS Demo
- **Recruiter-Grade Showcase**: Clear value proposition addressing ATS rejection patterns, supported by instant CTAs.
- **Interactive Before / After ATS Preview**: Real-time switch demonstrating the contrast between an unoptimized candidate resume (56% ATS score, flagged missing skills, passive voice) and the optimized version (91% ATS score, quantified achievements, matched competencies).
- **3-Step Pipeline Breakdown**: Explains text ingestion, LLM semantic benchmarking, and ATS action plan generation.
- **Production Architecture Cards**: Prominently highlights sub-10ms Redis caching, Resilience4j fault tolerance, and secure rate-limiting.

### 📈 2. Candidate ATS Score Progression Chart (`Recharts`)
- **Trajectory Analytics**: Interactive `AreaChart` rendering chronological candidate scores across past evaluations.
- **Target Benchmark Reference**: Dashed 75% emerald reference line representing the competitive recruiter interview threshold.
- **Trajectory Metric Pill**: Automatically computes net score differential (e.g., `+32% Overall Trajectory`).
- **Glassmorphic Hover Tooltips**: Displays evaluation run index, timestamp, score color-coding, and job description excerpt.

### ⚖️ 3. Side-by-Side Resume Comparison Mode
- **Version Differential**: Select any two historical evaluations to compare side-by-side with net ATS score delta (e.g. `+24% ATS Gain`).
- **Competency Progression**: Displays newly acquired skills ("Newly Matched Competencies in Version B") and resolved gaps ("Gaps Successfully Resolved").
- **Bullet-by-Bullet Analysis**: Compares original candidate bullet points and AI-suggested rewrites between both resume iterations.

### 🔍 4. Recruiter ATS Keyword Heatmap & Density Inspector
- **In-Text Highlighting**: Live regex scanner highlights job description requirements directly in the text:
  - **Matched Competencies**: Highlighted in glowing emerald with `✓` badges.
  - **Unmatched Deficiencies**: Highlighted in amber/rose with `✕` badges.
- **Keyword Coverage Progress**: Visual bar calculating exact percentage of matched skills vs. total job requirements.
- **Filterable Matrix**: Instantly toggle between *All Keywords*, *Matched Only*, and *Missing Gaps*.

### ⏱️ 5. Sequential Architecture-Aware Live Pipeline Trace
- Replaces generic spinners during the 3–5s Groq LLM inference with an interactive backend execution trace:
  1. **In-Memory PDF Parsing** (`Apache PDFBox 3.x` <50ms)
  2. **Redis Content-Hash Verification** (`SHA-256 fingerprint` <10ms)
  3. **Groq LLM Semantic Matching** (`openai/gpt-oss-120b` real-time inference)
  4. **Recruiter Diagnostics & Rewrites** (`JSON Schema Synthesis`)
- Displays live elapsed seconds, pulsing status dots, and progressive completion badges.

### 🛡️ 6. Resilience4j Fault Tolerance & Zero-Penalty Quota
- **Circuit Breaker (`groqService`)**: Sliding window of 5 calls, 60% failure rate threshold, 30s open duration, and automatic transition to `HALF-OPEN`.
- **Time Limiter**: 10s timeout preventing hanging requests.
- **Retry Mechanism**: Exponential retry (2 attempts, 1s backoff) for transient network timeouts.
- **Sub-10ms Degraded Fallback**: Returns friendly fallback without hanging the user if Groq experiences provider downtime.
- **Zero-Penalty Quota Preservation**: Failed or degraded analyses do **not** consume the user's daily quota, write to the database, or pollute the Redis cache.
- **Synchronized UI Countdown**: Live 30-second countdown in the React interface matching the circuit breaker recovery window.

### ⚡ 7. SHA-256 Content-Hash Redis Caching
- Generates a deterministic `analysis:cache:<sha256(resumeText + jobDescription)>` key.
- Identical evaluations return in **<10ms** with **0 Groq API tokens** consumed.
- 7-day TTL automatically evicts stale evaluations.

---

## 🏗️ System Architecture & Execution Flow

```
                                [ Candidate / Recruiter ]
                                           │
                                           ▼
                 ┌──────────────────────────────────────────────────┐
                 │        React 19 + Vite Frontend (Vercel)         │
                 │  - Public Landing Page with Before/After Demo    │
                 │  - Recharts ATS Trajectory Progression Analytics │
                 │  - Side-by-Side Resume Comparison Modal          │
                 │  - In-Line Job Description Keyword Heatmap       │
                 │  - Live Pipeline Trace with 30s Circuit Timer    │
                 └─────────────────────────┬────────────────────────┘
                                           │ HTTPS / REST (CORS Whitelisted)
                                           ▼
                 ┌──────────────────────────────────────────────────┐
                 │       Spring Boot 4.x Backend (Railway)          │
                 │  - Stateless JWT Filter (OncePerRequestFilter)   │
                 │  - In-Memory PDF Extraction (Apache PDFBox)      │
                 │  - Rate Limiter Service (5 evaluations/day/user) │
                 │  - SHA-256 Content-Addressable Redis Cache       │
                 └───────┬─────────────────┬──────────────────┬─────┘
                         │                 │                  │
         Cache Miss (<10ms)                │                  │
                         ▼                 ▼                  ▼
                 ┌──────────────┐   ┌──────────────┐   ┌──────────────────────────┐
                 │  PostgreSQL  │   │  Redis 7     │   │ Resilience4j Protection  │
                 │  (Railway)   │   │  (Railway)   │   │ ├─ TimeLimiter (10s)     │
                 │  - Users     │   │  - SHA-256   │   │ ├─ Retry (2 attempts)    │
                 │  - Resumes   │   │  - 7-Day TTL │   │ └─ CircuitBreaker (30s)  │
                 │  - Analyses  │   │  - <10ms     │   └────────────┬─────────────┘
                 └──────────────┘   └──────────────┘                │
                                                                    ▼
                                                       ┌──────────────────────────┐
                                                       │      Groq Cloud LLM      │
                                                       │   openai/gpt-oss-120b    │
                                                       │  - Strict JSON Output    │
                                                       └──────────────────────────┘
```

---

## 🛠️ Tech Stack Breakdown

| Layer | Technology | Purpose |
|---|---|---|
| **Backend** | Spring Boot 4.1.1, Java 17 | Core REST API and business logic |
| **Security** | Spring Security 7, JJWT 0.12.6, BCrypt | Stateless JWT bearer authentication and password hashing |
| **Fault Tolerance** | Resilience4j 2.2.0, Spring Boot AOP | Circuit breaker, time limiter, retry, and degraded fallback |
| **Caching** | Redis 7, Spring Data Redis | Content-addressable SHA-256 hash caching (<10ms hits) |
| **PDF Extraction** | Apache PDFBox 3.0.1 | In-memory text extraction from multi-page PDF resumes |
| **Database** | PostgreSQL 16, Spring Data JPA, Hibernate 7 | Relational persistence for users, resumes, and evaluations |
| **AI / LLM** | Groq Cloud API (`openai/gpt-oss-120b`) | Semantic matching, ATS scoring, and bullet point rewrites |
| **Frontend** | React 19, React Router DOM 7 | Component-driven user interface |
| **Data Visualization**| Recharts 3.10.1 | Interactive ATS score progression line/area charts |
| **Styling & Icons** | Aurora Glass Design System, Lucide React | Dark-slate translucent UI, glowing badges, and micro-interactions |
| **Build & Bundling**| Vite 8 | Lightning-fast development and optimized production bundling |
| **Hosting** | Railway & Vercel | Production container deployment and global CDN delivery |

---

## 📡 REST API Reference

All protected endpoints require an `Authorization: Bearer <jwt_token>` header.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Registers user, hashes password with BCrypt, returns JWT |
| `POST` | `/api/auth/login` | Public | Authenticates credentials, returns stateless JWT |
| `GET` | `/api/health` | Public | Railway deployment liveness probe (`{"status":"UP"}`) |
| `POST` | `/api/resumes/upload` | Authenticated | Multipart upload of PDF resume, parses text in-memory |
| `GET` | `/api/resumes` | Authenticated | Returns all uploaded resumes for the current user |
| `POST` | `/api/analysis/run` | Authenticated | Runs Groq LLM ATS evaluation protected by Resilience4j & Redis cache |
| `GET` | `/api/analysis/quota` | Authenticated | Returns remaining daily quota `{used, limit, remaining}` |
| `GET` | `/api/analysis/history` | Authenticated | Returns historical evaluations sorted chronologically |
| `GET` | `/api/analysis/{id}` | Authenticated | Retrieves detailed diagnostics, keyword breakdown, and bullet rewrites |

---

## 💻 Local Development Setup

### Prerequisites
- **Java 17 or 21** (`java -version`)
- **Maven 3.8+** (`mvn -version`)
- **Node.js 18+** (`node -v`)
- **PostgreSQL** running locally on port `5432`
- **Redis** running locally on port `6379` (optional, can run without Redis in local dev)
- **Groq API Key** (from [console.groq.com](https://console.groq.com/))

---

### 1. Clone the Repository
```bash
git clone https://github.com/Rhythm-2829/ai-resume-screener.git
cd ai-resume-screener
```

---

### 2. Configure & Run Backend
Create or edit `backend/resumescreener/src/main/resources/application.yml`:
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/resume_screener
    username: postgres
    password: your_postgres_password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false
  data:
    redis:
      host: localhost
      port: 6379

server:
  port: 8080

groq:
  api-key: your_groq_api_key
  model: openai/gpt-oss-120b

resilience4j:
  circuitbreaker:
    instances:
      groqService:
        slidingWindowSize: 5
        failureRateThreshold: 60
        waitDurationInOpenState: 30s
  timelimiter:
    instances:
      groqService:
        timeoutDuration: 10s
  retry:
    instances:
      groqService:
        maxAttempts: 2
        waitDuration: 1s
```

Run the Spring Boot application:
```bash
cd backend/resumescreener
mvn spring-boot:run
```
The backend will boot up at `http://localhost:8080`.

---

### 3. Configure & Run Frontend
Create `frontend/.env.local`:
```env
VITE_API_BASE_URL=http://localhost:8080
```

Install dependencies and start the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🧪 Testing

Run backend unit and integration tests (including Mockito circuit-breaker and quota-preservation tests):
```bash
cd backend/resumescreener
mvn test
```

---

## 👤 Author

**Rhythm**  
- GitHub: [@Rhythm-2829](https://github.com/Rhythm-2829)  
- Repository: [AI Resume Screener](https://github.com/Rhythm-2829/ai-resume-screener)
