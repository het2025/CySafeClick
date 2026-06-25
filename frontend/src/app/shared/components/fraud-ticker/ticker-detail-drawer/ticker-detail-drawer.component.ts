import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TickerItem, FraudTickerService } from '../../../../core/services/fraud-ticker.service';

@Component({
  selector: 'Cycysafeclick-ticker-detail-drawer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="drawer-overlay" (click)="close.emit()" [class.open]="isOpen"></div>
    <div class="drawer-container" [class.open]="isOpen">
      <div class="drawer-header">
        <div class="badges">
          <span class="severity-badge" [ngClass]="item?.severity">{{ item?.severity }}</span>
          <span class="category-badge">{{ item?.category }}</span>
          <span class="breaking-badge" *ngIf="item?.isBreaking">BREAKING</span>
        </div>
        <button class="close-btn" (click)="close.emit()">×</button>
      </div>
      
      <div class="drawer-body" *ngIf="item">
        <div class="meta-info">
          <span class="date">Active since: {{ getAge() }}</span>
          <span class="state">Affects: {{ item.targetState }}</span>
        </div>
        
        <div class="text-content">
          <p class="en-text">{{ item.text }}</p>
          <p class="hi-text">{{ item.textHindi }}</p>
        </div>
        
        <div class="action-section">
          <h4>What you should do:</h4>
          <p>{{ getAdvice(item.category) }}</p>
        </div>
        
        <div class="button-group">
          <a *ngIf="item.actionUrl && item.actionUrl.startsWith('http')" [href]="item.actionUrl" target="_blank" rel="noopener" class="btn-primary" (click)="close.emit()">
            {{ item.actionLabel || 'Read Full Story' }} →
          </a>
          <a *ngIf="item.actionUrl && !item.actionUrl.startsWith('http')" [routerLink]="item.actionUrl" class="btn-primary" (click)="close.emit()">
            {{ item.actionLabel || 'Take Action' }} →
          </a>
          <a routerLink="/tools/number-lookup" class="btn-secondary" (click)="close.emit()">
            Report similar incident
          </a>
          <button class="btn-share" (click)="shareWarning()">
            <span class="icon">💬</span> Share Warning
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .drawer-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.6);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 1000;
      
      &.open {
        opacity: 1;
        pointer-events: auto;
      }
    }
    
    .drawer-container {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      background: var(--Cycysafeclick-navy, #0A1628);
      border-top: 2px solid var(--Cycysafeclick-saffron, #FF9933);
      padding: 24px;
      transform: translateY(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 1001;
      border-radius: 16px 16px 0 0;
      max-height: 90vh;
      overflow-y: auto;
      
      &.open {
        transform: translateY(0);
      }
    }
    
    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .badges {
      display: flex;
      gap: 8px;
      
      span {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: bold;
        text-transform: uppercase;
      }
      
      .severity-badge.critical { background: #ef4444; color: white; }
      .severity-badge.alert { background: #f97316; color: white; }
      .severity-badge.warning { background: #f59e0b; color: #1a1a1a; }
      .severity-badge.info { background: #3b82f6; color: white; }
      
      .category-badge { background: rgba(255,255,255,0.1); color: #ddd; }
      .breaking-badge { background: #ef4444; color: white; animation: flash 1s infinite; }
    }
    
    .close-btn {
      background: none; border: none; color: #fff; font-size: 24px; cursor: pointer;
    }
    
    .meta-info {
      display: flex; gap: 16px; color: #888; font-size: 13px; margin-bottom: 16px;
    }
    
    .text-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
      background: rgba(0,0,0,0.3);
      padding: 16px;
      border-radius: 8px;
      
      p { margin: 0; font-size: 15px; line-height: 1.5; color: #e5e7eb; }
      .hi-text { color: #ccc; font-style: italic; }
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .action-section {
      background: rgba(255, 153, 51, 0.1);
      border-left: 4px solid var(--Cycysafeclick-saffron, #FF9933);
      padding: 16px;
      margin-bottom: 24px;
      
      h4 { margin: 0 0 8px 0; color: var(--Cycysafeclick-saffron, #FF9933); }
      p { margin: 0; color: #ddd; font-size: 14px; }
    }
    
    .button-group {
      display: flex; gap: 12px; flex-wrap: wrap;
      
      a, button {
        padding: 10px 20px;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        cursor: pointer;
        border: none;
        font-size: 14px;
        font-family: inherit;
      }
      
      .btn-primary { background: var(--Cycysafeclick-saffron, #FF9933); color: #000; }
      .btn-secondary { background: rgba(255,255,255,0.1); color: #fff; }
      .btn-share { background: #25D366; color: white; }
    }
    
    @keyframes flash {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `]
})
export class TickerDetailDrawerComponent {
  @Input() item: TickerItem | null = null;
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  constructor(private tickerService: FraudTickerService) {}

  getAge() {
    if (!this.item) return '';
    return this.tickerService.getItemAge(this.item);
  }

  getAdvice(category: string): string {
    const adviceMap: Record<string, string> = {
      'UPI Fraud': 'Never enter your UPI PIN to receive money. Ignore unknown collect requests.',
      'Phishing': 'Do not click the link. If you entered details, change your passwords immediately.',
      'Scam Call': 'Block the number immediately. Do not share OTPs, Aadhar, or bank details on call.',
      'Investment Scam': 'Verify the company on SEBI. Do not transfer funds based on Telegram/WhatsApp promises.',
      'Job Scam': 'Legitimate companies never ask for a "registration fee" or "laptop deposit".',
      'Malware': 'Delete the file immediately. Run a malware scan. Avoid installing APKs from unknown sources.',
      'E-Commerce Scam': 'Only pay through the official app. Refuse customs charges for domestic deliveries.'
    };
    return adviceMap[category] || 'Stay cautious. Do not share personal information or transfer money to unknown entities.';
  }

  shareWarning() {
    if (!this.item) return;
    const text = `🚨 Cycysafeclick SCAM ALERT 🚨\n\n${this.item.text}\n\n${this.item.textHindi}\n\nCheck live alerts on Cycysafeclick App.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }
}
