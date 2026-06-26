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

## 🛡️ Awareness Modules & Tools

- **Scam Stories:** Real-life case studies of digital fraud to help users recognize red flags.
- **Phishing Guard:** A protective extension that alerts you to suspicious links and fake government websites.
- **Password Lab:** An educational tool to understand what makes a password truly "unhackable."
- **Direct Reporting Guide:** A clear, step-by-step path to the 1930 Helpline and the National Cyber Crime Reporting Portal.

## 📖 How to Use This Platform

This project is intended as a public awareness resource. 

### For Users / Learners
- **Browse the Site:** Simply open `index.html` (or the hosted URL) to access all awareness modules.
- **Install the Guard:** Add the `cysafeclick-extension` to your browser for real-time safety warnings.

### For Developers / Contributors
If you wish to host this platform or contribute to its development:

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

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## ⚠️ Disclaimer

This platform is for **educational purposes only**. It does not provide legal advice or official law enforcement services. Users are always encouraged to report crimes through the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in).

---
*"Apni Digital Suraksha, Apne Haath Mein"*
