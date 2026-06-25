import { Component, input, signal, OnInit } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  template: `
    <div class="accordion-item" [class.open]="isOpen()">
      <div class="accordion-header" (click)="toggle()" role="button" [attr.aria-expanded]="isOpen()">
        <h4 class="title">{{ title() }}</h4>
        <span class="icon">{{ isOpen() ? '−' : '+' }}</span>
      </div>
      @if (isOpen()) {
        <div class="accordion-content">
          <ng-content></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .accordion-item { border: 1px solid var(--border); border-radius: 8px; margin-bottom: 8px; overflow: hidden; }
    .accordion-header { padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; background: var(--bg); transition: background 0.2s; }
    .accordion-header:hover { background: #f1f5f9; }
    [data-theme="dark"] .accordion-header:hover { background: #334155; }
    .title { margin: 0; font-size: 1rem; font-weight: 600; }
    .icon { font-weight: bold; font-size: 1.2rem; }
    .accordion-content { padding: 16px; border-top: 1px solid var(--border); background: var(--surface); }
  `]
})
export class AccordionComponent implements OnInit {
  title = input.required<string>();
  initiallyOpen = input<boolean>(false);
  
  isOpen = signal(false);

  ngOnInit() {
    this.isOpen.set(this.initiallyOpen());
  }

  toggle() {
    this.isOpen.update(v => !v);
  }
}
