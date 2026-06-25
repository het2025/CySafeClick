import { Injectable } from '@angular/core';

export interface WifiQuestion {
  id: string;
  text: string;
  options: { label: string; score: number; risk: 'low' | 'medium' | 'high'; explanation?: string }[];
  category: 'Network Config' | 'Router Security' | 'User Habits' | 'Privacy';
}

@Injectable({ providedIn: 'root' })
export class WifiSafetyService {
  
  getQuestions(): WifiQuestion[] {
    return [
      {
        id: 'q1',
        text: 'What type of network are you on?',
        category: 'User Habits',
        options: [
          { label: 'Home WiFi', score: 10, risk: 'low' },
          { label: 'Mobile Data (4G/5G)', score: 10, risk: 'low' },
          { label: 'Work/Office WiFi', score: 8, risk: 'low' },
          { label: 'Public WiFi (café/airport/hotel)', score: 0, risk: 'high', explanation: 'Public WiFi networks are inherently insecure. Anyone on the network can potentially intercept your traffic.' }
        ]
      },
      {
        id: 'q2',
        text: 'What security protocol does your router use?',
        category: 'Router Security',
        options: [
          { label: 'WPA3 (most secure)', score: 10, risk: 'low' },
          { label: 'WPA2', score: 7, risk: 'low' },
          { label: 'WPA', score: 2, risk: 'medium', explanation: 'WPA is outdated and can be easily cracked.' },
          { label: 'WEP', score: 0, risk: 'high', explanation: 'WEP is severely compromised and offers almost no protection.' },
          { label: 'Open (no password)', score: 0, risk: 'high', explanation: 'An open network allows anyone to connect and intercept traffic.' },
          { label: 'I don\'t know', score: 0, risk: 'medium', explanation: 'Check your router settings (usually at 192.168.1.1 or 192.168.0.1) to ensure it uses at least WPA2.' }
        ]
      },
      {
        id: 'q3',
        text: 'Have you changed your router\'s default admin password?',
        category: 'Router Security',
        options: [
          { label: 'Yes, changed it', score: 10, risk: 'low' },
          { label: 'No, using default', score: 0, risk: 'high', explanation: 'Default passwords (like admin/admin) are publicly known and heavily targeted by malware.' },
          { label: 'Don\'t know what this is', score: 0, risk: 'high', explanation: 'Your router has an admin panel separate from your WiFi password. It needs a strong password.' }
        ]
      },
      {
        id: 'q4',
        text: 'Is your router\'s admin panel accessible from the internet?',
        category: 'Network Config',
        options: [
          { label: 'I\'ve checked and it\'s not', score: 10, risk: 'low' },
          { label: 'I haven\'t checked', score: 5, risk: 'medium' },
          { label: 'Yes it is', score: 0, risk: 'high', explanation: 'Remote management allows hackers to brute-force your router from anywhere in the world. Disable it immediately.' }
        ]
      },
      {
        id: 'q5',
        text: 'How often does your router receive firmware updates?',
        category: 'Router Security',
        options: [
          { label: 'Automatically updated', score: 10, risk: 'low' },
          { label: 'I update it manually', score: 8, risk: 'low' },
          { label: 'Never updated', score: 0, risk: 'high', explanation: 'Outdated firmware contains known vulnerabilities that attackers can exploit.' },
          { label: 'Don\'t know', score: 2, risk: 'medium' }
        ]
      },
      {
        id: 'q6',
        text: 'Do you have a separate Guest WiFi network for visitors?',
        category: 'Network Config',
        options: [
          { label: 'Yes, guests use a separate network', score: 10, risk: 'low' },
          { label: 'No, everyone uses the same', score: 3, risk: 'medium', explanation: 'If a guest\'s device is infected, it can spread malware to your main network devices.' },
          { label: 'I don\'t have guests', score: 10, risk: 'low' }
        ]
      },
      {
        id: 'q7',
        text: 'Is UPnP (Universal Plug and Play) disabled on your router?',
        category: 'Network Config',
        options: [
          { label: 'Yes, it\'s disabled', score: 10, risk: 'low' },
          { label: 'No/Don\'t know', score: 0, risk: 'high', explanation: 'UPnP allows devices to automatically open ports on your firewall, which malware often exploits to expose your network to the internet.' }
        ]
      },
      {
        id: 'q8',
        text: 'Do you use a VPN when accessing sensitive accounts?',
        category: 'User Habits',
        options: [
          { label: 'Always', score: 10, risk: 'low' },
          { label: 'Sometimes', score: 5, risk: 'medium' },
          { label: 'Never', score: 0, risk: 'high', explanation: 'A VPN encrypts your traffic, protecting you especially on public or untrusted networks.' },
          { label: 'What is a VPN?', score: 0, risk: 'high' }
        ]
      },
      {
        id: 'q9',
        text: 'Have you checked which devices are connected to your WiFi?',
        category: 'User Habits',
        options: [
          { label: 'Yes, regularly', score: 10, risk: 'low' },
          { label: 'Checked once', score: 5, risk: 'medium' },
          { label: 'Never', score: 0, risk: 'medium', explanation: 'Check your router admin panel to ensure no unauthorized devices are leeching your connection or snooping on your traffic.' }
        ]
      },
      {
        id: 'q10',
        text: 'Is your WiFi network name (SSID) something that identifies you or your location?',
        category: 'Privacy',
        options: [
          { label: 'No, it\'s generic', score: 10, risk: 'low' },
          { label: 'Yes, it has my name/address/flat number', score: 0, risk: 'medium', explanation: 'Using personal info in your SSID broadcasts your identity and exact location to anyone in range.' },
          { label: 'Don\'t know why it matters', score: 0, risk: 'medium' }
        ]
      }
    ];
  }
}
