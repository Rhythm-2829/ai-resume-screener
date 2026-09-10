# AI Resume Screener — Full Project Roadmap
### From zero to live URL | Spring Boot + React + PostgreSQL + Claude API

---

## What you're building

A tool where a user pastes or uploads a job description and their resume (PDF), and the app returns:
- A **match score** (0–100%)
- **Skill gaps** — what the JD wants that the resume lacks
- **Strengths** — what aligns well
- **Suggested resume edits** — bullet-by-bullet recommendations

All results are stored so the user can compare how their resume performs across multiple JDs over time.

---

## Tech stack

| Layer | Technology | Why |
|---|---|---|
| Backend | Spring Boot 3.x (Java 17) | Your primary skill, great for REST APIs |
| Frontend | React 18 + Vite | Lightweight, fast setup |
| Database | PostgreSQL | Structured data, good for relational queries |
| AI | Claude API (claude-sonnet) | Best for structured JSON output |
| PDF Parsing | Apache PDFBox | Extracts text from uploaded resumes |
| Auth | Spring Security + JWT | Industry standard |
| Deployment | Railway (backend + DB) + Vercel (frontend) | Free, beginner-friendly |

---

## Architecture overview

```
┌─────────────────────────────────────────────────────┐
│                    React (Vercel)                   │
│  Upload Resume PDF  │  Paste JD  │  View Results   │
└──────────────────────────┬──────────────────────────┘
                           │ REST API (HTTPS)
┌──────────────────────────▼──────────────────────────┐
│               Spring Boot (Railway)                 │
│                                                     │
│  AuthController   ResumeController   AnalysisController│
│       │                 │                  │        │
│  UserService      ResumeService     AnalysisService │
│       │                 │                  │        │
│  JwtUtil          PDFBoxParser       ClaudeClient   │
│                         │                  │        │
│               PostgreSQL (Railway)   Claude API     │
└─────────────────────────────────────────────────────┘
```

### Database schema (simplified)

```
users
  id, email, password_hash, created_at

resumes
  id, user_id, file_name, extracted_text, uploaded_at

analyses
  id, user_id, resume_id, job_description, match_score,
  skill_gaps (jsonb), strengths (jsonb), suggestions (jsonb), created_at
```

---

## Build phases

### Phase 1 — Project setup (Day 1, ~2 hours)

**Backend**
1. Go to [start.spring.io](https://start.spring.io) — add dependencies: Spring Web, Spring Security, Spring Data JPA, PostgreSQL Driver, Lombok, Validation
2. Create your folder structure:
```
src/main/java/com/yourname/resumescreener/
  controller/
  service/
  repository/
  model/
  dto/
  config/
  util/
```
3. Set up `application.yml`:
```yaml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USER}
    password: ${DB_PASS}
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: false

claude:
  api-key: ${CLAUDE_API_KEY}
  model: claude-sonnet-4-6
```

**Frontend**
```bash
npm create vite@latest resume-screener-ui -- --template react
cd resume-screener-ui
npm install axios react-router-dom
```

**Git**
```bash
git init
git remote add origin https://github.com/yourusername/ai-resume-screener
```
Create a `.gitignore` — make sure `application.yml` secrets are excluded (use env vars only).

---

### Phase 2 — Auth (Day 1–2, ~3 hours)

Build JWT-based registration and login. This is standard boilerplate you can reuse in every future project.

**Endpoints:**
```
POST /api/auth/register   { email, password } → { token }
POST /api/auth/login      { email, password } → { token }
```

**What to build:**
- `User` entity + `UserRepository`
- `AuthController` → `AuthService` → `JwtUtil`
- `JwtAuthFilter` added to Spring Security filter chain
- `SecurityConfig` — permit `/api/auth/**`, secure everything else

**React side:**
- Simple Login and Register pages
- Store JWT in `localStorage`
- Axios interceptor that attaches `Authorization: Bearer <token>` to every request

---

### Phase 3 — Resume upload + PDF parsing (Day 2–3, ~3 hours)

**Add PDFBox to `pom.xml`:**
```xml
<dependency>
  <groupId>org.apache.pdfbox</groupId>
  <artifactId>pdfbox</artifactId>
  <version>3.0.1</version>
</dependency>
```

**Endpoint:**
```
POST /api/resumes/upload   multipart/form-data (PDF file) → { resumeId, extractedText }
GET  /api/resumes           → list of user's uploaded resumes
```

**PDFParser utility:**
```java
public String extractText(MultipartFile file) throws IOException {
    try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
        PDFTextStripper stripper = new PDFTextStripper();
        return stripper.getText(doc);
    }
}
```

Save the extracted text to the `resumes` table along with the file name.

**React side:**
- Drag-and-drop file upload component (use a simple `<input type="file" accept=".pdf">` to start)
- Show uploaded resumes in a list so user can select one for analysis

---

### Phase 4 — Claude API integration (Day 3–4, ~4 hours)

This is the core of the app. You'll call Claude with a carefully crafted prompt and parse its JSON response.

**ClaudeClient (use RestTemplate or WebClient):**
```java
@Service
public class ClaudeClient {

    private final String apiKey;
    private final RestTemplate restTemplate;

    public AnalysisResult analyze(String resumeText, String jobDescription) {
        String prompt = buildPrompt(resumeText, jobDescription);

        // Build request body
        Map<String, Object> body = Map.of(
            "model", "claude-sonnet-4-6",
            "max_tokens", 1024,
            "messages", List.of(Map.of("role", "user", "content", prompt))
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);
        headers.set("anthropic-version", "2023-06-01");
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map> response = restTemplate.postForEntity(
            "https://api.anthropic.com/v1/messages",
            new HttpEntity<>(body, headers),
            Map.class
        );

        // Parse content[0].text as JSON
        String jsonText = extractText(response.getBody());
        return parseAnalysisResult(jsonText);
    }
}
```

**The prompt (this is what makes the AI useful — invest time here):**
```
You are an expert resume reviewer and recruiter.

Given the resume text and job description below, analyze the match and respond ONLY with valid JSON in this exact format:

{
  "match_score": <integer 0-100>,
  "strengths": ["strength 1", "strength 2"],
  "skill_gaps": ["missing skill 1", "missing skill 2"],
  "suggestions": [
    { "original": "existing bullet or section", "improved": "suggested rewrite" }
  ],
  "summary": "2-3 sentence overall assessment"
}

RESUME:
{{resumeText}}

JOB DESCRIPTION:
{{jobDescription}}

Respond with JSON only. No explanation, no markdown, no backticks.
```

**Endpoint:**
```
POST /api/analysis/run
Body: { resumeId: 1, jobDescription: "paste JD here" }
→ { analysisId, matchScore, strengths, skillGaps, suggestions, summary }
```

Save the full result to the `analyses` table.

---

### Phase 5 — History + comparison (Day 4–5, ~2 hours)

**Endpoints:**
```
GET /api/analysis/history          → all analyses for logged-in user
GET /api/analysis/{id}             → single analysis detail
```

**React side:**
- Dashboard page: list of past analyses with match score, resume name, JD snippet, date
- Click any row → full detail view showing strengths, gaps, suggestions side by side
- A simple score badge (green if >70%, amber if 40–70%, red if <40%)

---

### Phase 6 — Polish before deployment (Day 5–6, ~3 hours)

Before you deploy, do these — they matter for both production and your resume:

- **Input validation** — max file size (5MB), only accept `.pdf`, JD must be at least 100 characters
- **Error handling** — global `@ControllerAdvice` that returns consistent `{ error, message }` JSON
- **Rate limiting** — add a simple check: max 5 analyses per user per day (prevents API bill surprises)
- **Loading states in React** — show a spinner while Claude is thinking (it takes 3–8 seconds)
- **CORS config** — whitelist your Vercel URL in Spring Security
- **README** — architecture diagram, setup steps, live URL, screenshots

---

## Deployment

### Step 1 — Push to GitHub

Make sure your repo is clean:
```bash
git add .
git commit -m "feat: complete AI resume screener MVP"
git push origin main
```

Confirm no secrets are committed — check `application.yml` uses `${ENV_VAR}` placeholders only.

---

### Step 2 — Deploy PostgreSQL + Backend on Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub repo
2. Select your backend repo
3. Railway auto-detects Spring Boot (looks for `pom.xml`)
4. Add a **PostgreSQL plugin** inside the same project — Railway auto-injects `DATABASE_URL`
5. Go to **Variables** tab, add:
   ```
   CLAUDE_API_KEY=sk-ant-...
   DB_USER=postgres
   DB_PASS=<from Railway postgres panel>
   DATABASE_URL=<auto-filled by Railway plugin>
   ```
6. Railway builds your JAR and gives you a public URL like `https://your-app.up.railway.app`

Test it:
```bash
curl https://your-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

---

### Step 3 — Deploy React on Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import GitHub repo (frontend)
2. Vercel detects Vite automatically
3. Add an environment variable:
   ```
   VITE_API_BASE_URL=https://your-app.up.railway.app
   ```
4. In your React code, use:
   ```javascript
   const API = import.meta.env.VITE_API_BASE_URL;
   ```
5. Deploy — Vercel gives you `https://your-project.vercel.app`

---

### Step 4 — Connect frontend to backend

Update your CORS config in Spring Boot:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedOrigins(List.of("https://your-project.vercel.app"));
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
    config.setAllowedHeaders(List.of("*"));
    config.setAllowCredentials(true);
    return source;
}
```

Push → Railway auto-redeploys. Done.

---

## Resume bullets you can write after this

Once it's live, these are honest bullets you can add to your resume:

```
- Built and deployed a full-stack AI resume screening tool using Spring Boot,
  React, and PostgreSQL; integrated Claude API to generate structured match
  scores and skill-gap reports from resume-JD pairs.

- Implemented a RAG-style prompt pipeline using Apache PDFBox for text
  extraction and Claude API for JSON-structured analysis, reducing manual
  resume review effort significantly.

- Deployed backend on Railway with PostgreSQL and frontend on Vercel;
  configured JWT auth, CORS, and environment-based secrets management
  for production readiness.
```

---

## Week-by-week schedule

| Week | Goal | Done when... |
|---|---|---|
| Week 1 | Phase 1 + 2 (setup + auth) | Register/login works, JWT returned |
| Week 2 | Phase 3 (PDF upload + parsing) | PDF uploads, text extracted and saved to DB |
| Week 3 | Phase 4 (Claude integration) | Analysis endpoint returns JSON from Claude |
| Week 4 | Phase 5 (history + dashboard) | User can see all past analyses |
| Week 5 | Phase 6 + deployment | Live URL works end-to-end |

> Each week assumes roughly 6–8 hours of focused work (3 evenings or one solid weekend day).

---

## Things to keep in mind

- **Commit often** — at least one commit per feature. Employers look at commit history.
- **Never commit your Claude API key** — use `.env` files locally, Railway variables in prod.
- **Write a proper README** — include a live URL, one screenshot, and the tech stack. This is often the first thing a recruiter or engineer opens.
- **Add a demo user** — hardcode a `demo@example.com / demo123` login in your seed data so anyone can try it without registering.
- **Keep the Claude bill in check** — add a daily limit of 5 analyses per user from day one.

---

*Built for Rhythm | Stack: Spring Boot 3 · React 18 · PostgreSQL · Claude API · Railway · Vercel*
