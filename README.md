# CySafeClick — Cyber Safety Awareness Platform for India

![Angular](https://img.shields.io/badge/Angular-17-red.svg?logo=angular)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green.svg?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

CySafeClick is a dedicated **Cyber Awareness Initiative** designed to empower Indian citizens with the knowledge and tools to protect themselves against the growing threat of cybercrime. This is an educational platform, not a commercial software installation.


## 🇮🇳 Our Mission

To provide every Indian user with a powerful shield of knowledge. We focus on:
- [x] **Demystifying Scams:** Explaining complex frauds like UPI-collect, Sextortion, and KYC-traps in simple terms.
- [x] **Language Inclusivity:** Providing content in both Hindi and English.
- [x] **Real-time Detection:** Offering a browser extension to guard against phishing as you browse.

## 👥 Target Audience

CySafeClick is built for everyone, with special focus on:
- **Senior Citizens:** A dedicated "Senior Safe Mode" with large text, simple navigation, and voice assistance.
- **Students & Youth:** Interactive quizzes and password labs to build strong digital habits early.
- **Rural Internet Users:** Bilingual support (Hindi/English) to break language barriers in cyber education.

## 🌍 Localization (Bilingual Platform)

To reach the heartland of India, CySafeClick features a robust internal translation engine. Users can instantly switch the entire platform between **English** and **Hindi (हिंदी)** without page reloads, ensuring complex cyber hygiene concepts are understood natively.

## 🛡️ Awareness Modules & Tools

- **India Threat Map:** Live interactive visualization of cybercrime hotspots across different Indian states, breaking down the most common scams geographically.
- **Cyber Mitra AI:** A 24/7 bilingual assistant powered by Groq. It acts as a digital first-responder to help users identify if they are being scammed and guides them through recovery steps.
- **Scam Stories:** Real-life case studies of digital fraud to help users recognize red flags.
- **Phishing Guard:** A protective extension that alerts you to suspicious links and fake government websites.
- **Password Lab:** An educational tool to understand what makes a password truly "unhackable."
- **Direct Reporting Guide:** A clear, step-by-step path to the 1930 Helpline and the National Cyber Crime Reporting Portal.

## 💻 Tech Stack

This project is built using a modern, scalable full-stack architecture:
- **Frontend:** Angular 17, TypeScript, TailwindCSS, SCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **AI Integration:** Groq API (for Cyber Mitra AI)

## 📖 How to Use This Platform

This project is intended as a public awareness resource. 

### For Users / Learners
- **Browse the Site:** Simply open `index.html` (or the hosted URL) to access all awareness modules.
- **Install the CySafeClick Guard Extension:** Our custom browser extension runs quietly in the background to provide:
  - 🛑 Real-time blocking of known malicious URLs
  - 🔍 Visual indicators of safe vs fake government domains
  - 🌐 Direct shortcut to the reporting portal

### For Developers / Contributors
If you wish to host this platform or contribute to its development:

0. **Prerequisites:** Make sure you have Node.js (v18+) and npm installed.

1. **Clone the repository.**
   ```bash
   git clone https://github.com/YOUR_USERNAME/CySafeClick.git
   cd CySafeClick
   ```

2. **Set up environment variables** *(required before running the backend)*:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Then open `backend/.env` and fill in your own values:
   - `MONGO_URI` → Your MongoDB Atlas connection string (free at [mongodb.com/atlas](https://www.mongodb.com/atlas))
   - `GROQ_API_KEY` → Your Groq API key (free at [console.groq.com](https://console.groq.com))

3. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

> **⚠️ Note:** The `.env` file is intentionally excluded from this repository via `.gitignore`. Never commit real API keys or database credentials.

### Running the Project

**Start Backend Server:**
```bash
npm run dev:backend
```

**Start Frontend (Angular):**
```bash
npm run dev:frontend
```

## 🤝 Community & Feedback

CySafeClick is constantly evolving to tackle the latest digital threats in India. If you have suggestions, spot a bug, or want to contribute new scam profiles to our database, please check out our [Contributing Guide](CONTRIBUTING.md) or open an issue on GitHub. Together, we can build a safer digital India!

## 🔒 Data Privacy Guarantee

CySafeClick operates on a **zero-trust data policy**. 
- We do not store personal identifiable information (PII).
- Threat reports and AI chat histories are processed securely and scrubbed of sensitive data.
- The platform is designed purely for education and awareness.

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## ⚠️ Disclaimer

> This platform is for **educational purposes only**. It does not provide legal advice or official law enforcement services. Users are always encouraged to report crimes through the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in).

---

> *"Apni Digital Suraksha, Apne Haath Mein"* 🛡️✨  
> **Stay safe. Stay aware. CySafeClick.**
