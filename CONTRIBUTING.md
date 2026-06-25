# 🤝 Contributing to CySafeClick

Thank you for your interest in contributing to **CySafeClick** — a cyber safety awareness platform for India!

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/CySafeClick.git
   cd CySafeClick
   ```
3. **Set up environment variables:**
   ```bash
   cp backend/.env.example backend/.env
   # Fill in your MONGO_URI and GROQ_API_KEY
   ```
4. **Install dependencies:**
   ```bash
   npm run install:all
   ```
5. **Run the project:**
   ```bash
   npm run dev:backend   # Terminal 1
   npm run dev:frontend  # Terminal 2
   ```

## 📋 How to Contribute

### Reporting Bugs
- Open a [GitHub Issue](../../issues) with a clear title and description
- Include steps to reproduce, expected vs actual behaviour, and screenshots if possible

### Suggesting Features
- Open an Issue with the label `enhancement`
- Describe the feature and why it would benefit Indian users

### Submitting Code
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Test thoroughly
4. Commit with a clear message: `git commit -m "feat: add XYZ feature"`
5. Push: `git push origin feature/your-feature-name`
6. Open a **Pull Request** against `main`

## ✅ Code Standards
- Follow existing Angular and Node.js patterns in the codebase
- Keep components focused and reusable
- Do not commit `.env` files or secrets
- Write meaningful commit messages (use `feat:`, `fix:`, `chore:`, `docs:` prefixes)

## 🔒 Security
Please read our [SECURITY.md](SECURITY.md) before reporting vulnerabilities.

---
*"Apni Digital Suraksha, Apne Haath Mein"* 🛡️
