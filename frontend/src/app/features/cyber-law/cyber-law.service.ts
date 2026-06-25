import { Injectable } from '@angular/core';

export interface LawSection {
  id: string;
  act: string;
  sectionNumber: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  explanation: string;
  example: string;
  punishment: string;
  category: 'Identity' | 'Privacy' | 'Fraud' | 'Data Protection' | 'Terrorism' | 'Companies';
  reportLink: string;
}

@Injectable({ providedIn: 'root' })
export class CyberLawService {

  getLaws(): LawSection[] {
    return [
      {
        id: 'it-43',
        act: 'IT Act 2000',
        sectionNumber: 'Section 43',
        title: 'Unauthorized Access to Computer Systems',
        severity: 'high',
        explanation: 'If someone hacks into your computer, laptop, or online account without your permission, this section protects you. They can be held liable for damages and forced to pay compensation.',
        example: 'A former colleague guesses your password and logs into your email to read private conversations.',
        punishment: 'Penalty and compensation to the victim.',
        category: 'Privacy',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-43a',
        act: 'IT Act 2000',
        sectionNumber: 'Section 43A',
        title: 'Data Protection by Companies',
        severity: 'medium',
        explanation: 'If a company fails to protect your sensitive personal data (like passwords, financial info) and it gets leaked, they are liable to pay compensation to you.',
        example: 'A food delivery app suffers a data breach and your credit card details are exposed because they didn\'t encrypt the database.',
        punishment: 'Compensation not exceeding ₹5 Crore.',
        category: 'Companies',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-66',
        act: 'IT Act 2000',
        sectionNumber: 'Section 66',
        title: 'Computer Related Offences (Hacking)',
        severity: 'critical',
        explanation: 'This applies if someone dishonestly or fraudulently does any act referred to in Section 43 (unauthorized access, downloading data, introducing viruses).',
        example: 'A hacker infects your computer with ransomware and deletes your important files.',
        punishment: 'Imprisonment up to 3 years, or fine up to ₹5 Lakh, or both.',
        category: 'Fraud',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-66a',
        act: 'IT Act 2000',
        sectionNumber: 'Section 66A',
        title: 'Sending Offensive Messages',
        severity: 'low',
        explanation: 'Struck down by the Supreme Court of India in 2015. You can no longer be arrested under this section for simply posting something "offensive" on social media. It was deemed a violation of free speech.',
        example: 'Posting a political meme or a critical comment on Facebook.',
        punishment: 'N/A (Struck down)',
        category: 'Privacy',
        reportLink: ''
      },
      {
        id: 'it-66b',
        act: 'IT Act 2000',
        sectionNumber: 'Section 66B',
        title: 'Receiving Stolen Computer Resources',
        severity: 'high',
        explanation: 'If someone dishonestly receives a stolen computer, mobile phone, or communication device knowing it is stolen, they can be prosecuted.',
        example: 'Buying a suspiciously cheap, second-hand iPhone from a local market that turns out to be stolen.',
        punishment: 'Imprisonment up to 3 years, or fine up to ₹1 Lakh, or both.',
        category: 'Fraud',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-66c',
        act: 'IT Act 2000',
        sectionNumber: 'Section 66C',
        title: 'Identity Theft',
        severity: 'critical',
        explanation: 'If someone fraudulently uses your electronic signature, password, or any other unique identification feature.',
        example: 'A scammer uses your Aadhaar details and OTP to take a loan in your name, or uses your UPI PIN to transfer money.',
        punishment: 'Imprisonment up to 3 years and fine up to ₹1 Lakh.',
        category: 'Identity',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-66d',
        act: 'IT Act 2000',
        sectionNumber: 'Section 66D',
        title: 'Cheating by Impersonation',
        severity: 'critical',
        explanation: 'If someone uses a computer resource or communication device to cheat by pretending to be someone else.',
        example: 'A fraudster creates a fake Facebook profile with your photo and asks your friends for money, or sets up a fake "Bank Customer Care" number.',
        punishment: 'Imprisonment up to 3 years and fine up to ₹1 Lakh.',
        category: 'Fraud',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-66e',
        act: 'IT Act 2000',
        sectionNumber: 'Section 66E',
        title: 'Violation of Privacy',
        severity: 'critical',
        explanation: 'Capturing, publishing, or transmitting an image of a private area of any person without their consent.',
        example: 'Someone secretly recording you in a private space, or threatening to share intimate photos online (Sextortion).',
        punishment: 'Imprisonment up to 3 years, or fine up to ₹2 Lakh, or both.',
        category: 'Privacy',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-66f',
        act: 'IT Act 2000',
        sectionNumber: 'Section 66F',
        title: 'Cyber Terrorism',
        severity: 'critical',
        explanation: 'Acts done with the intent to threaten the unity, integrity, security, or sovereignty of India, or strike terror in the people, by denying access to authorized personnel, or gaining unauthorized access to critical information infrastructure.',
        example: 'Hacking into the power grid or national defense networks to cause panic and disruption.',
        punishment: 'Life imprisonment.',
        category: 'Terrorism',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-67',
        act: 'IT Act 2000',
        sectionNumber: 'Section 67',
        title: 'Publishing Obscene Material',
        severity: 'high',
        explanation: 'Publishing or transmitting material in electronic form which is lascivious or appeals to the prurient interest.',
        example: 'Sharing or forwarding highly inappropriate and obscene videos in a WhatsApp group.',
        punishment: 'First conviction: Imprisonment up to 3 years and fine up to ₹5 Lakh.',
        category: 'Privacy',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-67b',
        act: 'IT Act 2000',
        sectionNumber: 'Section 67B',
        title: 'Child Pornography',
        severity: 'critical',
        explanation: 'Publishing, transmitting, creating, or collecting material depicting children in sexually explicit acts. This is a severe, non-bailable offense.',
        example: 'Downloading or forwarding images of child exploitation.',
        punishment: 'First conviction: Imprisonment up to 5 years and fine up to ₹10 Lakh.',
        category: 'Privacy',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'it-72',
        act: 'IT Act 2000',
        sectionNumber: 'Section 72',
        title: 'Breach of Confidentiality and Privacy',
        severity: 'medium',
        explanation: 'If any person who has gained access to electronic records or documents under the IT Act discloses them to any other person without consent.',
        example: 'A government official leaks your personal tax records to a third party.',
        punishment: 'Imprisonment up to 2 years, or fine up to ₹1 Lakh, or both.',
        category: 'Privacy',
        reportLink: '/report-cybercrime'
      },
      {
        id: 'dpdp-2023',
        act: 'DPDP Act 2023',
        sectionNumber: 'Digital Personal Data Protection Act',
        title: 'Data Protection & Consent',
        severity: 'high',
        explanation: 'Companies must obtain your clear consent before collecting your personal data. You have the right to know what data is collected and the right to have your data erased.',
        example: 'An app collects your location data without asking for permission, or refuses to delete your account when you request it.',
        punishment: 'Fines on companies ranging from ₹50 Crore to ₹250 Crore for data breaches.',
        category: 'Data Protection',
        reportLink: '/report-cybercrime'
      }
    ];
  }
}
