import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThreatFeedService, ThreatAlert } from './threat-feed.service';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';

@Component({
  selector: 'app-threat-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RiskBadgeComponent],
  templateUrl: './threat-feed.component.html',
  styleUrls: ['./threat-feed.component.scss']
})
export class ThreatFeedComponent implements OnInit {
  private threatService = inject(ThreatFeedService);

  alerts = signal<ThreatAlert[]>([]);
  lastUpdated = signal<string>('');
  isLoading = signal<boolean>(true);

  searchQuery = signal<string>('');
  selectedSeverity = signal<string>('');
  selectedType = signal<string>('');

  types = computed(() => {
    const t = new Set(this.alerts().map(a => a.type));
    return Array.from(t).sort();
  });

  filteredAlerts = computed(() => {
    let result = this.alerts();

    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      result = result.filter(a => 
        a.title.toLowerCase().includes(q) || 
        a.summary.toLowerCase().includes(q)
      );
    }

    if (this.selectedSeverity()) {
      result = result.filter(a => a.severity === this.selectedSeverity());
    }

    if (this.selectedType()) {
      result = result.filter(a => a.type === this.selectedType());
    }

    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  });

  hasNewCritical = computed(() => {
    // Flag if there's a critical alert from the last 2 days
    const now = new Date().getTime();
    return this.alerts().some(a => 
      a.severity === 'critical' && 
      (now - new Date(a.date).getTime() < 48 * 60 * 60 * 1000)
    );
  });

  ngOnInit() {
    this.refreshFeed();
  }

  refreshFeed() {
    this.isLoading.set(true);
    this.threatService.getFeed().subscribe(data => {
      if (data) {
        this.alerts.set(data.alerts);
        this.lastUpdated.set(data.lastUpdated);
      }
      this.isLoading.set(false);
    });
  }

  getSeverityLevel(severity: string): 'safe' | 'suspicious' | 'dangerous' {
    if (severity === 'critical' || severity === 'high') return 'dangerous';
    if (severity === 'medium') return 'suspicious';
    return 'safe';
  }

  openReference(url: string) {
    window.open(url, '_blank');
  }
}
