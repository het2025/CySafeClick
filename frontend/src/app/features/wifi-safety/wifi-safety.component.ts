import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WifiSafetyService, WifiQuestion } from './wifi-safety.service';
import { ProgressRingComponent } from '../../shared/components/progress-ring/progress-ring.component';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';

@Component({
  selector: 'app-wifi-safety',
  standalone: true,
  imports: [CommonModule, FormsModule, ProgressRingComponent, RiskBadgeComponent],
  templateUrl: './wifi-safety.component.html',
  styleUrls: ['./wifi-safety.component.scss']
})
export class WifiSafetyComponent {
  private wifiService = inject(WifiSafetyService);
  
  questions = this.wifiService.getQuestions();
  currentQuestionIndex = signal<number>(0);
  
  // Store user's selected option index for each question
  answers = signal<Map<number, number>>(new Map());
  
  isCompleted = signal<boolean>(false);

  currentQuestion = computed(() => this.questions[this.currentQuestionIndex()]);
  progress = computed(() => (this.currentQuestionIndex() / this.questions.length) * 100);

  totalScore = computed(() => {
    let score = 0;
    this.answers().forEach((optIndex, qIndex) => {
      score += this.questions[qIndex].options[optIndex].score;
    });
    return score;
  });

  categoryScores = computed(() => {
    const scores = new Map<string, { earned: number; total: number }>();
    this.answers().forEach((optIndex, qIndex) => {
      const q = this.questions[qIndex];
      const opt = q.options[optIndex];
      const current = scores.get(q.category) || { earned: 0, total: 0 };
      scores.set(q.category, { 
        earned: current.earned + opt.score, 
        total: current.total + 10 // Max score per question is 10
      });
    });
    return scores;
  });

  actionableFixes = computed(() => {
    const fixes: { questionText: string; explanation: string; risk: string }[] = [];
    this.answers().forEach((optIndex, qIndex) => {
      const opt = this.questions[qIndex].options[optIndex];
      if (opt.risk === 'high' || opt.risk === 'medium') {
        fixes.push({
          questionText: this.questions[qIndex].text,
          explanation: opt.explanation || 'This setting puts your network at risk.',
          risk: opt.risk
        });
      }
    });
    return fixes.sort((a, b) => (a.risk === 'high' ? -1 : 1));
  });

  selectOption(index: number) {
    const newAnswers = new Map(this.answers());
    newAnswers.set(this.currentQuestionIndex(), index);
    this.answers.set(newAnswers);
  }

  nextQuestion() {
    if (this.currentQuestionIndex() < this.questions.length - 1) {
      this.currentQuestionIndex.update(i => i + 1);
    } else {
      this.isCompleted.set(true);
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex() > 0) {
      this.currentQuestionIndex.update(i => i - 1);
    }
  }

  restart() {
    this.answers.set(new Map());
    this.currentQuestionIndex.set(0);
    this.isCompleted.set(false);
  }

  getScoreColor() {
    const score = this.totalScore();
    if (score >= 80) return '#22c55e';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  }
}
