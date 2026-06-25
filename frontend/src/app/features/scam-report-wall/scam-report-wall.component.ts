import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ScamReportWallService, ScamReport } from './scam-report-wall.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-scam-report-wall',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './scam-report-wall.component.html',
  styleUrls: ['./scam-report-wall.component.css']
})
export class ScamReportWallComponent implements OnInit {
  reports$: Observable<ScamReport[]>;
  phoneCount: Observable<number>;
  upiCount: Observable<number>;
  
  searchTerm: string = '';
  typeFilter: string = 'all';
  scamTypeFilter: string = 'all';

  showForm: boolean = false;
  submissionsDisabled = true;
  newReport = {
    type: 'phone' as any,
    value: '',
    scamType: 'otp',
    city: '',
    amountLost: null,
    description: '',
    reporterNote: ''
  };

  constructor(public scamService: ScamReportWallService, public t: TranslationService) {
    this.reports$ = this.scamService.reports$;
    this.phoneCount = this.reports$.pipe(map(r => r.filter(x => x.type === 'phone').length));
    this.upiCount = this.reports$.pipe(map(r => r.filter(x => x.type === 'upi').length));
  }

  ngOnInit(): void {}

  getFilteredReports(reports: ScamReport[]): ScamReport[] {
    let filtered = reports;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(r => r.value.toLowerCase().includes(term) || r.description.toLowerCase().includes(term));
    }
    if (this.typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === this.typeFilter);
    }
    if (this.scamTypeFilter !== 'all') {
      filtered = filtered.filter(r => r.scamType === this.scamTypeFilter);
    }
    return filtered;
  }

  getTopScammers(reports: ScamReport[]): ScamReport[] {
    return [...reports]
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 10);
  }

  submitReport(): void {
    alert('Public submissions are disabled. Please report incidents through 1930, cybercrime.gov.in, your bank, or local police.');
    this.showForm = false;
  }

  upvote(id: string): void {
    this.scamService.upvote(id);
  }
}
