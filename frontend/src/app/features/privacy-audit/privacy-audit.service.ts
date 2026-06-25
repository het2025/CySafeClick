import { Injectable } from '@angular/core';

export interface PrivacyCheckItem {
  id: string;
  category: 'profile' | 'posts' | 'contacts' | 'location' | 'data' | 'security';
  title: string;
  description: string;
  currentStatus: 'unknown' | 'safe' | 'risky';
  howToFix: string[];
  riskIfIgnored: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PrivacyPlatform {
  id: string;
  name: string;
  icon: string;
  checklist: PrivacyCheckItem[];
}

@Injectable({
  providedIn: 'root'
})
export class PrivacyAuditService {

  readonly PLATFORMS: PrivacyPlatform[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: '💬',
      checklist: [
        {
          id: 'wa-1', category: 'profile', title: 'Last Seen & Online',
          description: 'Who can see when you were last active.',
          currentStatus: 'unknown', severity: 'medium',
          riskIfIgnored: 'Stalkers can monitor your sleeping/waking patterns.',
          howToFix: ['Settings', 'Privacy', 'Last seen and online', 'Select "Nobody" or "My Contacts"']
        },
        {
          id: 'wa-2', category: 'profile', title: 'Profile Photo',
          description: 'Who can see your profile picture.',
          currentStatus: 'unknown', severity: 'high',
          riskIfIgnored: 'Scammers can steal your photo to create fake accounts and scam your friends.',
          howToFix: ['Settings', 'Privacy', 'Profile Photo', 'Select "My Contacts"']
        },
        {
          id: 'wa-3', category: 'security', title: 'Two-Step Verification',
          description: 'Adds a PIN required to register your phone number again.',
          currentStatus: 'unknown', severity: 'critical',
          riskIfIgnored: 'If a scammer tricks you into sharing your SMS OTP, they can steal your entire WhatsApp account.',
          howToFix: ['Settings', 'Account', 'Two-step verification', 'Tap "Turn on" and enter a 6-digit PIN']
        },
        {
          id: 'wa-4', category: 'security', title: 'Linked Devices',
          description: 'Review computers or browsers logged into your account.',
          currentStatus: 'unknown', severity: 'high',
          riskIfIgnored: 'Someone might have secret access to all your chats.',
          howToFix: ['Go to main chat list', 'Tap 3 dots (menu)', 'Linked devices', 'Log out of any unfamiliar devices']
        },
        {
          id: 'wa-5', category: 'contacts', title: 'Who Can Add You to Groups',
          description: 'Control who can randomly add you to group chats.',
          currentStatus: 'unknown', severity: 'medium',
          riskIfIgnored: 'You could be added to scam investment groups or explicit content groups.',
          howToFix: ['Settings', 'Privacy', 'Groups', 'Select "My Contacts"']
        },
        {
          id: 'wa-6', category: 'location', title: 'Live Location',
          description: 'Check if you are actively sharing your real-time location.',
          currentStatus: 'unknown', severity: 'high',
          riskIfIgnored: 'Physical safety risk if location is shared with wrong people.',
          howToFix: ['Settings', 'Privacy', 'Live location', 'Ensure it says "None"']
        },
        {
          id: 'wa-7', category: 'security', title: 'Screen Lock',
          description: 'Require Face ID / Fingerprint to open WhatsApp.',
          currentStatus: 'unknown', severity: 'medium',
          riskIfIgnored: 'Anyone holding your unlocked phone can read your chats.',
          howToFix: ['Settings', 'Privacy', 'App lock', 'Turn on biometric lock']
        },
        {
          id: 'wa-8', category: 'contacts', title: 'Silence Unknown Callers',
          description: 'Mutes calls from numbers not in your contacts.',
          currentStatus: 'unknown', severity: 'low',
          riskIfIgnored: 'You will receive spam/scam voice and video calls.',
          howToFix: ['Settings', 'Privacy', 'Calls', 'Turn on "Silence Unknown Callers"']
        },
        {
          id: 'wa-9', category: 'profile', title: 'About section',
          description: 'Who can see your text status/bio.',
          currentStatus: 'unknown', severity: 'low',
          riskIfIgnored: 'Exposes personal info to random numbers.',
          howToFix: ['Settings', 'Privacy', 'About', 'Select "My Contacts"']
        },
        {
          id: 'wa-10', category: 'data', title: 'Chat Backup Encryption',
          description: 'Ensures Google/Apple cannot read your chat backups.',
          currentStatus: 'unknown', severity: 'medium',
          riskIfIgnored: 'Law enforcement or hackers breaching your cloud account could read your chat history.',
          howToFix: ['Settings', 'Chats', 'Chat backup', 'End-to-end encrypted backup', 'Turn On']
        }
      ]
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: '📸',
      checklist: [
        {
          id: 'ig-1', category: 'profile', title: 'Private Account',
          description: 'Only approved followers can see your posts.',
          currentStatus: 'unknown', severity: 'high',
          riskIfIgnored: 'Anyone can view, screenshot, and download your personal photos.',
          howToFix: ['Settings and privacy', 'Account privacy', 'Toggle "Private account" ON']
        },
        {
          id: 'ig-2', category: 'security', title: 'Two-Factor Authentication',
          description: 'Requires a code to log in from a new device.',
          currentStatus: 'unknown', severity: 'critical',
          riskIfIgnored: 'Your account can be hacked with just a stolen password.',
          howToFix: ['Settings and privacy', 'Accounts Center', 'Password and security', 'Two-factor authentication']
        },
        {
          id: 'ig-3', category: 'posts', title: 'Tags and Mentions',
          description: 'Who can tag you in photos or mention you.',
          currentStatus: 'unknown', severity: 'medium',
          riskIfIgnored: 'Scammers can tag you in fake giveaway posts, spamming your followers.',
          howToFix: ['Settings and privacy', 'Tags and mentions', 'Set "Who can tag you" to "Allow tags from people you follow"']
        },
        {
          id: 'ig-4', category: 'profile', title: 'Activity Status',
          description: 'Shows when you are online or typing.',
          currentStatus: 'unknown', severity: 'low',
          riskIfIgnored: 'People can stalk exactly when you are active on the app.',
          howToFix: ['Settings and privacy', 'Messages and story replies', 'Show activity status', 'Toggle OFF']
        },
        {
          id: 'ig-5', category: 'contacts', title: 'Message Requests',
          description: 'Who can send you direct messages.',
          currentStatus: 'unknown', severity: 'high',
          riskIfIgnored: 'You will receive scam links, harassment, or explicit images from strangers.',
          howToFix: ['Settings and privacy', 'Messages and story replies', 'Message controls', 'Set unknown requests to "Don\'t receive requests"']
        },
        {
          id: 'ig-6', category: 'data', title: 'Connected Apps and Websites',
          description: 'Third-party services that have access to your IG data.',
          currentStatus: 'unknown', severity: 'medium',
          riskIfIgnored: 'Sketchy apps (like "who viewed your profile" apps) can hijack your account or steal data.',
          howToFix: ['Settings and privacy', 'Website permissions', 'Apps and websites', 'Remove unknown apps']
        },
        {
          id: 'ig-7', category: 'security', title: 'Login Activity',
          description: 'Where you are currently logged in.',
          currentStatus: 'unknown', severity: 'high',
          riskIfIgnored: 'A hacker might already have persistent access to your account.',
          howToFix: ['Settings and privacy', 'Accounts Center', 'Password and security', 'Where you\'re logged in', 'Log out of unfamiliar locations']
        }
      ]
    }
  ];

  getPlatform(id: string): PrivacyPlatform | undefined {
    return this.PLATFORMS.find(p => p.id === id);
  }
}
