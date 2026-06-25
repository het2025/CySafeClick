import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PrintService } from './print.service';
import { TranslationService } from '../../core/services/translation.service';
import * as QRCode from 'qrcode';

interface SafetyRule {
  id: number;
  icon: string;
  ruleShort: string;
  ruleShortHindi: string;
  ruleDetail: string;
  ruleDetailHindi: string;
  exampleHindi: string;
  severity: 'critical' | 'important' | 'good-habit';
}

interface EmergencyContact {
  name: string;
  nameHindi: string;
  number: string;
  when: string;
  whenHindi: string;
  available: string;
}

interface BankHelpline {
  bank: string;
  number: string;
  tollFree: boolean;
}

interface ScamScript {
  title: string;
  titleHindi: string;
  whatScammerSays: string;
  truth: string;
  truthHindi: string;
  doThis: string;
  doThisHindi: string;
}

interface SeniorGuideData {
  version: string;
  lastUpdated: string;
  rules: SafetyRule[];
  emergencyContacts: EmergencyContact[];
  bankHelplines: BankHelpline[];
  scamScripts: ScamScript[];
  familyNote: string;
  familyNoteHindi: string;
}

@Component({
  selector: 'app-senior-guide',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './senior-guide.component.html',
  styleUrls: ['./senior-guide.component.scss']
})
export class SeniorGuideComponent implements OnInit {
  private http = inject(HttpClient);
  private printService = inject(PrintService);
  public t = inject(TranslationService);

  guideData = signal<SeniorGuideData | null>(null);
  viewMode = signal<'digital' | 'print'>('digital');
  language = computed(() => this.t.currentLang());
  bankSearch = signal('');
  expandedScript = signal<number | null>(null);
  qrCodeDataUrl = signal<string>('');

  filteredBanks = computed(() => {
    const data = this.guideData();
    if (!data) return [];
    const search = this.bankSearch().toLowerCase();
    return data.bankHelplines.filter(b => 
      b.bank.toLowerCase().includes(search) || 
      b.number.includes(search)
    );
  });

  criticalRules = computed(() => 
    this.guideData()?.rules.filter(r => r.severity === 'critical') ?? []
  );

  importantRules = computed(() => 
    this.guideData()?.rules.filter(r => r.severity === 'important') ?? []
  );

  goodHabitRules = computed(() => 
    this.guideData()?.rules.filter(r => r.severity === 'good-habit') ?? []
  );

  ngOnInit() {
    this.http.get<SeniorGuideData>('assets/data/senior-guide.json').subscribe(data => {
      this.guideData.set(data);
    });

    this.generateQRCode();
  }

  async generateQRCode() {
    try {
      const url = window.location.href;
      const dataUrl = await QRCode.toDataURL(url, {
        width: 150,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });
      this.qrCodeDataUrl.set(dataUrl);
    } catch (err) {
      console.error('Error generating QR code', err);
    }
  }

  toggleViewMode(mode: 'digital' | 'print') {
    this.viewMode.set(mode);
  }

  toggleScript(index: number) {
    if (this.expandedScript() === index) {
      this.expandedScript.set(null);
    } else {
      this.expandedScript.set(index);
    }
  }

  print(lang: 'hi' | 'en') {
    if (lang === 'hi') {
      this.printService.printHindi();
    } else {
      this.printService.printEnglish();
    }
  }

  shareOnWhatsApp() {
    const text = encodeURIComponent(this.printService.generateShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  copyShareText() {
    const text = this.printService.generateShareText();
    navigator.clipboard.writeText(text).then(() => {
      alert('Hindi guide text copied to clipboard! You can now paste it in WhatsApp.');
    });
  }
}
