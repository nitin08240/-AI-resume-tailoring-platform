# 🚀 AI Resume Tailoring & Interview Prep Platform

An intelligent, full-stack ecosystem designed to bridge the gap between your current resume and your dream job. By leveraging the power of **Google Gemini 1.5 AI**, this platform analyzes job descriptions, identifies skill gaps, and generates perfectly tailored resumes and interview strategies.

[**Live Demo 🚀**](https://ai-resume-tailoring-platform.vercel.app/)

![GitHub last commit](https://img.shields.io/github/last-commit/nitin08240/-AI-resume-tailoring-platform?style=for-the-badge&color=ff2d78)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue?style=for-the-badge)
![AI Engine](https://img.shields.io/badge/AI-Gemini%201.5-orange?style=for-the-badge)

---

## 🌟 Key Features

### 1. 🎯 AI Resume Tailoring
Upload your existing resume (PDF) and paste a job description. Our AI will rewrite your resume to highlight the most relevant skills and experiences, ensuring you pass ATS (Applicant Tracking Systems) and catch the recruiter's eye.

### 2. 🧠 Interview Preparation Reports
Receive a comprehensive 5-day preparation plan including:
- **Technical Questions:** 5-8 deep-dive questions tailored to the JD.
- **Behavioral Questions:** Soft-skills scenarios with the "Best Suitable Answer" provided.
- **Match Score:** A percentage-based gauge showing how well you fit the role.
- **Keyword Gaps:** Visual pills showing missing critical skills.

### 3. 📄 PDF Generation
Download your newly tailored resume as a professional, ATS-friendly PDF powered by **Puppeteer** headless rendering.

### 4. 🛡️ User Dashboard & Security
- **Secure Auth:** JWT-based authentication with cookie storage.
- **Usage Limiting:** Built-in rate limiting (5 reports/3 resumes per day) to manage AI consumption.
- **History:** Access all your past reports and resumes anytime.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, SCSS (Modular), Framer Motion, Axios |
| **Backend** | Node.js, Express, MongoDB, Mongoose |
| **AI/ML** | Google Gemini 1.5 (Flash/Pro) |
| **Utilities** | Puppeteer (PDF Rendering), PDF-Parse, JWT, Bcrypt |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/nitin08240/-AI-resume-tailoring-platform.git
   cd -AI-resume-tailoring-platform
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` folder:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   GOOGLE_GENAI_API_KEY=your_gemini_api_key
   ```
   Run the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../Frontend
   npm install
   ```
   Run the frontend:
   ```bash
   npm run dev
   ```

---

## 🎨 Design Philosophy
The platform features a **Premium Dark Aesthetic** with:
- **Glassmorphism:** Subtle translucency in cards and panels.
- **Micro-animations:** Smooth transitions and hover effects for an "alive" feel.
- **Responsive Layout:** Optimized for both large desktop monitors and smaller screens.

---

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
Distributed under the MIT License.

## 📬 Contact
**Nitin Kumar** - [@nitin08240](https://github.com/nitin08240)

Project Link: [https://github.com/nitin08240/-AI-resume-tailoring-platform](https://github.com/nitin08240/-AI-resume-tailoring-platform)
