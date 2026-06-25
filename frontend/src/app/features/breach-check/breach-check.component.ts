import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-breach-check',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container breach-page">
      <h1>Data Breach Check</h1>
      
      <div class="card">
        <p>Uses <strong>k-anonymity</strong> with the Pwned Passwords API. Your full password is never sent to any server.</p>
        <p class="muted">Educational tool only. We do not store your inputs.</p>
        <div class="input-row">
          <input type="password" [(ngModel)]="password" placeholder="Enter password to check...">
          <button (click)="checkPassword()" [disabled]="loading()">Check</button>
        </div>

        @if (loading()) { <div class="spinner"></div> }

        @if (result()) {
          <div class="alert" [class.danger]="count() > 0" [class.safe]="count() === 0">
            @if (count() > 0) {
              This password appeared in <strong>{{ count().toLocaleString() }}</strong> known breaches.
            } @else {
              Good news! This password was not found in any known breaches.
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .breach-page { padding: 40px 0; max-width: 600px; }
    .card { background: var(--surface); padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .input-row { display: flex; gap: 10px; margin: 20px 0; }
    .input-row input { flex: 1; padding: 12px; border: 2px solid var(--border); border-radius: 8px; }
    .input-row button { background: var(--primary); color: white; padding: 0 24px; border-radius: 8px; font-weight: bold; }
    .alert { padding: 16px; border-radius: 8px; margin-top: 20px; border: 1px solid; }
    .alert.danger { background: #fee2e2; color: #b91c1c; border-color: #fca5a5; }
    .alert.safe { background: #dcfce7; color: #15803d; border-color: #86efac; }
    .muted { color: var(--muted); font-size: 0.9rem; }
  `]
})
export class BreachCheckComponent {
  password = signal('');
  loading = signal(false);
  result = signal(false);
  count = signal(0);

  async checkPassword() {
    if (!this.password()) return;
    this.loading.set(true);
    this.result.set(false);

    try {
      const hash = await this.sha1(this.password());
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5).toUpperCase();

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      const text = await response.text();
      
      const lines = text.split('\n');
      const match = lines.find(l => l.split(':')[0] === suffix);
      
      this.count.set(match ? parseInt(match.split(':')[1]) : 0);
      this.result.set(true);
    } catch (e) {
      alert('Network error. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }

  private async sha1(str: string) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
}
