import { Routes } from '@angular/router';

export const routes: Routes = [
  { 
    path: '', 
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent) 
  },
  { 
    path: 'password-lab', 
    loadComponent: () => import('./features/password-lab/password-lab.component').then(m => m.PasswordLabComponent) 
  },
  {
    path: 'ai-tools',
    loadComponent: () => import('./features/ai-tools-hub/ai-tools-hub.component').then(m => m.AiToolsHubComponent),
    title: 'Cycysafeclick AI Tools Hub'
  },
  {
    path: 'ai-tools/scam-analyzer',
    loadComponent: () => import('./features/ai-scam-analyzer/ai-scam-analyzer.component').then(m => m.AiScamAnalyzerComponent),
    title: 'AI Scam Analyzer — Cycysafeclick'
  },
  {
    path: 'ai-tools/transaction-risk',
    loadComponent: () => import('./features/ai-transaction-risk/ai-transaction-risk.component').then(m => m.AiTransactionRiskComponent),
    title: 'AI Transaction Risk — Cycysafeclick'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent),
    title: 'Privacy Policy — Cycysafeclick'
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/terms-of-use/terms-of-use.component').then(m => m.TermsOfUseComponent),
    title: 'Terms of Use — Cycysafeclick'
  },
  { 
    path: 'phishing-detector', 
    loadComponent: () => import('./features/phishing-detector/phishing-detector.component').then(m => m.PhishingDetectorComponent) 
  },
  { 
    path: 'breach-check', 
    loadComponent: () => import('./features/breach-check/breach-check.component').then(m => m.BreachCheckComponent) 
  },
  { 
    path: 'tools/safety-score', 
    loadComponent: () => import('./features/safety-score/safety-score.component').then(m => m.SafetyScoreComponent) 
  },
  { 
    path: 'scam-awareness', 
    loadComponent: () => import('./features/scam-awareness/scam-awareness.component').then(m => m.ScamAwarenessComponent) 
  },
  { 
    path: 'report-cybercrime', 
    loadComponent: () => import('./features/report-cybercrime/report-cybercrime.component').then(m => m.ReportCybercrimeComponent) 
  },
  {
    path: 'tools/upi-scanner',
    loadComponent: () => import('./features/upi-scanner/upi-scanner.component').then(m => m.UpiScannerComponent)
  },
  {
    path: 'tools/app-permissions',
    loadComponent: () => import('./features/app-permissions/app-permissions.component').then(m => m.AppPermissionsComponent)
  },
  {
    path: 'tools/email-header',
    loadComponent: () => import('./features/email-header/email-header.component').then(m => m.EmailHeaderComponent)
  },
  {
    path: 'tools/privacy-audit',
    loadComponent: () => import('./features/privacy-audit/privacy-audit.component').then(m => m.PrivacyAuditComponent)
  },
  {
    path: 'tools/2fa-advisor',
    loadComponent: () => import('./features/two-factor-advisor/two-factor-advisor.component').then(m => m.TwoFactorAdvisorComponent)
  },
  {
    path: 'tools/wifi-safety',
    loadComponent: () => import('./features/wifi-safety/wifi-safety.component').then(m => m.WifiSafetyComponent)
  },
  {
    path: 'learn/tips',
    loadComponent: () => import('./features/daily-tips/tips-library.component').then(m => m.TipsLibraryComponent)
  },
  {
    path: 'learn/scam-stories',
    loadComponent: () => import('./features/scam-stories/scam-stories.component').then(m => m.ScamStoriesComponent)
  },
  {
    path: 'learn/cyber-law',
    loadComponent: () => import('./features/cyber-law/cyber-law.component').then(m => m.CyberLawComponent)
  },
  {
    path: 'threats',
    loadComponent: () => import('./features/threat-feed/threat-feed.component').then(m => m.ThreatFeedComponent)
  },
  {
    path: 'learn/glossary',
    loadComponent: () => import('./features/glossary/glossary.component').then(m => m.GlossaryComponent)
  },
  {
    path: 'learn/30-day-plan',
    loadComponent: () => import('./features/roadmap/roadmap.component').then(m => m.RoadmapComponent)
  },
  {
    path: 'learn/aadhaar-safety',
    loadComponent: () => import('./features/aadhaar-guide/aadhaar-guide.component').then(m => m.AadhaarGuideComponent)
  },
  {
    path: 'tools/osint-check',
    loadComponent: () => import('./features/osint-check/osint-check.component').then(m => m.OsintCheckComponent)
  },
  {
    path: 'tools/cyber-mitra',
    loadComponent: () => import('./features/cyber-mitra/cyber-mitra.component').then(m => m.CyberMitraComponent)
  },
  {
    path: 'tools/incident-response',
    loadComponent: () => import('./features/incident-response/incident-response.component').then(m => m.IncidentResponseComponent)
  },
  {
    path: 'tools/citizen-safety-toolkit',
    loadComponent: () => import('./features/citizen-safety-toolkit/citizen-safety-toolkit.component').then(m => m.CitizenSafetyToolkitComponent),
    title: 'Citizen Cyber Safety Toolkit — Cycysafeclick'
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/stats-dashboard/stats-dashboard.component').then(m => m.StatsDashboardComponent)
  },
  {
    path: 'senior',
    loadComponent: () => import('./features/senior-mode/senior-mode.component').then(m => m.SeniorModeComponent)
  },
  {
    path: 'learn/deepfake-awareness',
    loadComponent: () => import('./features/deepfake-awareness/deepfake-awareness.component').then(m => m.DeepfakeAwarenessComponent)
  },
  {
    path: 'tools/job-scam-detector',
    loadComponent: () => import('./features/job-scam-detector/job-scam-detector.component').then(m => m.JobScamDetectorComponent)
  },
  {
    path: 'tools/investment-scam',
    loadComponent: () => import('./features/investment-scam/investment-scam.component').then(m => m.InvestmentScamComponent)
  },
  {
    path: 'community/quiz-championship',
    loadComponent: () => import('./features/quiz-championship/quiz-championship.component').then(m => m.QuizChampionshipComponent)
  },
  {
    path: 'tools/fact-check',
    loadComponent: () => import('./features/fact-checker/fact-checker.component').then(m => m.FactCheckerComponent)
  },
  {
    path: 'tools/secure-vault',
    loadComponent: () => import('./features/secure-vault/secure-vault.component').then(m => m.SecureVaultComponent)
  },
  {
    path: 'tools/qr-tools',
    loadComponent: () => import('./features/qr-tools/qr-tools.component').then(m => m.QrToolsComponent)
  },
  {
    path: 'tools/matrimonial-safety',
    loadComponent: () => import('./features/matrimonial-safety/matrimonial-safety.component').then(m => m.MatrimonialSafetyComponent)
  },
  {
    path: 'tools/ecommerce-fraud',
    loadComponent: () => import('./features/ecommerce-fraud/ecommerce-fraud.component').then(m => m.EcommerceFraudComponent)
  },
  {
    path: 'learn/child-safety',
    loadComponent: () => import('./features/child-safety/child-safety.component').then(m => m.ChildSafetyComponent)
  },
  {
    path: 'learn/students',
    loadComponent: () => import('./features/student-module/student-module.component').then(m => m.StudentModuleComponent)
  },
  {
    path: 'learn/business-security',
    loadComponent: () => import('./features/business-security/business-security.component').then(m => m.BusinessSecurityComponent)
  },
  {
    path: 'settings/notifications',
    loadComponent: () => import('./features/notifications/notification-settings.component').then(m => m.NotificationSettingsComponent)
  },
  {
    path: 'tools/number-lookup',
    loadComponent: () => import('./features/number-lookup/number-lookup.component').then(m => m.NumberLookupComponent)
  },
  {
    path: 'map',
    loadComponent: () => import('./features/threat-map/threat-map.component').then(c => c.ThreatMapComponent),
    title: 'India Cyber Threat Map — Cycysafeclick'
  },
  {
    path: 'learn/weekly-digest',
    loadComponent: () => import('./features/weekly-digest/weekly-digest-page/weekly-digest-page.component').then(c => c.WeeklyDigestPageComponent),
    title: 'This Week in Cybercrime — Cycysafeclick'
  },
  {
    path: 'learn/senior-guide',
    loadComponent: () => import('./features/senior-guide/senior-guide.component').then(c => c.SeniorGuideComponent),
    title: 'Senior Parents Cyber Safety Guide — Cycysafeclick'
  },
  {
    path: 'learn/regional-scams',
    loadComponent: () => import('./features/regional-scams/regional-scams.component').then(c => c.RegionalScamsComponent),
    title: 'Regional Scam Patterns — Cycysafeclick'
  },
  // Redirect legacy routes if any
  { path: 'safety-score', redirectTo: 'tools/safety-score', pathMatch: 'full' }
];
