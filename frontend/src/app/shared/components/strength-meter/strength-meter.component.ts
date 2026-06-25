import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-strength-meter',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="meter">
      @for (seg of [0,1,2,3,4]; track seg) {
        <div class="segment" 
             [style.background]="seg <= score() ? colors[score()] : '#e2e8f0'">
        </div>
      }
    </div>
    @if (showLabel()) {
      <p [style.color]="colors[score()]" style="font-weight: bold; font-size: 0.85rem; margin-top: 4px;">
        {{ labels[score()] }}
      </p>
    }
  `,
  styles: [`
    .meter { height: 10px; display: flex; gap: 4px; }
    .segment { flex: 1; border-radius: 5px; transition: background 0.3s; }
  `]
})
export class StrengthMeterComponent {
  score = input<number>(0); // 0-4
  showLabel = input<boolean>(false);

  colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e'];
  labels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
}
