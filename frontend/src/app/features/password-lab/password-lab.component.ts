import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/services/translation.service';
import zxcvbn from 'zxcvbn';

@Component({
  selector: 'app-password-lab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container lab-page">
      <h1>Password Lab</h1>
      
      <div class="lab-grid">
        <div class="card">
          <h3>Analyzer</h3>
          <div class="input-wrap">
            <input [type]="showPassword() ? 'text' : 'password'" 
                   [ngModel]="password()"
                   (ngModelChange)="password.set($event); copiedValue.set('')"
                   placeholder="Test a password...">
            <button (click)="showPassword.set(!showPassword())">
              {{ showPassword() ? '🔒' : '👁️' }}
            </button>
          </div>

          <div class="meter">
            @for (seg of [0,1,2,3,4]; track seg) {
              <div class="segment" 
                   [style.background]="password() && seg <= result().score ? colors[result().score] : '#e2e8f0'">
              </div>
            }
          </div>
          <p [style.color]="password() ? colors[result().score] : 'inherit'" style="font-weight: bold">
            Strength: {{ password() ? labels[result().score] : '-' }}
          </p>

          <div class="crack-times">
            <div class="time-box">
              <small>Online Attack (Slow)</small>
              <strong>{{ password() ? result().crack_times_display.online_no_throttling_10_per_second : '-' }}</strong>
            </div>
            <div class="time-box">
              <small>Offline Attack (Fast)</small>
              <strong>{{ password() ? result().crack_times_display.offline_fast_hashing_1e10_per_second : '-' }}</strong>
            </div>
          </div>

          <!-- India-Specific Tips -->
          @if (password() && indiaTips().length > 0) {
            <div class="india-tips">
              <h4>🇮🇳 Smart Tips</h4>
              <ul>
                @for (tip of indiaTips(); track tip) {
                  <li class="india-tip">{{ tip }}</li>
                }
              </ul>
            </div>
          }
        </div>

        <div class="card">
          <h3>Strong Suggestions</h3>
          <p class="muted">Use a password manager. These generated examples are not based on your typed password.</p>
          <button class="generate-btn" (click)="regenerate()">Generate New Suggestions</button>
          @for (v of suggestions(); track v.full) {
              <div class="variant">
                <span>{{ v.masked }}</span>
                <button (click)="copy(v.full)">{{ copiedValue() === v.full ? 'Copied' : 'Copy' }}</button>
              </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .lab-page { padding: 40px 0; }
    .lab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
    .card { background: var(--surface); padding: 24px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .input-wrap { display: flex; gap: 8px; margin-bottom: 16px; align-items: center; }
    .input-wrap input { flex: 1; padding: 12px; border: 2px solid var(--border); border-radius: 8px; }
    .input-wrap button { background: none; border: none; cursor: pointer; font-size: 1.2rem; padding: 0 8px; }
    .meter { height: 10px; display: flex; gap: 4px; margin: 16px 0; }
    .segment { flex: 1; border-radius: 5px; }
    .crack-times { display: flex; gap: 16px; margin-top: 16px; }
    .time-box { flex: 1; background: var(--bg); padding: 12px; border-radius: 8px; text-align: center; }
    .variant { display: flex; justify-content: space-between; align-items: center; background: var(--bg); padding: 12px; margin-bottom: 8px; border-radius: 8px; }
    .variant span { font-family: monospace; font-weight: bold; }
    .variant button { background: var(--primary); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; }
    .generate-btn { margin: 12px 0; padding: 10px 14px; border-radius: 8px; background: var(--accent-saffron); color: var(--primary); font-weight: 800; border: none; cursor: pointer; }
    .india-tips { margin-top: 16px; }
    .india-tips h4 { margin-bottom: 8px; }
    .india-tip { border-left: 4px solid var(--accent-saffron, #ff9933); padding-left: 10px; margin-bottom: 8px; font-size: 0.9rem; }
    @media (max-width: 760px) { .lab-grid { grid-template-columns: 1fr; } .crack-times { flex-direction: column; } }
  `]
})
export class PasswordLabComponent {
  private t = inject(TranslationService);

  password = signal('');
  showPassword = signal(false);
  generationSeed = signal(0);
  copiedValue = signal('');
  
  colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e'];
  labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  result = computed(() => {
    return zxcvbn(this.password() || '');
  });

  /** India-specific password tips driven by i18n word lists */
  indiaTips = computed(() => {
    const pwd = this.password();
    if (!pwd) return [];
    const tips: string[] = [];
    const zResult = this.result();

    // zxcvbn feedback
    if (zResult.feedback.warning) tips.push(zResult.feedback.warning);
    zResult.feedback.suggestions.forEach((s: string) => tips.push(s));

    // Mobile number check
    if (/^[6-9]\d{9}$/.test(pwd)) {
      tips.push(this.t.translate('PWD_LAB.TIPS.MOBILE') || 'Avoid using your mobile number.');
    }

    // Birth year check
    if (/(19|20)\d{2}/.test(pwd)) {
      tips.push(this.t.translate('PWD_LAB.TIPS.YEAR') || 'Avoid using birth years.');
    }

    // Indian common words check (from i18n)
    const rawWords = this.t.translateData('PWD_LAB.INDIAN_WORDS');
    const indianWords: string[] = Array.isArray(rawWords) && rawWords.length > 0
      ? rawWords
      : ['india', 'bharat', 'sachin', 'dhoni', 'ipl', 'rahul', 'priya', 'delhi', 'mumbai'];
    if (indianWords.some(w => pwd.toLowerCase().includes(w))) {
      tips.push(this.t.translate('PWD_LAB.TIPS.COMMON_NAME') || 'Avoid common Indian names, cities, or cricket terms.');
    }

    // Excellent password
    if (tips.length === 0 && zResult.score === 4) {
      tips.push(this.t.translate('PWD_LAB.TIPS.EXCELLENT') || 'Excellent! Very strong password.');
    }

    return tips;
  });

  suggestions = computed(() => {
    this.generationSeed();
    return [
      this.makeSuggestion('words'),
      this.makeSuggestion('random'),
      this.makeSuggestion('passphrase')
    ];
  });

  regenerate() {
    this.generationSeed.update(v => v + 1);
    this.copiedValue.set('');
  }

  async copy(text: string) {
    await navigator.clipboard.writeText(text);
    this.copiedValue.set(text);
  }

  private makeSuggestion(type: 'words' | 'random' | 'passphrase') {
    const rawPassphraseWords = this.t.translateData('PWD_LAB.PASSPHRASE_WORDS');
    const passphrasePool = Array.isArray(rawPassphraseWords) && rawPassphraseWords.length > 0
      ? rawPassphraseWords
      : ['apple', 'mountain', 'river', 'delta', 'tiger'];
    const words = ['river', 'orbit', 'mango', 'shield', 'copper', 'lotus', 'pixel', 'harbor', ...passphrasePool];

    if (type === 'random') {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*';
      const full = Array.from({ length: 18 }, () => chars[this.randomInt(chars.length)]).join('');
      return { full, masked: `${full.slice(0, 4)}************${full.slice(-2)}` };
    }
    const selected = Array.from({ length: type === 'words' ? 3 : 4 }, () => words[this.randomInt(words.length)]);
    const full = `${selected.join('-')}-${this.randomInt(90) + 10}!`;
    return { full, masked: `${selected[0]}-****-****!` };
  }

  private randomInt(max: number): number {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] % max;
  }
}
