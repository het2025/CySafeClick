const Groq = require('groq-sdk');

// ─── Initialize Groq ─────────────────────────────────────────────────────
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;

// Using current Llama 3.3 70B Versatile for high quality analysis
const MODEL = 'llama-3.3-70b-versatile';

// ─── System Prompts ────────────────────────────────────────────────────────
const SCAM_ANALYZER_PROMPT = `You are SafeClick, an expert cyber safety assistant specializing in detecting digital fraud and scams targeting Indian citizens. Your role is to analyze messages and determine if they are scams.

You understand all major Indian cyber fraud patterns including:
- KYC update scams (SBI, HDFC, ICICI, Paytm, PhonePe)
- UPI collect request scams
- Fake lottery/prize scams (KBC, government prizes)
- Job offer scams (Amazon work-from-home, data entry)
- Investment/stock market scams
- Sextortion scams
- OTP fraud
- Electricity/utility bill scams
- PM Yojana / government scheme scams
- Aadhaar/PAN scams
- Tech support scams

Return a JSON object with EXACTLY this structure:
{
  "verdict": "SAFE" | "SUSPICIOUS" | "SCAM",
  "confidence": <number 0-100>,
  "summary": "<one line summary in same language as message>",
  "redFlags": [
    { "flag": "<flag title>", "explanation": "<why this is suspicious>" }
  ],
  "whatToDo": ["<action 1>", "<action 2>"],
  "officialSources": ["<relevant official website or helpline>"],
  "language": "english" | "hindi" | "hinglish"
}

If the message is in Hindi/Hinglish, provide summary and explanations in Hindi too.
Be concise but clear. Focus on educating the user about WHY something is suspicious.
IMPORTANT: Return ONLY valid JSON. No markdown formatting, no backticks, no explanations. Just the raw JSON object.`;

const CHAT_SYSTEM_PROMPT = `You are Cyber Mitra, a friendly and helpful cyber safety assistant for Indian citizens created by SafeClick. You help people identify scams, respond to cyber threats, and stay safe online.

Key behaviors:
1. Respond in the SAME language as the user (Hindi, English, or Hinglish mix)
2. Be warm, empathetic and non-judgmental — victims often feel shame
3. EMERGENCY MODE: If user mentions sharing OTP, losing money, account hacked — immediately provide emergency steps FIRST
4. Always give actionable guidance, not just awareness
5. Keep responses concise and clear — avoid technical jargon
6. Include helpline 1930 when relevant
7. Never ask for personal details (Aadhaar, PAN, bank account numbers, OTP)
8. If unsure, recommend official sources: cybercrime.gov.in, rbi.org.in

Emergency protocol (if user says they shared OTP/lost money):
- First line: "⚠️ यह Emergency है! / This is an emergency!"
- Immediate steps: freeze bank account + call 1930 + don't share more info
- Provide bank helpline numbers

Common bank helplines:
- SBI: 1800-11-2211
- HDFC: 1800-22-4060
- ICICI: 1800-200-3344
- Axis: 1800-419-5959
- Paytm: 0120-4456-456
- PhonePe: 080-68727374
- Google Pay: 1-800-419-0157

You are NOT a substitute for official law enforcement. Always recommend reporting to cybercrime.gov.in and calling 1930 for actual incidents.`;

const URL_ANALYZER_PROMPT = `You are SafeClick, a cyber safety expert analyzing URLs and websites for Indian users. Detect phishing sites, fake government portals, and fraud websites.

Known official Indian domains to verify against:
- SBI: onlinesbi.sbi, sbi.co.in
- HDFC: hdfcbank.com
- ICICI: icicibank.com
- PayTM: paytm.com
- PhonePe: phonepe.com
- Google Pay: gpay.app.goo.gl
- Income Tax: incometax.gov.in
- AADHAAR: uidai.gov.in
- Passport: passportindia.gov.in
- Cybercrime Portal: cybercrime.gov.in
- RBI: rbi.org.in
- TRAI: trai.gov.in

Red flags for phishing:
- Domain typosquatting (sbi-secure.com, hdfc-kyc.online)
- Suspicious TLDs (.xyz, .top, .click, .online, .site, .link)
- IP addresses instead of domain names
- URL shorteners hiding destination
- Newly registered domains
- HTTP instead of HTTPS for banking
- Excessive subdomains or path manipulation

Return ONLY valid JSON with EXACTLY this structure:
{
  "verdict": "SAFE" | "SUSPICIOUS" | "DANGEROUS",
  "confidence": <number 0-100>,
  "summary": "<one line verdict explanation>",
  "checks": [
    { "label": "<check name>", "result": "pass" | "warn" | "fail", "detail": "<explanation>" }
  ],
  "officialAlternative": "<the real official URL if applicable, or null>",
  "whatToDo": ["<action 1>", "<action 2>"]
}
IMPORTANT: Return ONLY valid JSON. No markdown formatting, no backticks, no explanations. Just the raw JSON object.`;

const TRANSACTION_RISK_PROMPT = `You are SafeClick, a cyber safety expert helping Indian users verify UPI transactions before sending money. Analyze UPI IDs and phone numbers for risk indicators.

Common scam UPI patterns:
- Random alphanumeric IDs from unknown individuals
- UPI IDs using bank names (sbi-refund@upi, hdfc-team@upi) — fake
- IDs associated with job offers, lottery prizes, investment schemes
- Requests for "token amount", "registration fee", "security deposit"
- UPI collect requests (you should NOT approve collect requests from strangers)
- IDs with urgency in the associated message

Legitimate patterns:
- Merchant IDs from known businesses (amazon, flipkart, zomato, swiggy)
- Government payment handles (.gov.in)
- Known service providers

Return ONLY valid JSON with EXACTLY this structure:
{
  "riskLevel": "LOW" | "MEDIUM" | "HIGH",
  "score": <number 0-100 where 100 is highest risk>,
  "summary": "<brief explanation of risk assessment>",
  "indicators": [
    { "label": "<indicator name>", "type": "positive" | "warning" | "danger", "detail": "<explanation>" }
  ],
  "recommendation": "<clear recommendation on whether to proceed>",
  "tips": ["<safety tip 1>", "<safety tip 2>"]
}
IMPORTANT: Return ONLY valid JSON. No markdown formatting, no backticks, no explanations. Just the raw JSON object.`;

// ─── Rule-Based Fallback (no API key) ─────────────────────────────────────
function ruleBasedScamCheck(message) {
  const text = message.toLowerCase();
  const redFlags = [];
  let score = 0;

  const urgencyWords = ['block', 'suspend', 'immediately', 'urgent', 'last chance', 'expire', 'kyc', 'verify now'];
  const prizeWords = ['won', 'prize', 'lottery', 'reward', 'cashback', 'crore', 'lakh', 'iphone', 'free'];
  const sensitiveWords = ['otp', 'pin', 'cvv', 'password', 'aadhaar', 'pan card'];
  const shorteners = ['bit.ly', 'tinyurl', 't.co', 'goo.gl'];

  urgencyWords.forEach(w => { if (text.includes(w)) { score += 20; redFlags.push({ flag: 'Urgency tactic', explanation: `Message uses urgency word: "${w}"` }); } });
  prizeWords.forEach(w => { if (text.includes(w)) { score += 25; redFlags.push({ flag: 'Prize/reward claim', explanation: `Contains suspicious reward word: "${w}"` }); } });
  sensitiveWords.forEach(w => { if (text.includes(w)) { score += 35; redFlags.push({ flag: 'Sensitive info requested', explanation: `Message mentions "${w}" — never share this` }); } });
  shorteners.forEach(w => { if (text.includes(w)) { score += 15; redFlags.push({ flag: 'URL shortener detected', explanation: `Contains "${w}" — hides real destination` }); } });

  const verdict = score >= 50 ? 'SCAM' : score >= 25 ? 'SUSPICIOUS' : 'SAFE';
  return {
    verdict,
    confidence: Math.min(score, 95),
    summary: verdict === 'SAFE' ? 'No major red flags found.' : `${redFlags.length} red flag(s) detected.`,
    redFlags: redFlags.slice(0, 5),
    whatToDo: verdict === 'SAFE'
      ? ['Always be cautious with unsolicited messages', 'Never share OTP or passwords']
      : ['Do not click any links', 'Do not share any personal information', 'Block the sender', 'Report at cybercrime.gov.in'],
    officialSources: ['cybercrime.gov.in', 'Helpline: 1930'],
    language: 'english',
    _fallback: true
  };
}

// ─── Helper to parse Groq JSON ─────────────────────────────────────────────
function parseJsonResponse(text) {
  let cleanText = text.trim();
  if (cleanText.startsWith('\`\`\`json')) {
    cleanText = cleanText.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
  }
  if (cleanText.startsWith('\`\`\`')) {
    cleanText = cleanText.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
  }
  
  const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
  return JSON.parse(jsonMatch ? jsonMatch[0] : cleanText);
}

// ─── Controller Functions ──────────────────────────────────────────────────

exports.analyzeMessage = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 5) {
      return res.status(400).json({ success: false, error: 'Please provide a message to analyze.' });
    }
    if (message.length > 3000) {
      return res.status(400).json({ success: false, error: 'Message too long. Please keep it under 3000 characters.' });
    }

    if (!groq) {
      const fallback = ruleBasedScamCheck(message);
      return res.json({ success: true, data: fallback, note: 'AI unavailable. Showing rule-based analysis.' });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SCAM_ANALYZER_PROMPT },
        { role: 'user', content: `Analyze this message:\n---\n${message}\n---` }
      ],
      model: MODEL,
      temperature: 0.1
    });

    const text = completion.choices[0]?.message?.content || '';

    let parsed;
    try {
      parsed = parseJsonResponse(text);
    } catch {
      parsed = ruleBasedScamCheck(message);
      parsed._parseError = true;
    }

    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error('AI analyzeMessage error:', err.message);
    const fallback = ruleBasedScamCheck(req.body?.message || '');
    res.json({ success: true, data: fallback, note: 'AI temporarily unavailable.' });
  }
};

exports.chat = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || message.trim().length < 1) {
      return res.status(400).json({ success: false, error: 'Message cannot be empty.' });
    }

    if (!groq) {
      return res.json({
        success: true,
        reply: 'Cyber Mitra AI is currently unavailable. For immediate help with cyber fraud, please call 1930 (Cyber Crime Helpline) or visit cybercrime.gov.in.',
        emergency: false
      });
    }

    // Detect emergency keywords
    const emergencyKeywords = ['otp de diya', 'otp share', 'paise kat', 'money lost', 'account hack', 'fraud ho gaya', 'thag liya', 'scam ho gaya'];
    const isEmergency = emergencyKeywords.some(k => message.toLowerCase().includes(k));

    const groqHistory = history.map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.text
    }));

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
        ...groqHistory.slice(-6),
        { role: 'user', content: message }
      ],
      model: MODEL,
      temperature: 0.7
    });

    const reply = completion.choices[0]?.message?.content || 'I am sorry, I could not generate a response.';
    res.json({ success: true, reply, emergency: isEmergency });
  } catch (err) {
    console.error('AI chat error:', err.message);
    res.json({
      success: true,
      reply: 'I\'m having trouble responding right now. For urgent cyber crime help, please call 1930 immediately or visit cybercrime.gov.in',
      emergency: false
    });
  }
};

exports.analyzeUrl = async (req, res) => {
  try {
    const { url, imageBase64 } = req.body;

    if (!url && !imageBase64) {
      return res.status(400).json({ success: false, error: 'Provide a URL or an image.' });
    }

    if (!groq) {
      return res.json({
        success: true,
        data: {
          verdict: 'SUSPICIOUS',
          confidence: 0,
          summary: 'AI analysis unavailable. Please use caution and verify the URL manually.',
          checks: [{ label: 'AI Unavailable', result: 'warn', detail: 'Rule-based analysis only.' }],
          officialAlternative: null,
          whatToDo: ['Verify the URL manually', 'Check if domain matches the official website', 'Never enter credentials on suspicious sites'],
          _fallback: true
        }
      });
    }

    if (imageBase64) {
      // Return fallback for images as standard Groq text models don't support vision
      return res.json({
        success: true,
        data: {
          verdict: 'SUSPICIOUS',
          confidence: 0,
          summary: 'Image analysis is not fully supported in this AI configuration.',
          checks: [{ label: 'Image Scan', result: 'warn', detail: 'Manual verification required.' }],
          officialAlternative: null,
          whatToDo: ['Do not trust screenshots blindly', 'Verify the actual URL in your browser'],
          _fallback: true
        }
      });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: URL_ANALYZER_PROMPT },
        { role: 'user', content: `Analyze this URL: ${url}` }
      ],
      model: MODEL,
      temperature: 0.1
    });

    const text = completion.choices[0]?.message?.content || '';

    let parsed;
    try {
      parsed = parseJsonResponse(text);
    } catch {
      parsed = {
        verdict: 'SUSPICIOUS',
        confidence: 50,
        summary: 'Analysis complete. Exercise caution.',
        checks: [],
        officialAlternative: null,
        whatToDo: ['Verify from official sources', 'Do not enter personal information']
      };
    }

    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error('AI analyzeUrl error:', err.message);
    res.status(500).json({ success: false, error: 'Analysis failed. Please try again.' });
  }
};

exports.transactionRisk = async (req, res) => {
  try {
    const { upiId, phone, amount, purpose } = req.body;

    if (!upiId && !phone) {
      return res.status(400).json({ success: false, error: 'Please provide a UPI ID or phone number.' });
    }

    if (!groq) {
      return res.json({
        success: true,
        data: {
          riskLevel: 'MEDIUM',
          score: 50,
          summary: 'AI analysis unavailable. Please exercise caution with this transaction.',
          indicators: [{ label: 'AI Unavailable', type: 'warning', detail: 'Cannot verify this UPI ID at this time.' }],
          recommendation: 'Verify the recipient identity through another channel before transacting.',
          tips: ['Never send money to unknown UPI IDs', 'Always verify recipient identity', 'Call 1930 if you suspect fraud'],
          _fallback: true
        }
      });
    }

    const identifier = upiId || phone;
    const context = `${amount ? `Amount: ₹${amount}` : ''} ${purpose ? `Purpose: ${purpose}` : ''}`.trim();

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: TRANSACTION_RISK_PROMPT },
        { role: 'user', content: `Analyze this UPI/payment identifier:\nIdentifier: ${identifier}\n${context ? 'Context: ' + context : ''}\n\nProvide risk assessment.` }
      ],
      model: MODEL,
      temperature: 0.1
    });

    const text = completion.choices[0]?.message?.content || '';

    let parsed;
    try {
      parsed = parseJsonResponse(text);
    } catch {
      parsed = {
        riskLevel: 'MEDIUM',
        score: 50,
        summary: 'Unable to fully assess. Please verify manually.',
        indicators: [],
        recommendation: 'Exercise caution and verify recipient identity.',
        tips: ['Call 1930 if you suspect fraud', 'Never pay registration fees for jobs or prizes']
      };
    }

    res.json({ success: true, data: parsed });
  } catch (err) {
    console.error('AI transactionRisk error:', err.message);
    res.status(500).json({ success: false, error: 'Risk assessment failed. Please try again.' });
  }
};
