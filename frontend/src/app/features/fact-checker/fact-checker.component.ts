import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FactCheckerService, FactCheckResult } from './fact-checker.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-fact-checker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fact-checker.component.html',
  styleUrls: ['./fact-checker.component.css']
})
export class FactCheckerComponent {
  activeTab: 'text' | 'claim' | 'url' = 'text';
  inputText: string = '';
  result: FactCheckResult | null = null;
  isChecking: boolean = false;

  constructor(public factService: FactCheckerService, public t: TranslationService) {}

  switchTab(tab: 'text' | 'claim' | 'url'): void {
    this.activeTab = tab;
    this.inputText = '';
    this.result = null;
  }

  checkFact(): void {
    if (!this.inputText.trim()) return;
    this.isChecking = true;
    
    // Simulate network/analysis delay
    setTimeout(() => {
      this.result = this.factService.analyzeText(this.inputText);
      this.isChecking = false;
    }, 800);
  }

  reset(): void {
    this.inputText = '';
    this.result = null;
  }

  getVerdictClass(): string {
    if (!this.result) return '';
    return this.result.verdict;
  }

  getVerdictText(): string {
    if (!this.result) return '';
    return this.t.translate(`FACT.VERDICT.${this.result.verdict}`);
  }
}
