import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CyberLawService, LawSection } from './cyber-law.service';
import { RiskBadgeComponent } from '../../shared/components/risk-badge/risk-badge.component';

@Component({
  selector: 'app-cyber-law',
  standalone: true,
  imports: [CommonModule, FormsModule, RiskBadgeComponent],
  templateUrl: './cyber-law.component.html',
  styleUrls: ['./cyber-law.component.scss']
})
export class CyberLawComponent {
  private lawService = inject(CyberLawService);

  laws = signal<LawSection[]>(this.lawService.getLaws());
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('All');
  
  showFlowchart = signal<boolean>(false);

  categories = ['All', 'Identity', 'Privacy', 'Fraud', 'Data Protection', 'Terrorism', 'Companies'];

  filteredLaws = computed(() => {
    let result = this.laws();

    if (this.selectedCategory() !== 'All') {
      result = result.filter(l => l.category === this.selectedCategory());
    }

    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      result = result.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.sectionNumber.toLowerCase().includes(q) ||
        l.explanation.toLowerCase().includes(q) ||
        l.example.toLowerCase().includes(q)
      );
    }

    return result;
  });

  getSeverityBadgeLevel(severity: string): 'safe' | 'suspicious' | 'dangerous' | 'unknown' {
    switch(severity) {
      case 'low': return 'safe';
      case 'medium': return 'suspicious';
      case 'high': return 'dangerous';
      case 'critical': return 'dangerous';
      default: return 'unknown';
    }
  }
}
