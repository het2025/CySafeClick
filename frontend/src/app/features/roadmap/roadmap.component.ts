import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../store';
import * as RoadmapActions from '../../store/roadmap/roadmap.actions';
import { RoadmapService, RoadmapTask } from './roadmap.service';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';
import { ProgressRingComponent } from '../../shared/components/progress-ring/progress-ring.component';

@Component({
  selector: 'app-roadmap',
  standalone: true,
  imports: [CommonModule, AccordionComponent, ProgressRingComponent],
  templateUrl: './roadmap.component.html',
  styleUrls: ['./roadmap.component.scss']
})
export class RoadmapComponent implements OnInit {
  private store = inject(Store<AppState>);
  private roadmapService = inject(RoadmapService);

  tasks = this.roadmapService.getTasks();
  completedDays = signal<number[]>([]);
  streak = signal<number>(0);
  currentDay = signal<number>(1);
  showConfetti = signal<boolean>(false);

  weeks = [1, 2, 3, 4];

  progressPercent = computed(() => {
    return (this.completedDays().length / 30) * 100;
  });

  todayTask = computed(() => {
    return this.tasks.find(t => t.day === this.currentDay()) || this.tasks[0];
  });

  ngOnInit() {
    this.store.select('roadmap').subscribe(state => {
      if (state) {
        this.completedDays.set(state.completedDays);
        this.streak.set(state.streak);
        this.currentDay.set(state.currentDay);
      }
    });
  }

  getTasksForWeek(week: number) {
    return this.tasks.filter(t => t.week === week);
  }

  isCompleted(day: number): boolean {
    return this.completedDays().includes(day);
  }

  getTaskStatusClass(day: number) {
    if (this.isCompleted(day)) return 'completed';
    if (day === this.currentDay()) return 'today';
    if (day < this.currentDay()) return 'missed'; // Not completed but past current day
    return 'future';
  }

  markTaskComplete(day: number) {
    if (this.isCompleted(day)) return;
    
    const dateStr = new Date().toISOString().split('T')[0];
    this.store.dispatch(RoadmapActions.completeDay({ day, dateStr }));
    
    if (day === this.currentDay()) {
      this.showConfetti.set(true);
      setTimeout(() => this.showConfetti.set(false), 3000);
    }
  }

  setCurrentDay(day: number) {
    this.currentDay.set(day);
  }
}
