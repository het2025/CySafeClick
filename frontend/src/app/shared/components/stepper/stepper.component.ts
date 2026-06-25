import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stepper-container">
      <div class="steps" role="tablist">
        @for (step of steps(); track step; let i = $index) {
          <div class="step" [class.active]="i === currentStep()" [class.completed]="i < currentStep()" 
               role="tab" [attr.aria-selected]="i === currentStep()">
            <div class="step-circle">{{ i + 1 }}</div>
            <div class="step-label">{{ step }}</div>
          </div>
          @if (i < steps().length - 1) {
            <div class="step-line" [class.completed]="i < currentStep()"></div>
          }
        }
      </div>
      <div class="step-content" role="tabpanel">
        <ng-content></ng-content>
      </div>
      <div class="stepper-actions">
        <button (click)="prev()" [disabled]="currentStep() === 0" class="btn-secondary" aria-label="Previous step">Back</button>
        <button (click)="next()" [disabled]="currentStep() === steps().length - 1" class="btn-primary" aria-label="Next step">Next</button>
      </div>
    </div>
  `,
  styles: [`
    .stepper-container { display: flex; flex-direction: column; width: 100%; }
    .steps { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
    .step { display: flex; flex-direction: column; align-items: center; gap: 8px; position: relative; z-index: 1; }
    .step-circle { width: 32px; height: 32px; border-radius: 50%; background: var(--border); display: flex; align-items: center; justify-content: center; font-weight: bold; color: var(--muted); transition: all 0.3s; }
    .step.active .step-circle { background: var(--accent-saffron); color: white; }
    .step.completed .step-circle { background: var(--safe); color: white; }
    .step-label { font-size: 0.8rem; color: var(--muted); text-align: center; }
    .step.active .step-label, .step.completed .step-label { color: var(--text); font-weight: 600; }
    .step-line { flex: 1; height: 2px; background: var(--border); margin: 0 8px; position: relative; top: -10px; transition: all 0.3s; }
    .step-line.completed { background: var(--safe); }
    .step-content { padding: 16px 0; }
    .stepper-actions { display: flex; justify-content: space-between; margin-top: 24px; }
    button { padding: 8px 16px; border-radius: 4px; font-weight: bold; cursor: pointer; border: none; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-primary { background: var(--primary); color: white; }
    .btn-secondary { background: var(--border); color: var(--text); }
  `]
})
export class StepperComponent {
  steps = input.required<string[]>();
  currentStep = input<number>(0);
  stepChange = output<number>();

  next() {
    if (this.currentStep() < this.steps().length - 1) {
      this.stepChange.emit(this.currentStep() + 1);
    }
  }

  prev() {
    if (this.currentStep() > 0) {
      this.stepChange.emit(this.currentStep() - 1);
    }
  }
}
