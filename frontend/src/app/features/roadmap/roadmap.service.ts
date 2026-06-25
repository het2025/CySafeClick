import { Injectable } from '@angular/core';

export interface RoadmapTask {
  day: number;
  title: string;
  description: string;
  instructions: string[];
  link?: string;
  week: number;
}

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  
  getTasks(): RoadmapTask[] {
    return [
      { day: 1, week: 1, title: 'Enable 2FA on Gmail', description: 'Protect your primary email account.', instructions: ['Go to myaccount.google.com/security', 'Select 2-Step Verification', 'Follow the prompts to add an Authenticator app'] },
      { day: 2, week: 1, title: 'Use a Passphrase', description: 'Change your main Google password to a passphrase.', instructions: ['Pick 4 random words (e.g. CorrectHorseBatteryStaple)', 'Update your Google password'] },
      { day: 3, week: 1, title: 'Enable 2FA on Banking App', description: 'Secure your primary banking app.', instructions: ['Open your banking app settings', 'Look for Security or 2FA', 'Enable biometric or app-based 2FA if available'] },
      { day: 4, week: 1, title: 'Google Security Checkup', description: 'Run the official checkup tool.', instructions: ['Visit myaccount.google.com/security-checkup', 'Review and resolve all flagged issues'] },
      { day: 5, week: 1, title: 'Review Connected Apps', description: 'Remove access for apps you no longer use.', instructions: ['Go to Google Account > Security', 'Find "Third-party apps with account access"', 'Remove unknown apps'] },
      { day: 6, week: 1, title: 'Enable Phone Screen Lock', description: 'Ensure your phone requires a PIN or Biometric.', instructions: ['Go to Phone Settings > Security', 'Enable Screen Lock'] },
      { day: 7, week: 1, title: 'Week 1 Review', description: 'Check your overall progress.', instructions: ['Take a moment to ensure all 6 previous days are fully completed'] },
      { day: 8, week: 2, title: 'WhatsApp Privacy Audit', description: 'Secure your WhatsApp account.', instructions: ['Go to WhatsApp Settings > Privacy', 'Set Last Seen & Profile Photo to "My Contacts"'] },
      { day: 9, week: 2, title: 'Instagram Privacy Audit', description: 'Secure your Instagram account.', instructions: ['Go to IG Settings > Privacy', 'Consider making your account Private'] },
      { day: 10, week: 2, title: 'Facebook Privacy Audit', description: 'Secure your Facebook account.', instructions: ['Run the Privacy Checkup in FB settings', 'Limit who can see your future posts to "Friends"'] },
      { day: 11, week: 2, title: 'Check LinkedIn Privacy', description: 'Remove personal contact info from public view.', instructions: ['Go to LinkedIn Profile > Contact Info', 'Ensure phone/email are visible only to connections'] },
      { day: 12, week: 2, title: 'Revoke App Permissions', description: 'Remove risky permissions on your phone.', instructions: ['Go to Phone Settings > Apps > Permissions Manager', 'Remove camera/mic/location from apps that don\'t need them'] },
      { day: 13, week: 2, title: 'Delete Unused Apps', description: 'Reduce your attack surface.', instructions: ['Uninstall apps you haven\'t used in the last 3 months'] },
      { day: 14, week: 2, title: 'Week 2 Review', description: 'Review social media lock down.', instructions: ['Ensure all privacy audits are complete'] },
      { day: 15, week: 3, title: 'Update Phone OS', description: 'Install the latest security patches.', instructions: ['Go to Settings > System > System Update', 'Install any pending updates'] },
      { day: 16, week: 3, title: 'Update All Apps', description: 'Patch vulnerabilities in your installed apps.', instructions: ['Open Play Store / App Store', 'Update all pending apps', 'Enable Auto-update'] },
      { day: 17, week: 3, title: 'Run WiFi Safety Test', description: 'Check if your home network is secure.', instructions: ['Use the CySafeClick WiFi Safety Tester tool'] },
      { day: 18, week: 3, title: 'Change Router Password', description: 'Secure your home router admin panel.', instructions: ['Log into your router (e.g. 192.168.1.1)', 'Change the default admin password'] },
      { day: 19, week: 3, title: 'Install Antivirus', description: 'Add a layer of defense (especially on Windows/Android).', instructions: ['Install a reputable free AV like Bitdefender or Avast', 'Run a full system scan'] },
      { day: 20, week: 3, title: 'Encrypt Phone Storage', description: 'Protect data if your phone is stolen.', instructions: ['Go to Settings > Security', 'Ensure Device Encryption is active'] },
      { day: 21, week: 3, title: 'Week 3 Review', description: 'Review device & network security.', instructions: ['Confirm your router and OS are fully updated'] },
      { day: 22, week: 4, title: 'Lock Aadhaar Biometrics', description: 'Prevent Aadhaar cloning fraud.', instructions: ['Visit myaadhaar.uidai.gov.in', 'Login and click "Lock/Unlock Biometrics"'] },
      { day: 23, week: 4, title: 'Download Masked Aadhaar', description: 'Get a safer version of your ID.', instructions: ['Download Aadhaar from UIDAI and check the "Masked" option'] },
      { day: 24, week: 4, title: 'Google Yourself', description: 'See what data is publicly available about you.', instructions: ['Search your full name, phone number, and address in quotes'] },
      { day: 25, week: 4, title: 'Remove from Truecaller', description: 'Unlist your number from public directories.', instructions: ['Visit truecaller.com/unlisting', 'Submit your number for removal'] },
      { day: 26, week: 4, title: 'Check Aadhaar History', description: 'Ensure no unauthorized usage.', instructions: ['Visit myaadhaar.uidai.gov.in', 'Check "Authentication History" for the last 30 days'] },
      { day: 27, week: 4, title: 'Back Up Phone Data', description: 'Protect against ransomware or device loss.', instructions: ['Enable Google One Backup or iCloud Backup', 'Ensure photos and contacts are synced'] },
      { day: 28, week: 4, title: 'Review Location History', description: 'Delete old tracking data.', instructions: ['Go to Google Maps > Timeline', 'Review and delete unnecessary location history'] },
      { day: 29, week: 4, title: 'Set up Google Alerts', description: 'Get notified if your data leaks.', instructions: ['Go to google.com/alerts', 'Create alerts for your email and name'] },
      { day: 30, week: 4, title: 'Final Assessment', description: 'Retake the Digital Safety Quiz.', instructions: ['Take the CySafeClick Digital Safety Quiz', 'Compare your score to Day 0'] }
    ];
  }
}
