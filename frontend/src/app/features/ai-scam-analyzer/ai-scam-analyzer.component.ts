import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-scam-analyzer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 0; max-width: 800px;">
        <h1 style="text-align: center; margin-bottom: 8px;">AI Scam Message Analyzer 🤖</h1>
        <p style="text-align: center; color: var(--muted); margin-bottom: 32px;">Paste any suspicious WhatsApp message, SMS, or email to check with AI.</p>

        <div class="card" style="margin-bottom: 32px; background: var(--surface); padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
            <textarea [(ngModel)]="message" rows="6" style="width: 100%; padding: 15px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg); color: var(--text); font-size: 1rem; font-family: inherit; margin-bottom: 24px;" placeholder="Paste the suspicious message here..."></textarea>
            <button (click)="analyze()" [disabled]="isLoading()" class="btn-cta" style="width: 100%; background: linear-gradient(135deg, var(--accent-saffron), #a855f7); border: none; padding: 16px; color: white; font-weight: bold; border-radius: 8px; cursor: pointer;">
              {{ isLoading() ? 'Analyzing...' : 'Analyze with AI ✨' }}
            </button>
        </div>

        <div *ngIf="isLoading()" style="text-align: center; padding: 40px;">
            <p>AI is analyzing the message...</p>
        </div>

        <div *ngIf="result()" style="background: var(--surface); padding: 24px; border-radius: 12px; border: 1px solid var(--border); text-align: center;">
            <div [ngClass]="{'verdict-safe': result()?.verdict === 'SAFE', 'verdict-suspicious': result()?.verdict === 'SUSPICIOUS', 'verdict-scam': result()?.verdict === 'SCAM'}" 
                 style="display: inline-block; padding: 8px 24px; border-radius: 30px; font-weight: 900; font-size: 1.5rem; letter-spacing: 2px; margin-bottom: 16px;">
                 {{ result()?.verdict }}
            </div>
            
            <h3 style="color: var(--muted); margin-bottom: 16px;">AI Confidence: {{ result()?.confidence }}%</h3>
            <p style="font-size: 1.1rem; margin-bottom: 24px;">{{ result()?.summary }}</p>
            
            <div style="text-align: left; margin-top: 32px;" *ngIf="result()?.redFlags?.length">
                <h4 style="margin-bottom: 16px;">🚩 Red Flags Detected:</h4>
                <div *ngFor="let flag of result()?.redFlags" style="display: flex; gap: 12px; margin-bottom: 12px; padding: 12px; background: var(--bg); border-radius: 8px; border-left: 4px solid var(--warning);">
                    <span style="font-size: 1.2rem;">⚠️</span>
                    <div>
                        <strong>{{ flag.flag }}</strong>
                        <div style="font-size: 0.9rem; color: var(--muted); margin-top: 4px;">{{ flag.explanation }}</div>
                    </div>
                </div>
            </div>

            <div style="text-align: left; margin-top: 32px;" *ngIf="result()?.whatToDo?.length">
                <h4 style="margin-bottom: 16px;">🛡️ What to do next:</h4>
                <div *ngFor="let step of result()?.whatToDo" style="margin-bottom: 8px;">
                    <span>👉</span> <span>{{ step }}</span>
                </div>
            </div>

            <div style="margin-top: 32px; padding: 16px; background: rgba(255,153,51,0.1); border-left: 4px solid var(--accent-saffron); text-align: left; border-radius: 0 8px 8px 0; font-size: 0.9rem; line-height: 1.5;">
                <strong>⚠️ Important Notice</strong><br>
                This AI analysis is meant to help you stay aware — it is not always accurate. AI can sometimes make mistakes or miss context. Please do not rely solely on this result. Always verify from official sources and use your own judgement before taking any action. CySafeClick is not responsible for decisions made based on this analysis.
            </div>
        </div>
    </div>
  `
})
export class AiScamAnalyzerComponent {
  message = '';
  isLoading = signal(false);
  result = signal<any>(null);

  async analyze() {
    if (!this.message.trim()) {
      alert('Please paste a message first.');
      return;
    }

    this.isLoading.set(true);
    this.result.set(null);

    try {
      const response = await fetch('/api/ai/analyze-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: this.message.trim() })
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        this.result.set(data.data);
      } else {
        alert(data.error || 'Failed to analyze message.');
      }
    } catch (error) {
      console.error(error);
      alert('A network error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
