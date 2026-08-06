# CySafeClick — Cyber Safety Awareness Platform for India 🇮🇳

![Angular](https://img.shields.io/badge/Angular-17-red.svg?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?logo=typescript)
![NodeJS](https://img.shields.io/badge/Node.js-Express-green.svg?logo=node.js)
![AI Powered](https://img.shields.io/badge/AI_Powered-Groq_Llama3-purple.svg)
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
- [x] **Digital Hygiene:** Educating users on strong passwords, 2FA, setting up hardware key MFA, understanding VPN basics, preventing SIM swapping, and secure social media habits.
- [x] **Zero Monetization:** Committing to a 100% free platform with no ads, ever — sustained entirely by community donations because safety education shouldn't be gated by profit.
- [x] **Community Empowerment:** Building a network of digitally aware citizens who can protect their families and neighbors.

### 💡 Why We Built This
With India experiencing a rapid digital transformation, cybercriminals are constantly innovating new ways to exploit the public. CySafeClick bridges the digital literacy gap by providing an accessible, free, and completely secure sandbox where users can learn to spot scams before they become victims. Built entirely by a passionate community of open-source volunteers, this platform prioritizes public safety over profit.

### 📊 Did You Know?
- India reported over **14 lakh cybercrime cases** registered on the national portal in a single year.
- **UPI fraud** is the single most common type of digital crime targeting Indian citizens.
- **Senior citizens** are disproportionately targeted for KYC and pension-related digital scams.
- Most victims are **first-time internet users** who lack basic digital literacy resources.

## 👥 Target Audience

CySafeClick is built for everyone, with special focus on:
- **Senior Citizens:** A dedicated "Senior Safe Mode" with large text, high-contrast color themes, simple navigation, voice assistance, and special guides for UPI and WhatsApp safety.
- **Students & Youth:** Gamified learning modules, interactive quizzes, and password labs that reward "Cyber Champion" badges to build strong digital habits early.
- **Homemakers:** Practical, jargon-free guides on avoiding online shopping fraud, spotting fake social media giveaways, fake delivery scams, work-from-home job fraud, and OTP theft.
- **Rural Internet Users:** Bilingual support (Hindi/English), low-bandwidth optimized images, and offline PWA accessibility to break language and connectivity barriers in cyber education.

## 🌍 Localization (Bilingual Platform)

To reach the heartland of India, CySafeClick features a robust internal translation engine covering **1,000+ UI strings**. Users can instantly switch the entire platform between **English** and **Hindi (हिंदी)** without page reloads, ensuring complex cyber hygiene concepts are understood natively.

## 🛡️ Awareness Modules & Tools

All of our modules are designed to be highly interactive and beginner-friendly, requiring zero technical background to understand.

- **India Threat Map:** Live interactive heatmaps of cybercrime hotspots across different Indian states (streamed via real-time WebSockets), featuring state-wise filtering and historical trend analysis to break down the most common scams geographically.
- **Cyber Mitra AI:** A 24/7 bilingual assistant powered by Groq with sub-second response times, leveraging **Retrieval-Augmented Generation (RAG)** and voice-based regional slang understanding to provide accurate, context-aware legal guidance. It acts as a digital first-responder to help users identify if they are being scammed and guides them through recovery steps.
- **Cyber Law Guide:** A simplified, plain-English breakdown of the IT Act (2000) fully aligned with the new **Bharatiya Nyaya Sanhita (BNS)**, including a searchable index of recent BNS case studies, so citizens easily understand their digital rights.
- **Scam Stories:** Real-life, community-verified anonymized case studies of digital fraud (updated weekly with complete victim recovery timelines) to help users recognize red flags without exposing victim details.
- **Phishing Guard:** A lightweight, protective browser extension that alerts you to suspicious links, blocks typosquatted domains, and flags zero-day fake government websites without draining your battery.
- **Password Lab:** An educational tool featuring real-time, client-side (offline) entropy calculation using the industry-standard zxcvbn algorithm—and secure HaveIBeenPwned database cross-referencing via k-Anonymity—to help users understand what makes a password truly "unhackable" without sending data to a server.
- **Direct Reporting Guide:** A zero-friction, step-by-step UI detailing exactly how to file an official FIR, including auto-generating draft FIR templates (with regional language translation) and PDF evidence reports, simplifying complex forms for the 1930 Helpline and the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in).
- **E-Commerce Safety Guide:** Learn how to identify fake shopping websites (featuring live fake-website URL analysis), detect dropshipping scams, verify seller authenticity, spot deceptive reviews, and use secure payment methods to prevent financial loss.
- **Personal Safety Score:** A quick interactive quiz that audits your daily online habits, includes simulated dark web exposure analysis, calculates your vulnerability to scams, and generates a personalized, downloadable PDF action plan to improve your digital safety.
- **Scam Fact Checker:** An instant verification tool that cross-references a crowdsourced national database and performs reverse image searches to check if a viral WhatsApp forward, SMS offer, lottery win, or OTP request is real or a known scam.
- **Cyber Glossary:** A searchable dictionary (with fuzzy-matching) of complex cyber terms broken down into simple, easy-to-understand definitions, including a slang dictionary for modern gaming, UPI, Digital Wallet, and crypto scams.
- **Daily Cyber Tips:** Bite-sized, actionable security advice (including animated infographic summaries) curated by certified cybersecurity professionals and delivered in regional languages via audio-visual PWA web push notifications.
- **Student Safety Module:** Specialized gamified curriculum focusing on social media hygiene, anti-doxxing training, interactive cyberbullying prevention scenarios, gaming safety, and digital parenting guides for guardians.
- **State-Specific Helplines:** A comprehensive directory of localized cyber cell contact numbers across India, featuring auto-dial routing based on precise geolocation for mobile users.

## 💻 Tech Stack

This project is built using a modern, scalable, and serverless-ready full-stack architecture:

### Frontend (Angular Workspace)
- **Framework:** Angular 17 (TypeScript, SCSS, RxJS for reactive state management) with native Internationalization (i18n) support for seamless language switching.
- **Styling:** TailwindCSS for rapid, utility-first styling, processed with PostCSS for automated cross-browser prefixing.
- **Compatibility & QA:** Fully tested across Chrome, Firefox, Safari, and Edge, with a strict ESLint configuration and End-to-End testing powered by Cypress.
- **Performance:** Optimized with Angular AOT compilation, Server-Side Rendering (SSR) for improved SEO, Web Workers for heavy client-side calculations, Brotli compression for reduced payload size, and route-level lazy loading for fast initial paint, even on low-bandwidth 3G networks.
- **Accessibility:** Built with strict WCAG 2.1 AAA standards in mind to flawlessly support screen readers, high-contrast modes, and full keyboard navigation.
- **UI Architecture:** 100% Mobile-first responsive design featuring micro-animations for enhanced engagement and an automated OLED-friendly "true black" Dark Mode, built with a strict "no dark patterns" policy for honest user navigation.
- **PWA Ready:** Configured with `ngsw-config.json` for offline caching — key awareness content remains accessible even without an internet connection.

### Backend (Node.js API)
- **Runtime & Framework:** Node.js, Express.js
- **Architecture:** Fully decoupled RESTful API design, future-proofed for gRPC microservice communication and horizontal scaling via Kubernetes.
- **Database:** MongoDB Atlas (Mongoose ODM) configured for high-throughput NoSQL scalability with strict schema validation and automated daily backups, paired with Redis for low-latency session caching.
- **Security:** Zero-trust architecture using Helmet.js, Express Rate Limiter (to prevent DDoS and brute-force attacks), strict CORS policies, robust Content Security Policy (CSP), end-to-end payload encryption for sensitive reporting data, automated nightly vulnerability scanning, and zero telemetry collection.
- **Environment:** Secure local `dotenv` configuration (keys excluded from VCS) and Docker containerization for consistent cross-platform deployment.
- **AI Integration:** Groq API (for Cyber Mitra AI)

### Browser Extension
- **Architecture:** Manifest V3 for enhanced security and privacy.
- **Functionality:** Real-time DOM scanning, cross-origin communication with background service workers, and automatic blocking of malicious hidden iframes.

## 📖 How to Use This Platform

This project is intended as a public awareness resource. 

### For Users / Learners
- **No Registration Required:** You do not need to create an account or provide an email to use the tools.
- **Browse the Site:** Simply open `index.html` (or the hosted URL) to access all awareness modules. You can also "Add to Home Screen" on your mobile device to install it as a PWA for offline access.
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
- [ ] Integration with Google Safe Browsing API for real-time threat detection.
- [ ] Interactive Deepfake detection education module (audio & video).
- [ ] Interactive Financial Fraud Simulator (sandbox environment).
- [ ] Gamified leaderboards to encourage community participation in safety quizzes.
- [ ] Blockchain-based certificate issuance for verified "Cyber Champions".
- [ ] Annual Cybersecurity Hackathon and Capture The Flag (CTF) competition for students to build awareness solutions.
- [ ] Open-source intelligence (OSINT) gathering tools for advanced users.
- [ ] Comprehensive open-source password manager integration tutorials.
- [ ] Integration with smart home (IoT) vulnerability scanners to audit local networks.
- [ ] Integration of WebAuthn for Hardware Security Key (FIDO2) setup tutorials.
- [ ] Digital Forensics Basics module (including malware sandboxing and introductory memory dump analysis tutorials) specifically designed for university students.
- [ ] Integration with DigiLocker for verified identity reporting of cybercrimes.
- [ ] Integration with national telecom blocklists to automatically detect spoofed spam calls.
- [ ] Strategic API partnerships with local banks for instant, integrated financial fraud reporting.
- [ ] Integration with Truecaller Business API for verified caller ID education and detecting spoofed bank numbers.
- [ ] Integration with e-RUPI APIs for tracking and preventing digital voucher abuse.
- [ ] Integration with NSDL and CDSL APIs to verify authentic stock trading platforms and prevent investment fraud.
- [ ] Integration with national courier APIs to track and verify parcel delivery status, preventing fake delivery scams.
- [ ] Integration with FASTag APIs to alert users about emerging highway toll fraud schemes.
- [ ] Direct API integration with CERT-In (Computer Emergency Response Team - India) for real-time national threat advisories.
- [ ] Automated daily sync with the RBI (Reserve Bank of India) unauthorized lending app blacklist.
- [ ] Direct integration with local state police APIs (where available).
- [ ] Regional language expansion (Tamil, Telugu, Marathi).
- [ ] WhatsApp bot integration for the Cyber Mitra AI.
- [ ] Voice-to-text input support for accessibility in the AI chat.
- [ ] One-click shareable cybersecurity awareness badges for social media profiles.
- [ ] Weekly Audio-based Cyber Tips for visually impaired users.
- [ ] Shareable personal safety report card users can send to family members.
- [ ] National Cybersecurity Awareness Month (October) special campaigns and interactive quizzes.
- [ ] Live Cybersecurity News Feed integration localized for Indian users.
- [ ] Personalized Data Breach Notification Tracker alerting users if their credentials are compromised.
- [ ] Automated monthly transparency reports detailing the volume of blocked scam URLs and identified threats.
- [ ] API rate limit monitoring dashboard for external community developers.
- [ ] Migration to a federated GraphQL API for highly efficient mobile data fetching.
- [ ] Implementation of Apache Kafka event streaming for real-time threat intelligence analytics.
- [ ] Corporate Social Responsibility (CSR) Partnership portal for NGO collaboration.
- [ ] Integration with national cyber insurance providers to raise awareness about personal digital liability policies.
- [ ] Porting the Phishing Guard browser extension to native Safari and Firefox environments.
- [ ] Community Bug Bounty Program to incentivize responsible vulnerability disclosure.
- [ ] Offline-first Android/iOS mobile app (via Ionic Capacitor) featuring biometric authentication for low-connectivity rural areas.

## 🤝 Community & Feedback

CySafeClick is a **100% free and open-source** initiative, constantly evolving to tackle the latest digital threats in India. If you have suggestions, spot a bug, want to contribute new scam profiles to our database, or are a UI/UX designer looking to help with continuous accessibility improvements, please check out our [Contributing Guide](CONTRIBUTING.md) or [open an issue](https://github.com/het2025/CySafeClick/issues) on GitHub. For security vulnerabilities, please refer to our [Security Policy](SECURITY.md) instead of opening a public issue. We ask all participants to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Together, we can build a safer digital India!

## 🔒 Data Privacy Guarantee

CySafeClick operates on a **zero-trust data policy** built upon **Zero-Knowledge Architecture principles**, fully compliant with India's **DPDP Act (2023)**. 
- We do not store personal identifiable information (PII).
- **No Registration Required:** You do not need to create an account, provide an email, or share a phone number to use the tools.
- **No Ads, No Tracking:** We use zero third-party trackers, ad networks, tracking cookies, or third-party analytics suites.
- **Local Storage Only:** User preferences (like theme and language) are saved locally on your device, not on our servers.
- **Open Source Transparency:** All of our code is publicly available and subject to regular third-party security auditing by the community.
- **Data Encryption:** Any data in transit between the client and our AI backend is secured via AES-256 encryption.
- Threat reports and AI chat histories are processed securely, scrubbed of sensitive data, and subject to automated 30-day log rotation and deletion.
- **Responsible AI:** Our language models are strictly bound by guardrails to prevent hallucination of legal advice.
- The platform is designed purely for education and awareness.

For more details on our secure development lifecycle, vulnerability reporting, and automated checks, please read our [Security Policy](SECURITY.md).

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## ⚠️ Disclaimer

> This platform is for **educational purposes only**. It does not provide legal advice or official law enforcement services, and CySafeClick is an independent open-source initiative not formally affiliated with the Government of India. Users are always encouraged to report financial cybercrimes immediately by dialing **1930** or visiting the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in). For immediate physical emergencies, please dial **112**.

---

> *"Apni Digital Suraksha, Apne Haath Mein"* 🛡️✨  
> **Stay safe. Stay aware. CySafeClick.**
