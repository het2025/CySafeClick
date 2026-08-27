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
- [x] **Demystifying Scams:** Explaining complex frauds like UPI-collect, Sextortion, parcel delivery frauds, and KYC-traps in simple terms.
- [x] **Language Inclusivity:** Providing content in both Hindi and English.
- [x] **Real-time Detection:** Offering a browser extension to guard against phishing as you browse.
- [x] **Digital Hygiene:** Educating users on strong passwords, 2FA, setting up hardware key MFA, understanding VPN basics, preventing SIM swapping, safe public USB charging (juice jacking prevention), and secure social media habits.
- [x] **Zero Monetization:** Committing to a 100% free platform with no ads, ever — sustained entirely by community donations because safety education shouldn't be gated by profit.
- [x] **Community Empowerment:** Building a network of digitally aware citizens who can protect their families and neighbors by organizing local digital neighborhood watch networks.

### 💡 Why We Built This
With India experiencing a rapid digital transformation, cybercriminals are constantly innovating new ways to exploit the public. CySafeClick bridges the digital literacy gap by providing an accessible, free, and completely secure sandbox where users can learn to spot scams before they become victims. Built entirely by a passionate community of open-source volunteers, this platform prioritizes public safety over profit.

### 📊 Did You Know?
- India reported over **14 lakh cybercrime cases** registered on the national portal in a single year.
- **UPI fraud** is the single most common type of digital crime targeting Indian citizens.
- **Senior citizens** are disproportionately targeted for KYC and pension-related digital scams.
- **Work-from-home job fraud** has surged by 300% post-pandemic, predominantly targeting young graduates.
- Most victims are **first-time internet users** who lack basic digital literacy resources.

## 👥 Target Audience

CySafeClick is built for everyone, with special focus on:
- **Senior Citizens:** A dedicated "Senior Safe Mode" with large text, high-contrast color themes, simple navigation, voice assistance, and special guides for UPI, simplified OTP and QR code verification, identifying fraudulent investment schemes targeted at retirees, spotting fake medical bill reimbursement scams, and WhatsApp safety.
- **Students & Youth:** Gamified learning modules, interactive quizzes, password labs that reward "Cyber Champion" badges to build strong digital habits early, and curated cybersecurity career pathways and resources for aspiring professionals.
- **Homemakers:** Practical, jargon-free guides on avoiding online shopping fraud, spotting fake social media giveaways, fake delivery scams, electricity bill fraud prevention, work-from-home job fraud, identifying fake charity donation appeals, spotting fraudulent investment schemes, and OTP theft.
- **Rural Internet Users:** Bilingual support (Hindi/English), regional voice-guided UI navigation, low-bandwidth optimized images, SMS-based offline fallback for critical alerts, regional agricultural and crop insurance scam awareness, and offline PWA accessibility to break language and connectivity barriers in cyber education.

## 🌍 Localization (Bilingual Platform)

To reach the heartland of India, CySafeClick features a robust internal translation engine covering **1,000+ UI strings**. Users can instantly switch the entire platform between **English** and **Hindi (हिंदी)** without page reloads, ensuring complex cyber hygiene concepts are understood natively.

## 🛡️ Awareness Modules & Tools

All of our modules are designed to be highly interactive and beginner-friendly, requiring zero technical background to understand.

- **India Threat Map:** Live interactive heatmaps of cybercrime hotspots across different Indian states (streamed via real-time WebSockets), featuring state-wise filtering, district-level granularity, automated export of threat intelligence reports for local researchers, and historical trend analysis to break down the most common scams geographically.
- **Cyber Mitra AI:** A 24/7 bilingual assistant powered by Groq with sub-second response times, leveraging **Retrieval-Augmented Generation (RAG)**, voice-to-text input support for regional dialects, and voice-based regional slang understanding to provide accurate, context-aware legal guidance. It acts as a digital first-responder to help users identify if they are being scammed, guides them through recovery steps, and provides specialized support for detecting and reporting loan app harassment tactics (including detecting predatory micro-loan app terms of service).
- **Cyber Law Guide:** A simplified, plain-English breakdown of the IT Act (2000) fully aligned with the new **Bharatiya Nyaya Sanhita (BNS)**, covering consumer protection rights in digital commerce, digital stalking and extortion defense, automated RTI (Right to Information) draft generation for tracking cyber police complaints, and including a searchable index of recent BNS case studies, so citizens easily understand their digital rights.
- **Scam Stories:** Real-life, community-verified anonymized case studies of digital fraud (updated weekly with complete victim recovery timelines and regional audio-narrated victim testimonials) to help users recognize red flags without exposing victim details.
- **Phishing Guard:** A lightweight, protective browser extension that alerts you to suspicious links, blocks typosquatted domains and punycode homograph attacks, and flags zero-day fake government websites without draining your battery.
- **Password Lab:** An educational tool featuring real-time, client-side (offline) entropy calculation using the industry-standard zxcvbn algorithm (including predictable keyboard walk detection)—and secure HaveIBeenPwned database cross-referencing via k-Anonymity—alongside biometric passkey (WebAuthn) setup and synchronization tutorials to help users understand what makes a password truly "unhackable" without sending data to a server.
- **Direct Reporting Guide:** A zero-friction, step-by-step UI detailing exactly how to file an official FIR, including auto-generating draft FIR templates (with regional language translation and offline saving of incomplete drafts) and PDF evidence reports with e-Sign digital signature support, simplifying complex forms for the 1930 Helpline and the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in).
- **E-Commerce Safety Guide:** Learn how to identify fake shopping websites (featuring live fake-website URL analysis), detect dropshipping scams, avoid fake customer care number scams, verify seller authenticity (including verifying seller GSTIN numbers via government portals), spot deceptive reviews (with fake customer review AI detection techniques), and use secure payment methods to prevent financial loss.
- **Personal Safety Score:** A quick interactive quiz that audits your daily online habits, includes simulated dark web exposure analysis, calculates your vulnerability to scams, and generates a personalized, downloadable PDF action plan with historical safety tracking charts to improve your digital safety.
- **Scam Fact Checker:** An instant verification tool that cross-references a crowdsourced national database and performs reverse image searches, automated WHOIS domain age lookup for suspicious links, voice cloning pattern analysis, and video deepfake analysis to check if a viral WhatsApp forward, SMS offer, lottery win, or OTP request is real or a known scam.
- **Cyber Glossary:** A searchable dictionary (with fuzzy-matching) of complex cyber terms broken down into simple, easy-to-understand definitions, including a crowdsourced dictionary of emerging phishing buzzwords, and a slang dictionary for modern gaming, UPI, Digital Wallet, and cryptocurrency terms.
- **Daily Cyber Tips:** Bite-sized, actionable security advice (including animated infographic summaries) curated by certified cybersecurity professionals, delivered in regional languages via audio-visual desktop and mobile PWA web push notifications, and featuring gamified daily streak tracking.
- **Student Safety Module:** Specialized gamified curriculum focusing on social media hygiene, safe use of public Wi-Fi networks, anti-doxxing training, academic plagiarism extortion defense, interactive cyberbullying prevention scenarios, detecting fraudulent remote internship offers, detecting fraudulent study abroad visa schemes, gaming safety, and digital parenting guides for guardians.
- **State-Specific Helplines:** A comprehensive directory of localized cyber cell contact numbers across India, featuring auto-dial routing based on precise geolocation and one-tap WhatsApp reporting links for mobile users.

## 💻 Tech Stack

This project is built using a modern, scalable, and serverless-ready full-stack architecture:

### Frontend (Angular Workspace)
- **Framework:** Angular 17 (TypeScript, SCSS, RxJS for reactive state management) with native Internationalization (i18n) support for seamless language switching.
- **Styling:** TailwindCSS for rapid, utility-first styling, processed with PostCSS for automated cross-browser prefixing and automated CSS purging for minimal bundle size.
- **Compatibility & QA:** Fully tested across Chrome, Firefox, Safari, and Edge, with a strict ESLint configuration and End-to-End testing powered by Cypress.
- **Performance:** Optimized with Angular AOT compilation, Server-Side Rendering (SSR) for improved SEO, Web Workers for heavy client-side calculations, aggressive tree shaking for optimized bundle sizes, Brotli compression for reduced payload size, automated asset preloading, automated WebP image optimization, and route-level lazy loading for fast initial paint, even on low-bandwidth 3G networks.
- **Accessibility:** Built with strict WCAG 2.1 AAA standards in mind to flawlessly support screen readers (including screen-reader optimized aria-labels for all interactive data charts), high-contrast modes, full keyboard navigation, color blindness simulation testing, and dyslexia-friendly font toggles.
- **UI Architecture:** 100% Mobile-first responsive design featuring subtle haptic feedback on touch devices, micro-animations for enhanced engagement, and an automated OLED-friendly "true black" Dark Mode, built with a strict "no dark patterns" policy for honest user navigation.
- **PWA Ready:** Configured with `ngsw-config.json` for offline caching and background sync for deferred FIR submissions — key awareness content remains accessible even without an internet connection.

### Backend (Node.js API)
- **Runtime & Framework:** Node.js, Express.js
- **Architecture:** Fully decoupled RESTful and GraphQL API design with automated API documentation via Swagger UI, future-proofed for gRPC microservice communication and horizontal scaling via Kubernetes.
- **Database:** MongoDB Atlas (Mongoose ODM) configured for high-throughput NoSQL scalability with strict schema validation, automated index optimization, automated daily backups, and automated daily disaster recovery drills for data resilience, paired with Redis for low-latency session caching.
- **Security:** Zero-trust architecture using Helmet.js, Express Rate Limiter and GraphQL query depth limiting (to prevent DDoS, brute-force attacks, and resource exhaustion), strict CORS policies, robust Content Security Policy (CSP), end-to-end payload encryption for sensitive reporting data, automated nightly vulnerability scanning, automated dependency vulnerability scanning via Snyk, automated SQL injection prevention via Mongoose strict schema enforcement, automated API key rotation, and zero telemetry collection.
- **Environment:** Secure local `dotenv` configuration (keys excluded from VCS), Docker containerization, Kubernetes Helm charts for consistent cross-platform enterprise deployment, and automated CI/CD pipelines via GitHub Actions.
- **AI Integration:** Groq API (for Cyber Mitra AI)

### Browser Extension
- **Architecture:** Manifest V3 for enhanced security and privacy, utilizing local storage for offline phishing database caching to ensure low-latency lookups, and featuring a lightweight memory footprint optimized for low-end hardware.
- **Functionality:** Real-time DOM scanning, cross-origin communication with background service workers, and automatic blocking of malicious hidden iframes and crypto-jacking scripts.

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
- [ ] Integration with NPCI (National Payments Corporation of India) APIs to instantly verify UPI merchant authenticity.
- [ ] Integration with Truecaller Business API for verified caller ID education and detecting spoofed bank numbers.
- [ ] Integration with e-RUPI APIs for tracking and preventing digital voucher abuse.
- [ ] Integration with Income Tax e-Filing APIs to instantly verify tax return portals and prevent refund fraud.
- [ ] Integration with NSDL and CDSL APIs to verify authentic stock trading platforms and prevent investment fraud.
- [ ] Integration with SEBI APIs to instantly cross-check registered financial advisors against known scammers.
- [ ] Integration with NREGA APIs to instantly verify employment records and prevent rural wage theft and fake job card scams.
- [ ] Integration with EPFO (Employees' Provident Fund Organisation) APIs to detect and prevent pension withdrawal fraud.
- [ ] Integration with NCDEX (National Commodity and Derivatives Exchange) APIs to verify agricultural trading platforms and prevent farmer fraud.
- [ ] Integration with PM-Kisan APIs to instantly verify beneficiary status and prevent agricultural subsidy theft.
- [ ] Integration with Udyam Registration APIs to instantly verify MSME vendor authenticity and prevent B2B fraud.
- [ ] Integration with RERA (Real Estate Regulatory Authority) APIs to instantly verify property registrations and prevent fake real estate investments.
- [ ] Integration with CERSAI (Central Registry of Securitisation Asset Reconstruction and Security Interest of India) APIs to instantly detect and prevent fraudulent property transactions.
- [ ] Integration with Aadhar e-KYC APIs to detect synthetic identity fraud and unauthorized SIM card issuance.
- [ ] Integration with UMANG APIs to instantly cross-reference genuine government app downloads and prevent malicious APKs.
- [ ] Integration with NSDL APIs for instantly verifying authentic PAN card details to prevent identity theft.
- [ ] Integration with national RTO (Regional Transport Office) databases to prevent fake vehicle registration scams.
- [ ] Integration with VAHAN APIs to instantly verify second-hand vehicle sales and prevent escrow frauds.
- [ ] Integration with IRCTC APIs to instantly detect fraudulent train ticket booking portals and apps.
- [ ] Integration with NHA (National Health Authority) APIs to instantly verify e-Sanjeevani doctors and detect Ayushman Bharat health insurance fraud.
- [ ] Integration with Jan Aushadhi APIs to verify generic medicine portals and prevent fake medicine sales.
- [ ] Integration with national courier APIs to track and verify parcel delivery status, preventing fake delivery scams.
- [ ] Integration with FSSAI APIs to instantly verify authentic food delivery and cloud kitchen platforms.
- [ ] Integration with MCA (Ministry of Corporate Affairs) APIs to instantly detect shell companies and investment frauds.
- [ ] Integration with FASTag APIs to alert users about emerging highway toll fraud schemes.
- [ ] Direct API integration with CERT-In (Computer Emergency Response Team - India) for real-time national threat advisories.
- [ ] Direct API integration with NCSC (National Cyber Security Coordinator) for real-time critical infrastructure threat advisories.
- [ ] Automated monthly sync with the TRAI (Telecom Regulatory Authority of India) spam caller database.
- [ ] Automated daily sync with the RBI (Reserve Bank of India) unauthorized lending app blacklist.
- [ ] Integration with Bhuvan (ISRO) APIs for hyper-local geofencing of threat map data.
- [ ] Direct integration with local state police APIs (where available).
- [ ] Regional language expansion (Tamil, Telugu, Marathi).
- [ ] Integration with Bhashini (National Language Translation Mission) APIs for advanced regional dialect support in the AI chatbot.
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

CySafeClick is a **100% free and open-source** initiative, constantly evolving to tackle the latest digital threats in India. If you have suggestions, spot a bug, want to contribute new scam profiles to our database, or are a UI/UX designer looking to help with continuous WCAG accessibility and localization improvements, please check out our [Contributing Guide](CONTRIBUTING.md) or [open an issue](https://github.com/het2025/CySafeClick/issues) on GitHub. For security vulnerabilities, please refer to our [Security Policy](SECURITY.md) instead of opening a public issue. We ask all participants to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Together, we can build a safer digital India!

## 🔒 Data Privacy Guarantee

CySafeClick operates on a **zero-trust data policy** built upon **Zero-Knowledge Architecture principles**, fully compliant with India's **DPDP Act (2023)**. 
- We do not store personal identifiable information (PII).
- **No Registration Required & Right to be Forgotten:** You do not need to create an account, provide an email, or share a phone number to use the tools. Any voluntarily submitted feedback is governed by a strict, GDPR-inspired right to be forgotten upon request.
- **No Ads, No Tracking & No Data Sales:** We use zero third-party trackers, ad networks, tracking cookies, or third-party analytics suites. We strictly guarantee no sale of anonymized telemetry data to third parties.
- **Local Storage Only:** User preferences (like theme and language) are saved locally on your device, not on our servers.
- **Open Source Transparency:** All of our code is publicly available and subject to regular third-party security auditing by the community and periodic independent SOC2 compliance audits.
- **Data Encryption:** Any data in transit between the client and our AI backend is secured via AES-256 encryption and the TLS 1.3 protocol.
- Threat reports and AI chat histories are processed securely, undergo strict automated sanitization of all PII, are scrubbed of sensitive data, and subject to automated memory wiping for active sessions and automated 30-day log rotation and deletion.
- **Responsible AI:** Our language models are strictly bound by guardrails to prevent hallucination of legal advice, with a strict prohibition on training third-party LLMs on user interaction data.
- The platform is designed purely for education and awareness.

For more details on our secure development lifecycle, vulnerability reporting, and automated checks, please read our [Security Policy](SECURITY.md).

## 📜 License

This project is licensed under the [MIT License](LICENSE).

## ⚠️ Disclaimer

> This platform is for **educational purposes only**. It does not provide legal advice or official law enforcement services, and CySafeClick is an independent open-source initiative not formally affiliated with the Government of India. Users are always encouraged to report financial cybercrimes immediately by dialing the toll-free **1930** helpline or visiting the [National Cyber Crime Reporting Portal](https://cybercrime.gov.in). For immediate physical emergencies, please dial **112**. All trademarks, logos, and brand names are the property of their respective owners.

---

> *"Apni Digital Suraksha, Apne Haath Mein"* 🛡️✨  
> **Stay safe. Stay aware. CySafeClick.**
