import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as SafetyScoreActions from '../../store/safety-score/safety-score.actions';
import { ProgressRingComponent } from '../../shared/components/progress-ring/progress-ring.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

interface Question {
  text: string;
  category: 'Password Hygiene' | 'Device Security' | 'Network Safety' | 'App Hygiene' | 'Backup & Recovery';
  options: { label: string; score: number; isGood: boolean }[];
  recommendation: string;
}

@Component({
  selector: 'app-safety-score',
  standalone: true,
  imports: [CommonModule, ProgressRingComponent, RiskBadgeComponent, TranslatePipe],
  templateUrl: './safety-score.component.html',
  styleUrls: ['./safety-score.component.scss']
})
export class SafetyScoreComponent implements OnInit {
  private store = inject(Store<AppState>);
  protected readonly Math = Math;

  questions: Question[] = [
    // Password Hygiene
    { category: 'Password Hygiene', text: 'How do you generate and store passwords?', options: [{ label: 'I use a Password Manager', score: 20, isGood: true }, { label: 'I memorize a few and reuse them', score: 0, isGood: false }], recommendation: 'Use a Password Manager (like Bitwarden or 1Password) to generate and store unique passwords.' },
    { category: 'Password Hygiene', text: 'Do you have Two-Factor Authentication (2FA) enabled?', options: [{ label: 'Yes, on all important accounts', score: 20, isGood: true }, { label: 'Only on banking apps', score: 10, isGood: false }, { label: 'No', score: 0, isGood: false }], recommendation: 'Enable 2FA (preferably via an Authenticator App) on all email, social, and banking accounts.' },
    // Device Security
    { category: 'Device Security', text: 'How is your phone locked?', options: [{ label: 'PIN/Biometric', score: 20, isGood: true }, { label: 'Swipe Pattern', score: 10, isGood: false }, { label: 'No Lock', score: 0, isGood: false }], recommendation: 'Set a strong PIN (at least 6 digits) and enable Biometric unlock.' },
    { category: 'Device Security', text: 'Do you install OS updates?', options: [{ label: 'Automatically/Immediately', score: 20, isGood: true }, { label: 'Sometimes, when forced', score: 10, isGood: false }, { label: 'Rarely/Never', score: 0, isGood: false }], recommendation: 'Enable automatic OS updates to patch known security vulnerabilities instantly.' },
    // Network Safety
    { category: 'Network Safety', text: 'When using Public WiFi, do you use a VPN?', options: [{ label: 'Always', score: 20, isGood: true }, { label: 'Never, or I don\'t know what a VPN is', score: 0, isGood: false }], recommendation: 'Never log into sensitive accounts on Public WiFi without a trusted VPN.' },
    { category: 'Network Safety', text: 'Have you changed your home router\'s admin password?', options: [{ label: 'Yes', score: 20, isGood: true }, { label: 'No/Not sure', score: 0, isGood: false }], recommendation: 'Log into your router settings (usually 192.168.1.1) and change the default admin password.' },
    // App Hygiene
    { category: 'App Hygiene', text: 'Where do you download apps from?', options: [{ label: 'Only official stores (Play Store/App Store)', score: 20, isGood: true }, { label: 'Sometimes from web links (APK files)', score: 0, isGood: false }], recommendation: 'Never sideload APKs from untrusted links sent via WhatsApp or Telegram.' },
    { category: 'App Hygiene', text: 'Do you review app permissions?', options: [{ label: 'Yes, I deny unnecessary access', score: 20, isGood: true }, { label: 'I usually accept all to make the app work', score: 0, isGood: false }], recommendation: 'Go to Settings > Privacy > Permission Manager and revoke camera/mic/contacts access for apps that don\'t need them.' },
    // Backup & Recovery
    { category: 'Backup & Recovery', text: 'Is your important data backed up?', options: [{ label: 'Yes, automatically to cloud/hard drive', score: 20, isGood: true }, { label: 'No', score: 0, isGood: false }], recommendation: 'Enable automatic cloud backups (Google Drive/iCloud) for your photos and contacts.' },
    { category: 'Backup & Recovery', text: 'Do you have a recovery email/phone set up for your main accounts?', options: [{ label: 'Yes, and it is up to date', score: 20, isGood: true }, { label: 'No', score: 0, isGood: false }], recommendation: 'Ensure your recovery email and phone number are correct in your Google/Apple account settings.' }
  ];

  step = signal(0);
  finished = signal(false);
  answers = signal<number[]>([]);
  history = signal<{date: string, score: number}[]>([]);

  ngOnInit() {
    this.store.select('safetyScore').subscribe(state => {
      if (state) {
        this.history.set(state.history);
      }
    });
  }

  totalScore = computed(() => {
    const rawSum = this.answers().reduce((a, b) => a + b, 0);
    return Math.round((rawSum / (this.questions.length * 20)) * 100);
  });

  grade = computed(() => {
    const s = this.totalScore();
    if (s >= 90) return 'A';
    if (s >= 75) return 'B';
    if (s >= 60) return 'C';
    if (s >= 40) return 'D';
    return 'F';
  });

  categoryScores = computed(() => {
    const scores = new Map<string, { earned: number, total: number, good: string[], bad: string[] }>();
    
    this.questions.forEach((q, idx) => {
      const ansScore = this.answers()[idx];
      if (ansScore === undefined) return;
      
      const current = scores.get(q.category) || { earned: 0, total: 0, good: [], bad: [] };
      const selectedOpt = q.options.find(o => o.score === ansScore);
      
      if (selectedOpt) {
        if (selectedOpt.isGood) current.good.push(q.text);
        else current.bad.push(q.recommendation);
      }

      scores.set(q.category, {
        earned: current.earned + ansScore,
        total: current.total + 20,
        good: current.good,
        bad: current.bad
      });
    });
    return scores;
  });

  topRisks = computed(() => {
    const risks: string[] = [];
    this.categoryScores().forEach((data, category) => {
      if (data.bad.length > 0) {
        risks.push(...data.bad);
      }
    });
    return risks.slice(0, 3); // Return top 3
  });

  scoreImprovement = computed(() => {
    if (this.history().length === 0) return null;
    const previousScore = this.history()[this.history().length - 1].score;
    return this.totalScore() - previousScore;
  });

  answer(score: number) {
    this.answers.update(a => [...a, score]);
    
    if (this.step() < this.questions.length - 1) {
      this.step.update(v => v + 1);
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    const score = this.totalScore();
    this.store.dispatch(SafetyScoreActions.saveScore({ score, dateStr: new Date().toISOString() }));
    this.finished.set(true);
  }

  reset() {
    this.step.set(0);
    this.answers.set([]);
    this.finished.set(false);
  }

  printReport() {
    window.print();
  }

  getGradeColor() {
    const g = this.grade();
    if (g === 'A') return '#22c55e';
    if (g === 'B') return '#84cc16';
    if (g === 'C') return '#f59e0b';
    if (g === 'D') return '#f97316';
    return '#ef4444';
  }
}
