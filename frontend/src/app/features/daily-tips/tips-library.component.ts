import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DailyTipService, DailyTip } from './daily-tip.service';
import { DailyTipCardComponent } from './daily-tip-card/daily-tip-card.component';
import { ProgressRingComponent } from '../../shared/components/progress-ring/progress-ring.component';

@Component({
  selector: 'app-tips-library',
  standalone: true,
  imports: [CommonModule, FormsModule, DailyTipCardComponent, ProgressRingComponent],
  templateUrl: './tips-library.component.html',
  styleUrls: ['./tips-library.component.scss']
})
export class TipsLibraryComponent implements OnInit {
  private tipService = inject(DailyTipService);

  allTips = signal<DailyTip[]>([]);
  completedTipIds = signal<number[]>([]);
  
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('');
  selectedDifficulty = signal<string>('');

  categories = computed(() => {
    const cats = new Set(this.allTips().map(t => t.category));
    return Array.from(cats).sort();
  });

  filteredTips = computed(() => {
    let tips = this.allTips();
    
    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      tips = tips.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.body.toLowerCase().includes(q) ||
        t.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }
    
    if (this.selectedCategory()) {
      tips = tips.filter(t => t.category === this.selectedCategory());
    }
    
    if (this.selectedDifficulty()) {
      tips = tips.filter(t => t.difficulty === this.selectedDifficulty());
    }
    
    return tips;
  });

  progressPercent = computed(() => {
    if (this.allTips().length === 0) return 0;
    return (this.completedTipIds().length / this.allTips().length) * 100;
  });

  ngOnInit() {
    this.tipService.getAllTips().subscribe(tips => {
      this.allTips.set(tips);
      this.completedTipIds.set(this.tipService.getCompletedTipIds());
    });
  }

  markAsDone(id: number) {
    this.tipService.markTipAsDone(id);
    this.completedTipIds.set(this.tipService.getCompletedTipIds());
  }

  isCompleted(id: number): boolean {
    return this.completedTipIds().includes(id);
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set('');
    this.selectedDifficulty.set('');
  }
}
