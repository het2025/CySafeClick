import { Component, input, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DailyTip } from '../daily-tip.service';
import { ShareCardComponent } from '../../../shared/components/share-card/share-card.component';

@Component({
  selector: 'app-daily-tip-card',
  standalone: true,
  imports: [CommonModule, ShareCardComponent],
  template: `
    <div class="tip-card">
      <div class="tip-header">
        <span class="category"><i class="icon-bulb"></i> {{ tip().category }}</span>
        <button class="lang-toggle" (click)="toggleLang()">
          {{ isHindi() ? 'AA' : 'अ' }}
        </button>
      </div>
      
      <div class="tip-content">
        <h3>{{ isHindi() ? tip().hindiTitle : tip().title }}</h3>
        <p>{{ isHindi() ? tip().hindiBody : tip().body }}</p>
      </div>

      <div class="action-item">
        <strong>Action:</strong> {{ tip().actionItem }}
      </div>

      <div class="tip-footer">
        <div class="tags">
          <span *ngFor="let tag of tip().tags" class="tag">#{{ tag }}</span>
        </div>
        <button class="btn-share" (click)="showShareCard.set(true)">Share</button>
      </div>

      <!-- Share Overlay -->
      <div class="share-overlay" *ngIf="showShareCard()" (click)="showShareCard.set(false)">
        <div class="share-modal" (click)="$event.stopPropagation()">
          <button class="btn-close" (click)="showShareCard.set(false)">×</button>
          <app-share-card 
            [title]="isHindi() ? tip().hindiTitle : tip().title" 
            [description]="isHindi() ? tip().hindiBody : tip().body">
          </app-share-card>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./daily-tip-card.component.scss']
})
export class DailyTipCardComponent {
  tip = input.required<DailyTip>();
  isHindi = signal(false);
  showShareCard = signal(false);

  toggleLang() {
    this.isHindi.update(v => !v);
  }
}
