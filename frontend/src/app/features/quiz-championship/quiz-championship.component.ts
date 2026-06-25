import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QuizChampionshipService, QuizQuestion, QuizHistory } from './quiz-championship.service';
import { TranslationService } from '../../core/services/translation.service';

@Component({
  selector: 'app-quiz-championship',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-championship.component.html',
  styleUrls: ['./quiz-championship.component.css']
})
export class QuizChampionshipComponent implements OnInit {
  questions: QuizQuestion[] = [];
  currentIndex: number = 0;
  score: number = 0;
  timer: number = 30;
  timerInterval: any;
  quizState: 'intro' | 'active' | 'result' = 'intro';
  selectedOption: number | null = null;
  history!: QuizHistory;
  leaderboard: any[] = [];
  userName: string = 'Champion';

  constructor(private quizService: QuizChampionshipService, public t: TranslationService) {
    effect(() => {
      this.t.currentLang();
      this.loadData();
      if (this.quizState === 'active') {
        this.quizState = 'intro'; // Reset if middle of quiz
      }
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.history = this.quizService.getQuizHistory();
    this.quizService.getQuestionsForWeek().subscribe(q => {
      this.questions = q;
    });
    this.leaderboard = this.quizService.getLeaderboard();
  }

  canAttempt(): boolean {
    return true; 
  }

  startQuiz(): void {
    this.quizState = 'active';
    this.score = 0;
    this.currentIndex = 0;
    this.startTimer();
  }

  startTimer(): void {
    this.timer = 30;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        this.autoSubmit();
      }
    }, 1000);
  }

  selectOption(index: number): void {
    this.selectedOption = index;
    clearInterval(this.timerInterval);
    this.evaluateAnswer();
  }

  autoSubmit(): void {
    this.selectedOption = -1; // Time out
    clearInterval(this.timerInterval);
    this.evaluateAnswer();
  }

  evaluateAnswer(): void {
    const q = this.questions[this.currentIndex];
    if (this.selectedOption === q.correctIndex) {
      this.score += 10;
      if (this.timer >= 25) {
        this.score += 5; // Speed bonus
      }
    }
    
    setTimeout(() => {
      this.nextQuestion();
    }, 2000); 
  }

  nextQuestion(): void {
    this.selectedOption = null;
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.startTimer();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz(): void {
    this.quizState = 'result';
    this.quizService.saveScore(this.score);
    this.history = this.quizService.getQuizHistory();
    this.leaderboard = this.quizService.getLeaderboard();
  }

  downloadCertificate(): void {
    alert(`Certificate generated for ${this.userName} with score ${this.score}!`);
  }
}
