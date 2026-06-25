import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NumberLookupService, LookupResult } from './number-lookup.service';

@Component({
  selector: 'app-number-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  providers: [NumberLookupService],
  templateUrl: './number-lookup.component.html',
  styleUrls: ['./number-lookup.component.scss']
})
export class NumberLookupComponent {
  public service = inject(NumberLookupService);

  searchInput = signal('');
  lookupResult = signal<LookupResult | null>(null);
  isLoading = signal(false);

  validationError = computed(() => {
    if (!this.searchInput()) return null;
    const normalized = this.service.normalizeNumber(this.searchInput());
    if (normalized.length > 0 && !this.service.validateIndianNumber(normalized)) {
      return 'Please enter a valid 10-digit Indian mobile or landline number';
    }
    return null;
  });

  formatInput() {
    let val = this.searchInput();
    // remove everything except +, -, spaces and digits
    val = val.replace(/[^\d\+\-\s]/g, '');
    this.searchInput.set(val);
  }

  async search(num?: string) {
    const searchVal = num || this.searchInput();
    if (!searchVal) return;
    
    if (num) {
      this.searchInput.set(num);
    }

    const normalized = this.service.normalizeNumber(searchVal);
    if (!this.service.validateIndianNumber(normalized)) {
      return;
    }

    this.isLoading.set(true);
    this.lookupResult.set(null);
    
    // Fake delay for realistic loading state
    await new Promise(r => setTimeout(r, 600));

    const result = await this.service.lookupNumber(searchVal);
    this.lookupResult.set(result);
    this.isLoading.set(false);
  }
}
