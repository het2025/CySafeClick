import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-progress-ring',
  standalone: true,
  template: `
    <div class="progress-ring-container" [style.width.px]="size()" [style.height.px]="size()">
      <svg class="progress-ring" [attr.width]="size()" [attr.height]="size()">
        <circle
          class="progress-ring-bg"
          [attr.stroke]="backgroundColor()"
          [attr.stroke-width]="strokeWidth()"
          fill="transparent"
          [attr.r]="normalizedRadius()"
          [attr.cx]="size() / 2"
          [attr.cy]="size() / 2"
        />
        <circle
          class="progress-ring-circle"
          [attr.stroke]="color()"
          [attr.stroke-width]="strokeWidth()"
          [attr.stroke-dasharray]="circumference() + ' ' + circumference()"
          [style.stroke-dashoffset]="strokeDashoffset()"
          fill="transparent"
          [attr.r]="normalizedRadius()"
          [attr.cx]="size() / 2"
          [attr.cy]="size() / 2"
          stroke-linecap="round"
        />
      </svg>
      <div class="progress-ring-text">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .progress-ring-container { position: relative; display: inline-flex; align-items: center; justify-content: center; }
    .progress-ring { transform: rotate(-90deg); }
    .progress-ring-circle { transition: stroke-dashoffset 0.5s ease-in-out; }
    .progress-ring-text { position: absolute; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
  `]
})
export class ProgressRingComponent {
  progress = input<number>(0); // 0 to 100
  size = input<number>(100);
  strokeWidth = input<number>(8);
  color = input<string>('var(--accent-saffron)');
  backgroundColor = input<string>('var(--border)');

  normalizedRadius = computed(() => (this.size() / 2) - (this.strokeWidth() * 2));
  circumference = computed(() => this.normalizedRadius() * 2 * Math.PI);
  strokeDashoffset = computed(() => this.circumference() - (this.progress() / 100) * this.circumference());
}
