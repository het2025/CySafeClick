/**
 * CySafeClick Database Seed Script
 * 
 * Reads approved JSON data files from the frontend assets and imports them into MongoDB.
 * Run with: npm run seed (or: node seeds/seed.js)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// ─── Model Imports ───────────────────────────────────────
const FraudTicker    = require('../models/FraudTicker');
const ScamAlert      = require('../models/ScamAlert');
const ScamNumber     = require('../models/ScamNumber');
const ScamReport     = require('../models/ScamReport');
const CommunityReport = require('../models/CommunityReport');
const ThreatFeed     = require('../models/ThreatFeed');
const StateThreat    = require('../models/StateThreat');
const DailyTip       = require('../models/DailyTip');
const ScamStory      = require('../models/ScamStory');
const GlossaryTerm   = require('../models/GlossaryTerm');
const QuizQuestion   = require('../models/QuizQuestion');
const QuizScore      = require('../models/QuizScore');
const Playbook       = require('../models/Playbook');
const Platform2FA    = require('../models/Platform2FA');
const CrimeStats     = require('../models/CrimeStats');

// ─── Helpers ─────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, '..', '..', 'frontend', 'src', 'assets', 'data');

function loadJSON(filename) {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    console.warn(`  ⚠ File not found: ${filename}`);
    return null;
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}

// ─── Seed Functions ──────────────────────────────────────
async function seedFraudTicker() {
  const data = loadJSON('fraud-ticker.json');
  if (!data) return 0;
  await FraudTicker.deleteMany({});
  const items = Array.isArray(data) ? data : data.items || [];
  await FraudTicker.insertMany(items);
  return items.length;
}

async function seedScamAlerts() {
  const data = loadJSON('scam-alerts.json');
  if (!data) return 0;
  await ScamAlert.deleteMany({});
  const items = Array.isArray(data) ? data : data.alerts || [];
  await ScamAlert.insertMany(items);
  return items.length;
}

async function seedThreatFeed() {
  const data = loadJSON('threat-feed.json');
  if (!data) return 0;
  await ThreatFeed.deleteMany({});
  await ThreatFeed.create(data);
  return data.alerts ? data.alerts.length : 1;
}

async function seedStateThreat() {
  const data = loadJSON('state-threat-data.json');
  if (!data) return 0;
  await StateThreat.deleteMany({});
  const items = Array.isArray(data) ? data : data.states || [];
  await StateThreat.insertMany(items);
  return items.length;
}

async function seedDailyTips() {
  const data = loadJSON('tips.json');
  if (!data) return 0;
  await DailyTip.deleteMany({});
  const items = Array.isArray(data) ? data : data.tips || [];
  await DailyTip.insertMany(items);
  return items.length;
}

async function seedScamStories() {
  const data = loadJSON('scam-stories.json');
  if (!data) return 0;
  await ScamStory.deleteMany({});
  const items = Array.isArray(data) ? data : data.stories || [];
  await ScamStory.insertMany(items);
  return items.length;
}

async function seedGlossary() {
  const data = loadJSON('glossary.json');
  if (!data) return 0;
  await GlossaryTerm.deleteMany({});
  const items = Array.isArray(data) ? data : data.terms || [];
  
  // Assign a unique id to each term if it doesn't have one
  items.forEach((item, index) => {
    if (!item.id) item.id = `gl-${index}`;
  });
  
  await GlossaryTerm.insertMany(items);
  return items.length;
}

async function seedQuizQuestions() {
  await QuizQuestion.deleteMany({});
  let total = 0;

  // English
  const enData = loadJSON('quiz-bank_en.json');
  if (enData) {
    const questions = (enData.questions || []).map(q => ({ ...q, lang: 'en' }));
    await QuizQuestion.insertMany(questions);
    total += questions.length;
  }

  // Hindi
  const hiData = loadJSON('quiz-bank_hi.json');
  if (hiData) {
    const questions = (hiData.questions || []).map(q => ({ ...q, lang: 'hi' }));
    await QuizQuestion.insertMany(questions);
    total += questions.length;
  }

  return total;
}

async function seedPlaybooks() {
  await Playbook.deleteMany({});
  let total = 0;

  // English
  const enData = loadJSON('playbooks_en.json');
  if (enData) {
    const playbooks = (enData.playbooks || (Array.isArray(enData) ? enData : [])).map(p => ({ ...p, lang: 'en' }));
    await Playbook.insertMany(playbooks);
    total += playbooks.length;
  }

  // Hindi
  const hiData = loadJSON('playbooks_hi.json');
  if (hiData) {
    const playbooks = (hiData.playbooks || (Array.isArray(hiData) ? hiData : [])).map(p => ({ ...p, lang: 'hi' }));
    await Playbook.insertMany(playbooks);
    total += playbooks.length;
  }

  return total;
}

async function seedPlatforms2FA() {
  const data = loadJSON('platforms-2fa.json');
  if (!data) return 0;
  await Platform2FA.deleteMany({});
  const items = Array.isArray(data) ? data : data.platforms || [];
  await Platform2FA.insertMany(items);
  return items.length;
}

async function seedCrimeStats() {
  const data = loadJSON('crime-stats.json');
  if (!data) return 0;
  await CrimeStats.deleteMany({});
  // crime-stats.json is a single object, not an array
  await CrimeStats.create(data);
  return 1;
}

// ─── Main Seed Runner ────────────────────────────────────
async function runSeed() {
  console.log('\n🌱 CySafeClick Database Seeder');
  console.log('========================\n');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ Connected to MongoDB: ${mongoose.connection.host}\n`);

    const results = [];

    await ScamNumber.deleteMany({});
    await ScamReport.deleteMany({});
    await CommunityReport.deleteMany({});
    await QuizScore.deleteMany({});
    console.log('  ✅ Disabled public identifier collections cleared');

    const seedTasks = [
      { name: 'Fraud Ticker',    fn: seedFraudTicker },
      { name: 'Scam Alerts',     fn: seedScamAlerts },
      { name: 'Threat Feed',     fn: seedThreatFeed },
      { name: 'State Threats',   fn: seedStateThreat },
      { name: 'Daily Tips',      fn: seedDailyTips },
      { name: 'Scam Stories',    fn: seedScamStories },
      { name: 'Glossary',        fn: seedGlossary },
      { name: 'Quiz Questions',  fn: seedQuizQuestions },
      { name: 'Playbooks',       fn: seedPlaybooks },
      { name: 'Platforms 2FA',   fn: seedPlatforms2FA },
      { name: 'Crime Stats',     fn: seedCrimeStats }
    ];

    for (const task of seedTasks) {
      try {
        const count = await task.fn();
        console.log(`  ✅ ${task.name}: ${count} records`);
        results.push({ name: task.name, count, status: 'success' });
      } catch (err) {
        console.error(`  ❌ ${task.name}: ${err.message}`);
        results.push({ name: task.name, count: 0, status: 'error', error: err.message });
      }
    }

    console.log('\n========================');
    const totalRecords = results.reduce((sum, r) => sum + r.count, 0);
    const successCount = results.filter(r => r.status === 'success').length;
    console.log(`✅ Seeded ${totalRecords} records across ${successCount}/${results.length} collections.`);

    if (results.some(r => r.status === 'error')) {
      console.log('\n⚠ Some collections had errors. Check the output above.');
    }

  } catch (error) {
    console.error(`\n❌ Seed failed: ${error.message}`);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed.\n');
    process.exit(0);
  }
}

runSeed();
