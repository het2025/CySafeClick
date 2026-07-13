# CySafeClick — Cyber Safety Awareness Platform for India 🇮🇳

![Angular](https://img.shields.io/badge/Angular-17-red.svg?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?logo=typescript)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green.svg?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Open Source](https://img.shields.io/badge/Open_Source-100%25-green.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen.svg)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

CySafeClick is a dedicated **Cyber Awareness & Protection Initiative** designed to empower Indian citizens with the knowledge and tools to protect themselves against the growing threat of cybercrime. This is an educational platform, not a commercial software installation. Our goal: **zero victims through maximum awareness**.

## 📑 Table of Contents
- [Our Mission](#-our-mission)
- [Target Audience](#-target-audience)
- [Localization](#-localization-bilingual-platform)
- [Modules & Tools](#-awareness-modules--tools)
- [Tech Stack](#-tech-stack)
- [How to Use](#-how-to-use-this-platform)
- [Future Roadmap](#-future-roadmap)
- [Community & Feedback](#-community--feedback)
- [Data Privacy Guarantee](#-data-privacy-guarantee)
- [Disclaimer](#-disclaimer)


## 🇮🇳 Our Mission

To provide every Indian user with a powerful shield of knowledge. We focus on:
- [x] **Demystifying Scams:** Explaining complex frauds like UPI-collect, Sextortion, and KYC-traps in simple terms.
- [x] **Language Inclusivity:** Providing content in both Hindi and English.
- [x] **Real-time Detection:** Offering a browser extension to guard against phishing as you browse.
- [x] **Digital Hygiene:** Educating users on strong passwords, 2FA, and secure social media habits.
- [x] **Zero Monetization:** Committing to a 100% free platform with no ads, ever.
- [x] **Community Empowerment:** Building a network of digitally aware citizens who can protect their families and neighbors.

### 💡 Why We Built This
With India experiencing a rapid digital transformation, cybercriminals are constantly innovating new ways to exploit the public. CySafeClick bridges the digital literacy gap by providing an accessible, free, and completely secure sandbox where users can learn to spot scams before they become victims. Built entirely by a passionate community of open-source volunteers, this platform prioritizes public safety over profit.

### 📊 Did You Know?
- India reported over **14 lakh cybercrime cases** registered on the national portal in a single year.
- **UPI fraud** is the single most common type of digital crime targeting Indian citizens.
- Most victims are **first-time internet users** who lack basic digital literacy resources.

## 👥 Target Audience

CySafeClick is built for everyone, with special focus on:
- **Senior Citizens:** A dedicated "Senior Safe Mode" with large text, simple navigation, voice assistance, and special guides for UPI and WhatsApp safety.
- **Students & Youth:** Gamified learning modules, interactive quizzes, and password labs to build strong digital habits early.
- **Homemakers:** Practical, jargon-free guides on avoiding online shopping fraud, fake delivery scams, and OTP theft.
- **Rural Internet Users:** Bilingual support (Hindi/English) to break language barriers in cyber education.

## 🌍 Localization (Bilingual Platform)

To reach the heartland of India, CySafeClick features a robust internal translation engine covering **1,000+ UI strings**. Users can instantly switch the entire platform between **English** and **Hindi (हिंदी)** without page reloads, ensuring complex cyber hygiene concepts are understood natively.

## 🛡️ Awareness Modules & Tools

All of our modules are designed to be highly interactive and beginner-friendly, requiring zero technical background to understand.

- **India Threat Map:** Live interactive heatmaps of cybercrime hotspots across different Indian states, breaking down the most common scams geographically.
- **Cyber Mitra AI:** A 24/7 bilingual assistant powered by Groq with sub-second response times. It acts as a digital first-responder to help users identify if they are being scammed and guides them through recovery steps.
- **Cyber Law Guide:** A simplified breakdown of the IT Act (2000) fully aligned with the new **Bharatiya Nyaya Sanhita (BNS)** so citizens understand their digital rights.
- **Scam Stories:** Real-life anonymized case studies of digital fraud to help users recognize red flags without exposing victim details.
- **Phishing Guard:** A lightweight, protective browser extension that alerts you to suspicious links and fake government websites without draining your battery.
- **Password Lab:** An educational tool featuring real-time entropy calculation to help users understand what makes a password truly "unhackable."
- **Direct Reporting Guide:** A zero-friction, step-by-step UI detailing exactly how to file an official FIR through the 1930 Helpline and the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in).
- **E-Commerce Safety Guide:** Learn how to identify fake shopping websites, verify seller authenticity, and use secure payment methods to prevent financial loss.
- **Personal Safety Score:** A quick interactive quiz that audits your daily online habits, calculates your vulnerability to scams, and generates a personalized action plan to improve your digital safety.
- **Scam Fact Checker:** An instant verification tool to check if a viral WhatsApp forward, SMS offer, lottery win, or OTP request is real or a known scam.
- **Cyber Glossary:** A dictionary of complex cyber terms broken down into simple, easy-to-understand definitions, including modern digital finance and crypto terminology.
- **Daily Cyber Tips:** Bite-sized, actionable security advice delivered via PWA web push notifications to keep users updated on best practices.
- **Student Safety Module:** Specialized gamified curriculum focusing on social media hygiene, cyberbullying prevention, and gaming safety.
- **State-Specific Helplines:** A comprehensive directory of localized cyber cell contact numbers across India, featuring 1-click calling on mobile devices.

## 💻 Tech Stack

This project is built using a modern, scalable full-stack architecture:

### Frontend (Angular Workspace)
- **Framework:** Angular 17 (TypeScript, SCSS)
- **Styling:** TailwindCSS for rapid, utility-first styling.
- **Compatibility:** Fully tested across Chrome, Firefox, Safari, and Edge.
- **Performance:** Optimized with Angular AOT compilation and route-level lazy loading for fast initial paint.
- **Accessibility:** Built with strict WCAG 2.1 AAA standards in mind to flawlessly support screen readers and high-contrast modes.
- **UI Architecture:** 100% Mobile-first responsive design featuring an automated Dark Mode for comfortable nighttime reading.
- **PWA Ready:** Configured with `ngsw-config.json` for offline caching — key awareness content remains accessible even without an internet connection.

### Backend (Node.js API)
- **Runtime & Framework:** Node.js, Express.js
- **Architecture:** Fully decoupled RESTful API design.
- **Database:** MongoDB Atlas (Mongoose ODM) configured for high-throughput NoSQL scalability.
- **Security:** Zero-trust architecture using Helmet.js, Express Rate Limiter, and strict CORS policies.
- **Environment:** Secure local `dotenv` configuration (keys excluded from VCS).
- **AI Integration:** Groq API (for Cyber Mitra AI)

### Browser Extension
- **Architecture:** Manifest V3 for enhanced security and privacy.
- **Functionality:** Real-time DOM scanning, cross-origin communication with background service workers.

## 📖 How to Use This Platform

This project is intended as a public awareness resource. 

### For Users / Learners
- **No Registration Required:** You do not need to create an account or provide an email to use the tools.
- **Browse the Site:** Simply open `index.html` (or the hosted URL) to access all awareness modules.
- **Install the CySafeClick Guard Extension:** Our custom browser extension runs quietly in the background to provide:
  - 🛑 Real-time blocking of known malicious URLs
  - 🔍 Visual indicators of safe vs fake government domains
  - 🌐 Direct shortcut to the reporting portal

### For Developers / Contributors
If you wish to host this platform or contribute to its development:

0. **Prerequisites:** Make sure you have `git`, Node.js (v18+), and npm installed.

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
   The easiest way is to use the monorepo script:
   ```bash
   npm run install:all
   ```
   *Fallback:* If the above command fails, you can install them manually:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
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

## 🚀 Future Roadmap

- [ ] Interactive simulated phishing tests for users.
- [ ] Gamified leaderboards to encourage community participation in safety quizzes.
- [ ] Direct integration with local state police APIs (where available).
- [ ] Regional language expansion (Tamil, Telugu, Marathi).
- [ ] WhatsApp bot integration for the Cyber Mitra AI.
- [ ] Voice-to-text input support for accessibility in the AI chat.
- [ ] Shareable personal safety report card users can send to family members.
- [ ] Offline-first Android/iOS mobile app for low-connectivity rural areas.

## 🤝 Community & Feedback

CySafeClick is a **100% free and open-source** initiative, constantly evolving to tackle the latest digital threats in India. If you have suggestions, spot a bug, or want to contribute new scam profiles to our database, please check out our [Contributing Guide](CONTRIBUTING.md) or [open an issue](https://github.com/het2025/CySafeClick/issues) on GitHub. For security vulnerabilities, please refer to our [Security Policy](SECURITY.md) instead of opening a public issue. We ask all participants to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Together, we can build a safer digital India!

## 🔒 Data Privacy Guarantee

CySafeClick operates on a **zero-trust data policy**. 
- We do not store personal identifiable information (PII).
- **No Ads, No Tracking:** We use zero third-party trackers or ad networks.
- **Local Storage Only:** User preferences (like theme and language) are saved locally on your device, not on our servers.
- **Open Source Transparency:** All of our code is publicly available for security auditing by anyone.
- Threat reports and AI chat histories are processed securely and scrubbed of sensitive data.
- The platform is designed purely for education and awareness.

For more details on our secure development lifecycle, vulnerability reporting, and automated checks, please read our [Security Policy](SECURITY.md).

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## ⚠️ Disclaimer

> This platform is for **educational purposes only**. It does not provide legal advice or official law enforcement services. Users are always encouraged to report crimes immediately by dialing **1930** or visiting the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in).

---

> *"Apni Digital Suraksha, Apne Haath Mein"* 🛡️✨  
> **Stay safe. Stay aware. CySafeClick.**
