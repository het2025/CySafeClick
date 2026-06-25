import { Component, OnInit, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { StatsDashboardService, CrimeStats } from './stats-dashboard.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

Chart.register(...registerables);

@Component({
  selector: 'app-stats-dashboard',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.css']
})
export class StatsDashboardComponent implements OnInit, AfterViewInit {
  @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef>;
  stats: CrimeStats | null = null;

  impactStats = {
    toolsUsed: 0,
    passwordsTested: 0,
    phishingScanned: 0,
    reportsSubmitted: 0
  };

  constructor(private statsService: StatsDashboardService, public t: TranslationService) {}

  ngOnInit(): void {
    this.statsService.getStats().subscribe(data => {
      this.stats = data;
      setTimeout(() => this.renderCharts(), 0);
    });

    this.loadImpactStats();
  }

  ngAfterViewInit(): void {}

  loadImpactStats(): void {
    this.impactStats.toolsUsed = this.readArrayCount('safeclick_recent_lookups') + this.readArrayCount('safeclick_quiz_history');
    this.impactStats.reportsSubmitted = 0;
    this.impactStats.passwordsTested = 0;
    this.impactStats.phishingScanned = 0;
  }

  private readArrayCount(key: string): number {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.length : 0;
    } catch {
      return 0;
    }
  }

  renderCharts(): void {
    if (!this.stats) return;
    const canvases = this.chartCanvases.toArray();
    const isHi = this.t.currentLang() === 'hi';
    
    if (canvases[0]) {
      new Chart(canvases[0].nativeElement, {
        type: 'bar',
        data: {
          labels: this.stats.yearOverYear.labels,
          datasets: [{
            label: isHi ? 'साइबर अपराध शिकायतें' : 'Cybercrime Complaints',
            data: this.stats.yearOverYear.data,
            backgroundColor: '#FF9933',
            borderRadius: 4
          }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
      });
    }

    if (canvases[1]) {
      new Chart(canvases[1].nativeElement, {
        type: 'bar',
        data: {
          labels: this.stats.topStates.labels,
          datasets: [{
            label: isHi ? 'शिकायतें' : 'Complaints',
            data: this.stats.topStates.data,
            backgroundColor: '#0A1628',
            borderRadius: 4
          }]
        },
        options: { indexAxis: 'y', responsive: true, plugins: { legend: { display: false } } }
      });
    }

    if (canvases[2]) {
      const labels = isHi ? ['वित्तीय धोखाधड़ी', 'सोशल मीडिया अपराध', 'ऑनलाइन उत्पीड़न', 'रैंसमवेयर', 'अन्य'] : this.stats.fraudTypes.labels;
      new Chart(canvases[2].nativeElement, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: this.stats.fraudTypes.data,
            backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981', '#64748b']
          }]
        },
        options: { responsive: true }
      });
    }
  }

  downloadChart(index: number, title: string): void {
    const canvases = this.chartCanvases.toArray();
    if (canvases[index]) {
      const link = document.createElement('a');
      link.href = canvases[index].nativeElement.toDataURL('image/png');
      link.download = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.click();
    }
  }
}
