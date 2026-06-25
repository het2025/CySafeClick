import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScamStoriesService, ScamStory } from './scam-stories.service';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';

@Component({
  selector: 'app-scam-stories',
  standalone: true,
  imports: [CommonModule, FormsModule, RiskBadgeComponent],
  templateUrl: './scam-stories.component.html',
  styleUrls: ['./scam-stories.component.scss']
})
export class ScamStoriesComponent implements OnInit {
  private storiesService = inject(ScamStoriesService);

  stories = signal<ScamStory[]>([]);
  selectedStory = signal<ScamStory | null>(null);

  searchQuery = signal<string>('');
  selectedScamType = signal<string>('');

  scamTypes = computed(() => {
    const types = new Set(this.stories().map(s => s.scamType));
    return Array.from(types).sort();
  });

  filteredStories = computed(() => {
    let filtered = this.stories();

    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.victim.city.toLowerCase().includes(q) ||
        s.howItUnfolded.toLowerCase().includes(q)
      );
    }

    if (this.selectedScamType()) {
      filtered = filtered.filter(s => s.scamType === this.selectedScamType());
    }

    return filtered;
  });

  ngOnInit() {
    this.storiesService.getStories().subscribe(data => {
      this.stories.set(data);
    });
  }

  viewStory(story: ScamStory) {
    this.selectedStory.set(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  closeStory() {
    this.selectedStory.set(null);
  }

  formatCurrency(amount: number): string {
    if (amount === 0) return 'None';
    return '₹' + amount.toLocaleString('en-IN');
  }

  shareStory(story: ScamStory) {
    const text = `Read this anonymized scam awareness story and learn how to prevent similar frauds.`;
    const url = `whatsapp://send?text=${encodeURIComponent(text + ' - CySafeClick Shield: ' + window.location.href)}`;
    window.open(url, '_blank');
  }
}
