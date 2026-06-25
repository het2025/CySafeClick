import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from '../../core/services/translation.service';
import { environment } from '../../../environments/environment';

export interface QuizQuestion {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizHistory {
  bestScore: number;
  lastAttemptWeek: string;
  history: { week: string, score: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class QuizChampionshipService {

  constructor(private http: HttpClient, private t: TranslationService) {}

  getQuestionsForWeek(): Observable<QuizQuestion[]> {
    const lang = this.t.currentLang();
    return this.http.get<{questions: QuizQuestion[]}>(`${environment.apiUrl}/quiz/${lang}`).pipe(
      map(data => {
        // Shuffle and pick 10 (or less if not enough)
        const shuffled = data.questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 10);
      })
    );
  }

  getCurrentWeekKey(): string {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7); // Thursday
    const week1 = new Date(d.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${d.getFullYear()}-W${weekNumber}`;
  }

  getQuizHistory(): QuizHistory {
    const saved = localStorage.getItem('safeclick_quiz_history');
    if (saved) {
      return JSON.parse(saved);
    }
    return { bestScore: 0, lastAttemptWeek: '', history: [] };
  }

  saveScore(score: number): void {
    const history = this.getQuizHistory();
    const currentWeek = this.getCurrentWeekKey();
    
    if (score > history.bestScore) history.bestScore = score;
    history.lastAttemptWeek = currentWeek;
    
    const weekIndex = history.history.findIndex(h => h.week === currentWeek);
    if (weekIndex !== -1) {
       history.history[weekIndex].score = score;
    } else {
       history.history.push({ week: currentWeek, score });
    }

    localStorage.setItem('safeclick_quiz_history', JSON.stringify(history));
  }

  getLeaderboard() {
    const lang = this.t.currentLang();
    const userBest = this.getQuizHistory().bestScore;
    const name = lang === 'hi' ? 'आपका सर्वश्रेष्ठ' : 'Your Best';
    
    return [
      { rank: 1, name: name, score: userBest, isUser: true }
    ].sort((a, b) => b.score - a.score).map((item, i) => ({...item, rank: i + 1}));
  }
}
