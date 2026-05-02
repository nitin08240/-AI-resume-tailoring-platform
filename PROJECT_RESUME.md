# AI Resume Builder - Project "Resume"

## 📌 Objective
**AI Resume Builder** is a full-stack web application designed to help job seekers tailor their resumes and prepare for interviews using the power of Artificial Intelligence. By analyzing a user's current resume, their personal self-description, and the target job description, the platform provides tailored interview reports and generates a highly optimized, customized resume in PDF format to maximize their chances of landing the job.

---

## 🚀 Key Features

1. **User Authentication & Authorization**: 
   - Secure signup and login functi
   onality using JWT (JSON Web Tokens).
   - Password encryption utilizing `bcrypt`/`bcryptjs`.

2. **Smart Resume Parsing**: 
   - Users can seamlessly upload their existing resume PDFs. 
   - The system extracts and processes the text using `pdf-parse`.

3. **AI-Powered Interview Reports**: 
   - By leveraging Google's Gemini AI (`@google/genai`), the system correlates the user's existing resume, their self-description, and the target Job Description (JD).
   - It generates a detailed interview report, which may include skill gap analysis, potential interview questions, and feedback.

4. **Tailored Resume Generation**:
   - The application dynamically creates a customized resume specifically tailored to the provided Job Description.
   - It converts the highly optimized HTML resume output into a downloadable PDF document using `puppeteer`.

5. **Report & Resume Management**:
   - Users have a personalized dashboard to view all their generated interview reports and tailored resumes.

---

## 🏗️ Architecture

The project follows a standard decoupled **Client-Server Architecture**:
- **Client (Frontend)**: A Single Page Application (SPA) built with React that communicates with the backend via RESTful APIs using `axios`.
- **Server (Backend)**: An Express.js Node server handling API requests, file uploads, AI integrations, PDF processing, and database interactions.
- **Database**: A NoSQL MongoDB database storing user profiles, authentication credentials, and generated reports.

---

## 🛠️ Technology Stack & Tools

### **Frontend**
- **Core Library**: React (v19)
- **Build Tool**: Vite for fast, optimized development and production builds.
- **Routing**: React Router DOM (v7) for seamless page navigation.
- **Styling**: Sass (`.scss`) for modular and scalable CSS architecture.
- **HTTP Client**: Axios for making API requests to the backend.

### **Backend**
- **Runtime & Framework**: Node.js with Express.js (v5).
- **Database**: MongoDB with Mongoose (v9) ORM for data modeling.
- **Authentication**: `jsonwebtoken` (JWT) for secure session management and `bcrypt` for password hashing.
- **File Handling**: `multer` for handling `multipart/form-data` and PDF uploads.
- **PDF Processing**: 
  - `pdf-parse` to extract text from uploaded PDF resumes.
  - `puppeteer` (headless Chrome) to dynamically render and generate tailored PDF resumes.
- **AI Integration**: `@google/genai` (Google Gemini AI) for intelligent text analysis and content generation.
- **Validation**: `zod` and `zod-to-json-schema` for robust data and schema validation (ensuring structured AI responses).
- **Environment**: `dotenv` for environment variable management and `nodemon` for development.

---

## 📂 Project Structure

```text
d:/AI RESUME BUILDER/
│
├── Backend/                 # Node.js + Express backend
│   ├── src/
│   │   ├── config/          # Database and environment configurations
│   │   ├── controllers/     # Request handlers (auth, interviews, etc.)
│   │   ├── middlewares/     # Custom middlewares (auth verify, multer file handling)
│   │   ├── models/          # Mongoose database schemas
│   │   ├── routes/          # API route definitions (auth.routes.js, interview.routes.js)
│   │   ├── services/        # Business logic and external service integrations (AI, Puppeteer)
│   │   └── app.js           # Express app initialization and global middlewares
│   ├── server.js            # Server entry point
│   └── package.json         # Backend dependencies
│
└── Frontend/                # React + Vite frontend
    ├── public/              # Static assets
    ├── src/
    │   ├── features/        # Feature-based component structure
    │   ├── style/           # Global Sass stylesheets
    │   ├── App.jsx          # Root component
    │   ├── app.routes.jsx   # Frontend routing configuration
    │   └── main.jsx         # React DOM entry point
    ├── vite.config.js       # Vite bundler configuration
    └── package.json         # Frontend dependencies
```
