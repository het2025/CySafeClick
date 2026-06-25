import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobScamDetectorService, ScamAnalysisResult } from './job-scam-detector.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-job-scam-detector',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-scam-detector.component.html',
  styleUrls: ['./job-scam-detector.component.css']
})
export class JobScamDetectorComponent {
  jobPostText: string = '';
  result: ScamAnalysisResult | null = null;
  isAnalyzing: boolean = false;

  constructor(private detectorService: JobScamDetectorService, public t: TranslationService) {}

  analyzePost(): void {
    if (!this.jobPostText.trim()) return;
    
    this.isAnalyzing = true;
    this.result = null;

    // Simulate network delay for UX
    setTimeout(() => {
      this.result = this.detectorService.analyzeJobPost(this.jobPostText);
      this.isAnalyzing = false;
    }, 800);
  }

  reset(): void {
    this.jobPostText = '';
    this.result = null;
  }

  getScoreColorClass(): string {
    if (!this.result) return '';
    if (this.result.score >= 60) return 'text-danger';
    if (this.result.score >= 30) return 'text-warning';
    return 'text-safe';
  }

  getProgressBarColor(): string {
    if (!this.result) return '#e2e8f0';
    if (this.result.score >= 60) return 'var(--CySafeClick-danger, #ef4444)';
    if (this.result.score >= 30) return 'var(--CySafeClick-warn, #f59e0b)';
    return 'var(--CySafeClick-safe, #22c55e)';
  }
}
