import { Component, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUserLocation, selectHasOnboarded } from '../../../store/location.store';
import { RegionalScamsService, RegionalScamDatabase } from '../../../features/regional-scams/regional-scams.service';
import { LocationOnboardingComponent } from '../location-onboarding/location-onboarding.component';

@Component({
  selector: 'safeclick-personalized-alert-banner',
  standalone: true,
  imports: [CommonModule, RouterModule, LocationOnboardingComponent],
  template: `
    <div class="banner-container">
      <div class="banner-content" *ngIf="userLocation().stateId as stateId; else noLocation">
        <div class="icon">📍</div>
        <div class="text-content">
          <strong>Scams active in your region this month:</strong>
          <span class="scam-list" *ngIf="topScams().length > 0">
            <span class="scam-badge" *ngFor="let scam of topScams()">⚠️ {{ scam.title }}</span>
          </span>
        </div>
        <a routerLink="/learn/regional-scams" class="btn-view-all">View all regional scams →</a>
      </div>
      
      <ng-template #noLocation>
        <div class="banner-content no-location">
          <div class="icon">📍</div>
          <div class="text-content">
            <strong>Set your location to see scams targeting your area</strong>
          </div>
          <button class="btn-view-all" (click)="showOnboarding = true">Set Location</button>
        </div>
      </ng-template>
    </div>

    <safeclick-location-onboarding *ngIf="showOnboarding || (!hasOnboarded() && isHomepage)" 
      (completed)="onboardingCompleted()">
    </safeclick-location-onboarding>
  `,
  styles: [`
    .banner-container {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      margin: 1.5rem 0;
      font-family: 'Inter', sans-serif;
    }
    .banner-content {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .icon { font-size: 1.5rem; }
    .text-content { flex-grow: 1; display: flex; flex-direction: column; gap: 0.25rem; }
    .text-content strong { color: var(--safeclick-navy); font-size: 1.05rem; }
    .scam-list { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.25rem; }
    .scam-badge {
      background: #fee2e2;
      color: #991b1b;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
    }
     .btn-view-all {
       background: var(--safeclick-navy, #0A1628);
       color: white;
       text-decoration: none;
       padding: 10px 16px;
       border-radius: 6px;
       font-weight: 600;
       font-size: 0.9rem;
       border: none;
       cursor: pointer;
     }
    .btn-view-all:hover { background: #1e293b; }
    @media (max-width: 600px) {
      .banner-content { flex-direction: column; align-items: stretch; text-align: center; }
      .scam-list { justify-content: center; }
    }
  `]
})
export class PersonalizedAlertBannerComponent implements OnInit {
  store = inject(Store);
  scamsService = inject(RegionalScamsService);

  userLocation = this.store.selectSignal(selectUserLocation);
  hasOnboarded = this.store.selectSignal(selectHasOnboarded);
  
  showOnboarding = false;
  isHomepage = window.location.pathname === '/' || window.location.pathname === '/home';
  
  db: RegionalScamDatabase | null = null;

  ngOnInit() {
    this.scamsService.loadDatabase().subscribe(db => this.db = db);
  }

  topScams = computed(() => {
    const loc = this.userLocation();
    if (!loc.stateId || !this.db) return [];
    
    const scams = this.scamsService.getScamsForStateSync(this.db, loc.stateId);
    return scams.sort((a, b) => b.reportedCases - a.reportedCases).slice(0, 2);
  });

  onboardingCompleted() {
    this.showOnboarding = false;
  }
}
