import { Injectable } from '@angular/core';

export interface Permission {
  id: string;
  name: string;
  group: 'Communication' | 'Location' | 'Storage' | 'Device' | 'System';
  riskScore: number;
  description: string;
  selected?: boolean;
}

export interface AppCategory {
  id: string;
  name: string;
  expectedPermissions: string[];
}

export interface PermissionScanResult {
  overallRisk: number; // 0-100
  riskLevel: 'safe' | 'suspicious' | 'dangerous';
  dangerousCombos: { name: string; description: string; points: number }[];
  categoryMismatches: { permission: string; reason: string }[];
  highRiskPermissions: Permission[];
  recommendations: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AppPermissionsService {
  
  readonly PERMISSIONS: Permission[] = [
    // Communication
    { id: 'CAMERA', name: 'Camera', group: 'Communication', riskScore: 30, description: 'Can take pictures and videos.' },
    { id: 'MICROPHONE', name: 'Microphone', group: 'Communication', riskScore: 35, description: 'Can record audio.' },
    { id: 'READ_CONTACTS', name: 'Read Contacts', group: 'Communication', riskScore: 40, description: 'Can read your address book.' },
    { id: 'READ_CALL_LOG', name: 'Read Call Log', group: 'Communication', riskScore: 45, description: 'Can see who you called.' },
    { id: 'READ_SMS', name: 'Read SMS', group: 'Communication', riskScore: 60, description: 'Can read your text messages (including OTPs).' },
    { id: 'SEND_SMS', name: 'Send SMS', group: 'Communication', riskScore: 60, description: 'Can send messages that may cost money.' },
    
    // Location
    { id: 'ACCESS_FINE_LOCATION', name: 'Precise Location', group: 'Location', riskScore: 40, description: 'Can track your exact GPS location.' },
    { id: 'ACCESS_BACKGROUND_LOCATION', name: 'Background Location', group: 'Location', riskScore: 60, description: 'Can track you even when the app is closed.' },
    
    // Storage
    { id: 'MANAGE_EXTERNAL_STORAGE', name: 'Manage All Files', group: 'Storage', riskScore: 70, description: 'Has full access to all your files and photos.' },
    
    // Device
    { id: 'READ_PHONE_STATE', name: 'Read Phone Status', group: 'Device', riskScore: 30, description: 'Can read phone number and network details.' },
    
    // System
    { id: 'REQUEST_INSTALL_PACKAGES', name: 'Install Unknown Apps', group: 'System', riskScore: 80, description: 'Can silently install other (potentially malicious) apps.' },
    { id: 'SYSTEM_ALERT_WINDOW', name: 'Display Over Other Apps', group: 'System', riskScore: 70, description: 'Can draw overlays (used to steal taps/passwords).' },
    { id: 'ACCESSIBILITY_SERVICE', name: 'Accessibility Service', group: 'System', riskScore: 90, description: 'Can read EVERYTHING on your screen and tap buttons for you. Highly dangerous.' },
    { id: 'DEVICE_ADMIN', name: 'Device Administrator', group: 'System', riskScore: 85, description: 'Can wipe your phone or lock it (ransomware risk).' },
    { id: 'BIND_NOTIFICATION_LISTENER_SERVICE', name: 'Read Notifications', group: 'System', riskScore: 75, description: 'Can read all incoming notifications, including banking OTPs.' }
  ];

  readonly CATEGORIES: AppCategory[] = [
    { id: 'flashlight', name: 'Flashlight / Utility', expectedPermissions: ['CAMERA'] },
    { id: 'calculator', name: 'Calculator', expectedPermissions: [] },
    { id: 'game', name: 'Game', expectedPermissions: [] }, // Modern games rarely need contacts/sms
    { id: 'photo_editor', name: 'Photo Editor', expectedPermissions: ['CAMERA', 'MANAGE_EXTERNAL_STORAGE'] },
    { id: 'social_media', name: 'Social Media', expectedPermissions: ['CAMERA', 'MICROPHONE', 'READ_CONTACTS', 'ACCESS_FINE_LOCATION', 'MANAGE_EXTERNAL_STORAGE'] },
    { id: 'banking', name: 'Banking / Payment', expectedPermissions: ['CAMERA', 'ACCESS_FINE_LOCATION', 'READ_PHONE_STATE', 'READ_SMS'] }, // Read SMS is common for OTP auto-read in India
    { id: 'navigation', name: 'Maps / Navigation', expectedPermissions: ['ACCESS_FINE_LOCATION', 'ACCESS_BACKGROUND_LOCATION'] },
    { id: 'other', name: 'Other', expectedPermissions: [] }
  ];

  analyze(categoryId: string, selectedIds: string[]): PermissionScanResult {
    let score = 0;
    const category = this.CATEGORIES.find(c => c.id === categoryId) || this.CATEGORIES[this.CATEGORIES.length - 1];
    const selectedPerms = this.PERMISSIONS.filter(p => selectedIds.includes(p.id));
    
    const dangerousCombos = [];
    const categoryMismatches = [];
    const highRiskPermissions = [];
    const recommendations = [];

    // Individual Risk Calculation
    for (const perm of selectedPerms) {
      if (perm.riskScore >= 70) {
        highRiskPermissions.push(perm);
      }
      
      // Category Mismatch
      if (category.id !== 'other' && !category.expectedPermissions.includes(perm.id)) {
        // Exclude system perms from general mismatch if they are just high risk, wait, no, they are always a mismatch for standard apps
        if (perm.riskScore >= 30) {
          categoryMismatches.push({
            permission: perm.name,
            reason: `A ${category.name} app generally does not need access to ${perm.name}.`
          });
          score += 15; // Penalty for mismatch
        }
      }
    }

    // Dangerous Combinations
    const has = (id: string) => selectedIds.includes(id);

    if (has('CAMERA') && has('MICROPHONE') && has('READ_CONTACTS') && has('ACCESS_FINE_LOCATION')) {
      dangerousCombos.push({ name: 'Spyware Profile', description: 'This combination allows the app to completely monitor your real-life surroundings and contacts.', points: 40 });
      score += 40;
    }

    if (has('READ_SMS') && has('ACCESSIBILITY_SERVICE') && has('SEND_SMS')) {
      dangerousCombos.push({ name: 'Banking Trojan Profile', description: 'Can read OTPs from SMS or screen and forward them to a scammer.', points: 50 });
      score += 50;
    }

    if (has('ACCESS_BACKGROUND_LOCATION') && has('READ_CALL_LOG') && has('READ_CONTACTS') && has('MICROPHONE')) {
      dangerousCombos.push({ name: 'Stalkerware Profile', description: 'Often used by stalkerware to track your movements and conversations silently.', points: 45 });
      score += 45;
    }

    if (has('MANAGE_EXTERNAL_STORAGE') && has('DEVICE_ADMIN') && has('REQUEST_INSTALL_PACKAGES')) {
      dangerousCombos.push({ name: 'Ransomware Risk', description: 'Can install malicious payloads, encrypt/delete files, and lock you out of your device.', points: 40 });
      score += 40;
    }

    // Base score from highest individual permission
    const maxIndividual = selectedPerms.length > 0 ? Math.max(...selectedPerms.map(p => p.riskScore)) : 0;
    score += maxIndividual;

    // Cap at 100
    score = Math.min(100, score);

    let riskLevel: 'safe' | 'suspicious' | 'dangerous' = 'safe';
    if (score >= 75) {
      riskLevel = 'dangerous';
      recommendations.push('Uninstall this application immediately if you do not completely trust the developer.');
      if (has('ACCESSIBILITY_SERVICE') || has('DEVICE_ADMIN')) {
        recommendations.push('Go to Settings > Accessibility / Device Admins and revoke the permission first, then uninstall.');
      }
    } else if (score >= 40) {
      riskLevel = 'suspicious';
      recommendations.push('Review the permissions in Settings and disable any that seem unnecessary.');
    } else {
      recommendations.push('Permissions seem reasonable for this app category.');
    }

    if (categoryMismatches.length > 0) {
      recommendations.push('Consider why this app needs permissions unrelated to its core function.');
    }

    return {
      overallRisk: score,
      riskLevel,
      dangerousCombos,
      categoryMismatches,
      highRiskPermissions,
      recommendations
    };
  }
}
