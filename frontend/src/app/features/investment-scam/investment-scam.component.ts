import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvestmentScamService, PonziResult, InvestmentAnalysisResult } from './investment-scam.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-investment-scam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-scam.component.html',
  styleUrls: ['./investment-scam.component.css']
})
export class InvestmentScamComponent {
  // Text Analysis
  offerText: string = '';
  analysisResult: InvestmentAnalysisResult | null = null;
  isAnalyzing: boolean = false;

  // Ponzi Calculator
  promisedReturn: number | null = null;
  returnPeriod: 'day' | 'week' | 'month' | 'year' = 'month';
  ponziResult: PonziResult | null = null;

  constructor(private scamService: InvestmentScamService, public t: TranslationService) {}

  analyzeOffer(): void {
    if (!this.offerText.trim()) return;
    this.isAnalyzing = true;
    
    setTimeout(() => {
      this.analysisResult = this.scamService.analyzeText(this.offerText);
      this.isAnalyzing = false;
    }, 600);
  }

  calculateReturn(): void {
    if (this.promisedReturn === null || this.promisedReturn <= 0) return;
    this.ponziResult = this.scamService.calculatePonzi(this.promisedReturn, this.returnPeriod);
  }
}
