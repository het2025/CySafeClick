import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ai-transaction-risk',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container" style="padding: 40px 0; max-width: 800px;">
        <h1 style="text-align: center; margin-bottom: 8px;">UPI Transaction Risk Checker 💳</h1>
        <p style="text-align: center; color: var(--muted); margin-bottom: 32px;">Verify a UPI ID or phone number before sending money.</p>

        <div style="background: rgba(245, 158, 11, 0.1); border-left: 4px solid var(--warning); padding: 15px; border-radius: 4px; margin-bottom: 32px;">
            <strong style="color: var(--warning);">Educational Guidance Only</strong>
            <p style="margin-top: 5px; font-size: 0.9rem;">This tool provides an AI assessment based on common scam patterns. It cannot access bank records to verify the actual owner. Never rely solely on this tool for financial decisions.</p>
        </div>

        <div class="card" style="margin-bottom: 32px; background: var(--surface); padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <div>
                    <label style="font-weight: 600; display: block; margin-bottom: 5px;">UPI ID or Phone Number *</label>
                    <input type="text" [(ngModel)]="upiInput" placeholder="e.g. 9876543210@upi or 9876543210" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text);">
                </div>
                
                <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px;">
                        <label style="font-weight: 600; display: block; margin-bottom: 5px;">Amount (₹) (Optional)</label>
                        <input type="number" [(ngModel)]="amount" placeholder="0.00" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text);">
                    </div>
                    <div style="flex: 1; min-width: 200px;">
                        <label style="font-weight: 600; display: block; margin-bottom: 5px;">Purpose (Optional)</label>
                        <select [(ngModel)]="purpose" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: 6px; background: var(--bg); color: var(--text);">
                            <option value="">Select a purpose...</option>
                            <option value="Friend/Family">Friend/Family transfer</option>
                            <option value="Online Purchase">Online Purchase / Store</option>
                            <option value="Job Registration">Job Registration / Security Fee</option>
                            <option value="Lottery/Prize Claim">Lottery / Prize Claim Fee</option>
                            <option value="Refund">Receiving a Refund</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>

                <button (click)="checkRisk()" [disabled]="isLoading()" class="btn-cta" style="width: 100%; margin-top: 10px; padding: 16px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; color: white; background: linear-gradient(135deg, var(--accent-saffron), #a855f7);">
                  {{ isLoading() ? 'Assessing risk...' : 'Check Risk 🔍' }}
                </button>
            </div>
        </div>

        <div *ngIf="isLoading()" style="text-align: center; padding: 40px;">
            <p>Assessing transaction risk...</p>
        </div>

        <div *ngIf="result()" style="background: var(--surface); padding: 24px; border-radius: 12px; border: 1px solid var(--border);">
            <div style="text-align: center; margin-bottom: 32px;">
                <div [ngClass]="{'verdict-safe': result()?.riskLevel === 'LOW', 'verdict-suspicious': result()?.riskLevel === 'MEDIUM', 'verdict-scam': result()?.riskLevel === 'HIGH'}" 
                     style="display: inline-block; padding: 8px 24px; border-radius: 30px; font-weight: 900; font-size: 1.5rem; letter-spacing: 2px; margin-bottom: 16px;">
                     {{ result()?.riskLevel }} RISK
                </div>
                
                <div style="height: 12px; width: 100%; max-width: 400px; margin: 0 auto; background: var(--bg); border-radius: 6px; overflow: hidden; border: 1px solid var(--border);">
                    <div [style.width.%]="result()?.score" [style.background]="getScoreColor(result()?.riskLevel)" style="height: 100%; transition: width 1s ease-in-out;"></div>
                </div>
                <p style="font-size: 1.1rem; color: var(--muted); margin-top: 16px;">{{ result()?.summary }}</p>
            </div>

            <div style="background: rgba(255, 153, 51, 0.08); padding: 15px; border-radius: 8px; margin-bottom: 32px; text-align: center;">
                <strong style="font-size: 1.1rem;">Recommendation:</strong>
                <p style="font-size: 1.2rem; margin-top: 5px; font-weight: bold;">{{ result()?.recommendation }}</p>
            </div>
            
            <div style="margin-top: 32px;" *ngIf="result()?.indicators?.length">
                <h4 style="margin-bottom: 16px;">🔍 Analysis Indicators:</h4>
                <div *ngFor="let ind of result()?.indicators" style="display: flex; gap: 12px; margin-bottom: 12px; padding: 12px; background: var(--bg); border-radius: 8px;">
                    <span style="font-size: 1.2rem;">{{ getIcon(ind.type) }}</span>
                    <div>
                        <strong>{{ ind.label }}</strong>
                        <div style="font-size: 0.9rem; color: var(--muted); margin-top: 4px;">{{ ind.detail }}</div>
                    </div>
                </div>
            </div>

            <div style="margin-top: 32px;" *ngIf="result()?.tips?.length">
                <h4 style="margin-bottom: 16px;">💡 Safety Tips:</h4>
                <div *ngFor="let tip of result()?.tips" style="margin-bottom: 8px;">
                    <span>💡</span> <span>{{ tip }}</span>
                </div>
            </div>
        </div>
    </div>
  `
})
export class AiTransactionRiskComponent {
  upiInput = '';
  amount: number | null = null;
  purpose = '';
  
  isLoading = signal(false);
  result = signal<any>(null);

  getScoreColor(level: string) {
    if (level === 'LOW') return 'var(--safe)';
    if (level === 'MEDIUM') return 'var(--warning)';
    return 'var(--danger)';
  }

  getIcon(type: string) {
    if (type === 'positive') return '✅';
    if (type === 'warning') return '⚠️';
    if (type === 'danger') return '❌';
    return 'ℹ️';
  }

  async checkRisk() {
    if (!this.upiInput.trim()) {
      alert('Please enter a UPI ID or Phone Number.');
      return;
    }

    let upiId = '';
    let phone = '';
    if (this.upiInput.includes('@')) {
      upiId = this.upiInput.trim();
    } else if (/^\\d{10}$/.test(this.upiInput.trim())) {
      phone = this.upiInput.trim();
    } else {
      upiId = this.upiInput.trim();
    }

    this.isLoading.set(true);
    this.result.set(null);

    try {
      const response = await fetch('/api/ai/transaction-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          upiId, 
          phone, 
          amount: this.amount ? parseFloat(this.amount.toString()) : null, 
          purpose: this.purpose 
        })
      });
      const data = await response.json();
      
      if (data.success && data.data) {
        this.result.set(data.data);
      } else {
        alert(data.error || 'Failed to check risk.');
      }
    } catch (error) {
      console.error(error);
      alert('A network error occurred.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
