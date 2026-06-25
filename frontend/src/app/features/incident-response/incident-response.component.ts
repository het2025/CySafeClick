import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidentResponseService, Playbook } from './incident-response.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-incident-response',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './incident-response.component.html',
  styleUrls: ['./incident-response.component.css']
})
export class IncidentResponseComponent implements OnInit {
  playbooks$: Observable<Playbook[]> | undefined;
  categories$: Observable<string[]> | undefined;
  
  selectedCategory: string | null = null;
  selectedPlaybook: Playbook | null = null;
  completedSteps: Set<number> = new Set();
  currentStepIndex: number = 0;

  constructor(private irService: IncidentResponseService, public t: TranslationService) {
    // Reload playbooks when language changes
    effect(() => {
      this.t.currentLang(); // trigger dependency
      this.loadData();
      if (this.selectedPlaybook) {
        // If a playbook was open, we might want to refresh it to the new language
        // For simplicity, we just close it and let user re-open in new lang
        this.selectedPlaybook = null;
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.playbooks$ = this.irService.getPlaybooks().pipe(
      map(data => data.playbooks)
    );
    
    this.categories$ = this.playbooks$.pipe(
      map(playbooks => Array.from(new Set(playbooks.map(pb => pb.category))))
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.selectedPlaybook = null;
  }

  clearCategory(): void {
    this.selectedCategory = null;
    this.selectedPlaybook = null;
  }

  openPlaybook(playbook: Playbook): void {
    this.selectedPlaybook = playbook;
    const savedSteps = this.irService.getCompletedSteps(playbook.id);
    this.completedSteps = new Set(savedSteps);
    
    // Find first incomplete step
    this.currentStepIndex = 0;
    for (let i = 0; i < playbook.steps.length; i++) {
      if (!this.completedSteps.has(i)) {
        this.currentStepIndex = i;
        break;
      }
    }
    // If all completed, stay on last step
    if (this.currentStepIndex === playbook.steps.length) {
      this.currentStepIndex = playbook.steps.length - 1;
    }
  }

  closePlaybook(): void {
    this.selectedPlaybook = null;
  }

  toggleStep(index: number): void {
    if (this.completedSteps.has(index)) {
      this.completedSteps.delete(index);
    } else {
      this.completedSteps.add(index);
    }
    if (this.selectedPlaybook) {
      this.irService.saveCompletedSteps(this.selectedPlaybook.id, Array.from(this.completedSteps));
    }
  }

  nextStep(): void {
    if (this.selectedPlaybook && this.currentStepIndex < this.selectedPlaybook.steps.length - 1) {
      this.toggleStep(this.currentStepIndex);
      this.currentStepIndex++;
    } else if (this.selectedPlaybook && this.currentStepIndex === this.selectedPlaybook.steps.length - 1) {
       this.toggleStep(this.currentStepIndex);
    }
  }

  resetProgress(): void {
    if (this.selectedPlaybook) {
      this.irService.clearProgress(this.selectedPlaybook.id);
      this.completedSteps.clear();
      this.currentStepIndex = 0;
    }
  }

  printSummary(): void {
    window.print();
  }

  async copySummary(): Promise<void> {
    if (!this.selectedPlaybook) return;
    const summary = [
      `Cycysafeclick Incident Playbook: ${this.selectedPlaybook.title}`,
      `Urgency: ${this.selectedPlaybook.urgency}`,
      `Estimated time: ${this.selectedPlaybook.estimatedTime}`,
      '',
      'Steps:',
      ...this.selectedPlaybook.steps.map((step, index) => `${index + 1}. ${step.title} - ${step.action}`),
      '',
      'Do not:',
      ...this.selectedPlaybook.whatNotToDo.map(item => `- ${item}`)
    ].join('\n');
    await navigator.clipboard.writeText(summary);
  }
}
