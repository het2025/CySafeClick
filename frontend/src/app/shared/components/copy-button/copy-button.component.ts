import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-copy-button',
  standalone: true,
  template: `
    <button (click)="copy()" class="btn-copy" [class.copied]="copied()" aria-label="Copy to clipboard">
      {{ copied() ? 'Copied!' : text() || 'Copy' }}
    </button>
  `,
  styles: [`
    .btn-copy { background: var(--primary); color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.8rem; border: none; cursor: pointer; transition: all 0.2s; }
    .btn-copy.copied { background: var(--safe); }
  `]
})
export class CopyButtonComponent {
  content = input.required<string>();
  text = input<string>('Copy');
  copied = signal(false);

  async copy() {
    try {
      await navigator.clipboard.writeText(this.content());
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }
}
