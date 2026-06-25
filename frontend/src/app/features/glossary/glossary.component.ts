import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlossaryService, GlossaryTerm } from './glossary.service';
import { AccordionComponent } from '../../shared/components/accordion/accordion.component';

@Component({
  selector: 'app-glossary',
  standalone: true,
  imports: [CommonModule, FormsModule, AccordionComponent],
  templateUrl: './glossary.component.html',
  styleUrls: ['./glossary.component.scss']
})
export class GlossaryComponent implements OnInit {
  private glossaryService = inject(GlossaryService);

  terms = signal<GlossaryTerm[]>([]);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('');
  selectedDifficulty = signal<string>('');

  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  categories = ['attacks', 'concepts', 'technology', 'legal', 'india-specific'];
  difficulties = ['beginner', 'intermediate', 'advanced'];

  filteredTerms = computed(() => {
    let result = this.terms();

    if (this.searchQuery()) {
      const q = this.searchQuery().toLowerCase();
      result = result.filter(t => 
        t.term.toLowerCase().includes(q) || 
        t.hindiTerm.toLowerCase().includes(q) ||
        t.simpleDefinition.toLowerCase().includes(q) ||
        t.detailedExplanation.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategory()) {
      result = result.filter(t => t.category === this.selectedCategory());
    }

    if (this.selectedDifficulty()) {
      result = result.filter(t => t.difficulty === this.selectedDifficulty());
    }

    // Sort alphabetically
    return result.sort((a, b) => a.term.localeCompare(b.term));
  });

  groupedTerms = computed(() => {
    const groups = new Map<string, GlossaryTerm[]>();
    this.filteredTerms().forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (!groups.has(firstLetter)) {
        groups.set(firstLetter, []);
      }
      groups.get(firstLetter)!.push(term);
    });
    return Array.from(groups.keys()).sort().map(letter => ({
      letter,
      terms: groups.get(letter)!
    }));
  });

  ngOnInit() {
    this.glossaryService.getTerms().subscribe(data => {
      this.terms.set(data);
    });
  }

  scrollToLetter(letter: string) {
    const el = document.getElementById('letter-' + letter);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  async copyDefinition(term: GlossaryTerm) {
    const text = `${term.term}: ${term.simpleDefinition}\nMore info at SafeClick Shield.`;
    try {
      await navigator.clipboard.writeText(text);
      // Optional: replace with toast service
      alert('Definition copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy', err);
    }
  }

  selectTerm(termName: string) {
    this.searchQuery.set(termName);
    this.selectedCategory.set('');
    this.selectedDifficulty.set('');
  }
}
