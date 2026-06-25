const { asyncHandler } = require('../utils/helpers');
const CommunityReport = require('../models/CommunityReport');

// GET /api/community/reports/:number
exports.getReportsForNumber = asyncHandler(async (req, res) => {
  const reports = await CommunityReport.find({ number: req.params.number }).lean();
  res.json({ reports });
});

// ⚠️ LEGAL NOTICE: Community report submissions are DISABLED.
// Enabling these without authentication + verification would violate:
// - IPC §499-500 (Defamation) — publicly accusing someone without verification
// - DPDP Act 2023 §4-6 — collecting personal data (phone numbers) without consent
// - Intermediary Guidelines 2021 §3 — due diligence requirements
//
// DO NOT re-enable without: (1) user authentication, (2) admin moderation,
// (3) DPDP-compliant consent flow, (4) legal review.

// POST /api/community/report — DISABLED
exports.addReport = asyncHandler(async (req, res) => {
  res.status(403).json({
    success: false,
    disabled: true,
    message: 'Community report submissions are disabled for legal compliance. Report scams via official channels: call 1930 or visit cybercrime.gov.in.'
  });
});

// POST /api/community/sync — DISABLED
exports.syncLocalData = asyncHandler(async (req, res) => {
  res.status(403).json({
    success: false,
    disabled: true,
    message: 'Data sync is disabled for legal compliance.'
  });
});

