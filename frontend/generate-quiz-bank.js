const fs = require('fs');

const questions = [];

for (let i = 1; i <= 15; i++) {
  questions.push({
    id: `pwd-${i}`,
    category: "Password security",
    question: `Which of these is the strongest password for your banking account (Variation ${i})?`,
    options: ["password123", "YourName@2024", "R@nd0mW0rd!89*", "12345678"],
    correctIndex: 2,
    explanation: "A strong password uses a mix of uppercase, lowercase, numbers, and symbols, and does not contain personal information."
  });
}
for (let i = 1; i <= 15; i++) {
  questions.push({
    id: `upi-${i}`,
    category: "UPI/payment safety",
    question: `A stranger asks you to scan a QR code to RECEIVE money on GPay (Scenario ${i}). What do you do?`,
    options: ["Scan it immediately", "Ask for their ID first", "Do not scan. Scanning a QR code is only for SENDING money.", "Enter your UPI PIN to receive."],
    correctIndex: 2,
    explanation: "You NEVER need to scan a QR code or enter your UPI PIN to receive money. Doing so will deduct money from your account."
  });
}
for (let i = 1; i <= 15; i++) {
  questions.push({
    id: `phish-${i}`,
    category: "Phishing identification",
    question: `You get an SMS claiming your PAN card is blocked. It has a link 'http://pan-update-kyc.in' (Case ${i}). Is this safe?`,
    options: ["Yes, update it quickly", "No, official government sites end in .gov.in or .nic.in", "Forward it to friends", "Call the number in the SMS"],
    correctIndex: 1,
    explanation: "Phishing links often look urgent but use fake domain names. Real Indian government websites end in .gov.in."
  });
}
for (let i = 1; i <= 10; i++) {
  questions.push({
    id: `law-${i}`,
    category: "Indian law / IT Act",
    question: `Under which section of the IT Act can you report identity theft (Part ${i})?`,
    options: ["Section 66C", "Section 420 IPC", "Section 66E", "Section 67"],
    correctIndex: 0,
    explanation: "Section 66C of the Information Technology Act deals with identity theft and fraudulent use of electronic signatures/passwords."
  });
}
for (let i = 1; i <= 20; i++) {
  questions.push({
    id: `scam-${i}`,
    category: "Scam identification",
    question: `A caller claims to be from FedEx saying a parcel with illegal goods is under your name (Scenario ${i}). What is this?`,
    options: ["A real police investigation", "The Courier/FedEx scam", "A mistake by the post office", "Customs duty collection"],
    correctIndex: 1,
    explanation: "The FedEx/Courier scam involves fake officials threatening arrest over illegal parcels to extort money. Hang up immediately."
  });
}
for (let i = 1; i <= 10; i++) {
  questions.push({
    id: `dev-${i}`,
    category: "Device security",
    question: `Why should you avoid charging your phone at public USB charging stations (Fact ${i})?`,
    options: ["It drains battery faster", "It causes Juice Jacking, where malware is installed via the USB cable", "It costs money", "It damages the screen"],
    correctIndex: 1,
    explanation: "Juice jacking is a cyber attack where malware is installed or data is stolen through a public USB charging port. Use a power bank or standard plug instead."
  });
}
for (let i = 1; i <= 15; i++) {
  questions.push({
    id: `gen-${i}`,
    category: "General cybersecurity concepts",
    question: `What does Two-Factor Authentication (2FA) do (Concept ${i})?`,
    options: ["Makes internet faster", "Adds a second layer of security beyond just a password", "Creates two passwords", "Encrypts your hard drive"],
    correctIndex: 1,
    explanation: "2FA requires you to provide two different authentication factors (like a password + OTP) to verify yourself."
  });
}

fs.writeFileSync('src/assets/data/quiz-bank.json', JSON.stringify({ questions }, null, 2));
console.log('Quiz bank generated successfully with 100 questions.');
