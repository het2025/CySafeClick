import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-risk-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [ngClass]="badgeClass()">
      {{ label() }}
    </span>
  `,
  styles: [`
    .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
    .badge-safe { background: rgba(34, 197, 94, 0.1); color: var(--safe); border: 1px solid var(--safe); }
    .badge-suspicious { background: rgba(245, 158, 11, 0.1); color: var(--warning); border: 1px solid var(--warning); }
    .badge-dangerous { background: rgba(239, 68, 68, 0.1); color: var(--danger); border: 1px solid var(--danger); }
    .badge-neutral { background: rgba(100, 116, 139, 0.1); color: var(--muted); border: 1px solid var(--border); }
  `]
})
export class RiskBadgeComponent {
  level = input<'safe' | 'suspicious' | 'dangerous' | 'unknown'>('unknown');
  
  label() {
    switch (this.level()) {
      case 'safe': return 'Safe';
      case 'suspicious': return 'Suspicious';
      case 'dangerous': return 'Dangerous';
      default: return 'Unknown';
    }
  }

  badgeClass() {
    return `badge-${this.level()}`;
  }
}
