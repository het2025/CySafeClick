const { asyncHandler } = require('../utils/helpers');
const ScamReport = require('../models/ScamReport');

// GET /api/reports
exports.getReports = asyncHandler(async (req, res) => {
  const { type, page = 1, limit = 20 } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const filter = {};
  if (type) filter.type = type;

  const total = await ScamReport.countDocuments(filter);
  const pages = Math.ceil(total / limitNum);

  const reports = await ScamReport.find(filter)
    .sort({ dateReported: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .lean();

  res.json({
    reports,
    pagination: { total, page: pageNum, pages }
  });
});

// ⚠️ LEGAL NOTICE: Public scam report submissions are DISABLED.
// Enabling these without authentication + verification would violate:
// - IPC §499-500 (Defamation) — unverified accusations against individuals
// - DPDP Act 2023 §4-6 — collecting personal data without lawful basis & consent
// - IT Act 2000 §43A — negligent handling of sensitive personal information
//
// DO NOT re-enable without: (1) user authentication, (2) admin moderation,
// (3) DPDP-compliant consent flow, (4) legal review.

// POST /api/reports — DISABLED
exports.addReport = asyncHandler(async (req, res) => {
  res.status(403).json({
    success: false,
    disabled: true,
    message: 'Public scam report submissions are disabled for legal compliance. Report scams via official channels: call 1930 or visit cybercrime.gov.in.'
  });
});

// PATCH /api/reports/:id/upvote — DISABLED
exports.upvoteReport = asyncHandler(async (req, res) => {
  res.status(403).json({
    success: false,
    disabled: true,
    message: 'This feature is disabled for legal compliance.'
  });
});

