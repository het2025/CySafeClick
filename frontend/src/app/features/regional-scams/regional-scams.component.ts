import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { TranslationService } from '../../core/services/translation.service';
import { RegionalScamsService, RegionalScam, RegionalScamDatabase } from './regional-scams.service';
import { selectUserLocation } from '../../store/location.store';
import { LocationOnboardingComponent } from '../../shared/components/location-onboarding/location-onboarding.component';

@Component({
  selector: 'Cycysafeclick-regional-scams',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, LocationOnboardingComponent],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>{{ 'REGIONAL.TITLE' | translate }}</h1>
          <p *ngIf="userLocation().stateId" class="subtitle">Scams targeting {{ currentStateName() }}</p>
        </div>
        <button class="btn-change-location" (click)="showOnboarding = true">
          📍 {{ userLocation().stateId ? 'Change Location' : ('REGIONAL.SET_LOCATION_CTA' | translate) }}
        </button>
      </div>

      <div class="tabs">
        <button class="tab" [class.active]="selectedTab() === 'state'" 
                [disabled]="!userLocation().stateId"
                (click)="selectedTab.set('state')">
          {{ 'REGIONAL.YOUR_STATE_TAB' | translate }}
        </button>
        <button class="tab" [class.active]="selectedTab() === 'city'" 
                [disabled]="!userLocation().cityId"
                (click)="selectedTab.set('city')">
          {{ 'REGIONAL.YOUR_CITY_TAB' | translate }}
        </button>
        <button class="tab" [class.active]="selectedTab() === 'national'"
                (click)="selectedTab.set('national')">
          {{ 'REGIONAL.NATIONAL_TAB' | translate }}
        </button>
      </div>

      <div class="context-banner" *ngIf="selectedTab() === 'state' && currentStateProfile()">
        <p>{{ currentStateProfile()?.regionalContext }}</p>
        <div class="helpline-info" *ngIf="currentStateProfile()?.localHelplines?.length">
          Cyber Helpline ({{ currentStateName() }}): <strong>{{ currentStateProfile()?.localHelplines?.[0]?.number }}</strong>
        </div>
      </div>

      <div class="context-banner" *ngIf="selectedTab() === 'city' && currentCityProfile()">
        <p><strong>{{ currentCityProfile()?.cityName }}</strong> is notable for: {{ currentCityProfile()?.notableFor }}</p>
      </div>

      <div class="search-filter-bar">
        <input type="text" [placeholder]="'Search scams...'" [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" class="search-input">
        
        <select [ngModel]="selectedCategory()" (ngModelChange)="selectedCategory.set($event)" class="filter-select">
          <option value="">All Categories</option>
          <option *ngFor="let cat of availableCategories()" [value]="cat">{{ cat }}</option>
        </select>
      </div>

      <div class="scams-grid">
        <div class="scam-card" *ngFor="let scam of displayedScams()">
          <div class="scam-header">
            <span class="category-pill">{{ scam.category }}</span>
            <span class="frequency-badge" [class]="scam.frequency">{{ scam.frequency }}</span>
          </div>
          <h3>{{ translationService.currentLang() === 'hi' && scam.titleHindi ? scam.titleHindi : scam.title }}</h3>
          
          <div class="scam-meta">
            <span class="meta-item">🎯 {{ scam.targetOccupation.join(', ') }}</span>
            <span class="meta-item loss">₹ {{ scam.averageLoss | number }} {{ 'REGIONAL.AVG_LOSS' | translate }}</span>
          </div>

          <p class="description-preview" *ngIf="expandedScamId() !== scam.id">
            {{ translationService.currentLang() === 'hi' && scam.descriptionHindi ? scam.descriptionHindi : scam.description }}
          </p>

          <button class="btn-read-more" *ngIf="expandedScamId() !== scam.id" (click)="expandedScamId.set(scam.id)">Read More ↓</button>

          <div class="scam-expanded" *ngIf="expandedScamId() === scam.id">
            <p class="full-description">
              {{ translationService.currentLang() === 'hi' && scam.descriptionHindi ? scam.descriptionHindi : scam.description }}
            </p>
            <p class="local-context" *ngIf="scam.localContext">
              <strong>Why here:</strong> {{ translationService.currentLang() === 'hi' && scam.localContextHindi ? scam.localContextHindi : scam.localContext }}
            </p>

            <div class="how-it-works" *ngIf="scam.howItWorks?.length">
              <h4>{{ 'REGIONAL.HOW_IT_WORKS' | translate }}</h4>
              <ol>
                <li *ngFor="let step of scam.howItWorks">{{ step }}</li>
              </ol>
            </div>

            <div class="real-script" *ngIf="scam.realScript">
              <h4>🗣️ {{ 'REGIONAL.REAL_SCRIPT_LABEL' | translate }}</h4>
              <blockquote>"{{ scam.realScript }}"</blockquote>
            </div>

            <div class="prevention" *ngIf="scam.prevention">
              <h4>🛡️ {{ 'REGIONAL.PREVENTION' | translate }}</h4>
              <p>{{ translationService.currentLang() === 'hi' && scam.preventionHindi ? scam.preventionHindi : scam.prevention }}</p>
            </div>

            <div class="action-footer">
              <span class="report-to" *ngIf="scam.reportTo">🚨 {{ 'REGIONAL.REPORT_TO' | translate }}: {{ scam.reportTo }}</span>
              <button class="btn-share" (click)="shareScam(scam)">📱 {{ 'REGIONAL.SHARE_WARNING' | translate }}</button>
            </div>
            
            <button class="btn-close" (click)="expandedScamId.set(null)">Close ↑</button>
          </div>
        </div>
        
        <div class="no-results" *ngIf="displayedScams().length === 0">
          No scams found matching your filters.
        </div>
      </div>
    </div>

    <Cycysafeclick-location-onboarding *ngIf="showOnboarding || (!userLocation().stateId && !hasSkippedOnboarding)"
      (completed)="onboardingCompleted()">
    </Cycysafeclick-location-onboarding>
  `,
  styleUrls: ['./regional-scams.component.scss']
})
export class RegionalScamsComponent implements OnInit {
  store = inject(Store);
  service = inject(RegionalScamsService);
  translationService = inject(TranslationService);

  userLocation = this.store.selectSignal(selectUserLocation);
  
  db = signal<RegionalScamDatabase | null>(null);
  selectedTab = signal<'state'|'city'|'national'>('state');
  searchQuery = signal('');
  selectedCategory = signal<string>('');
  expandedScamId = signal<string | null>(null);
  
  showOnboarding = false;
  hasSkippedOnboarding = false;

  ngOnInit() {
    this.service.loadDatabase().subscribe(data => {
      this.db.set(data);
      // Auto-switch tabs if location is missing
      if (!this.userLocation().stateId) {
        this.selectedTab.set('national');
      } else if (!this.userLocation().cityId && this.selectedTab() === 'city') {
        this.selectedTab.set('state');
      }
    });
  }

  currentStateProfile = computed(() => {
    const loc = this.userLocation();
    const data = this.db();
    if (!loc.stateId || !data) return null;
    return data.states.find(s => s.stateId === loc.stateId) || null;
  });

  currentCityProfile = computed(() => {
    const loc = this.userLocation();
    const data = this.db();
    if (!loc.cityId || !data) return null;
    return data.cities.find(c => c.cityId === loc.cityId) || null;
  });

  currentStateName = computed(() => {
    const profile = this.currentStateProfile();
    if (!profile) return '';
    return this.translationService.currentLang() === 'hi' && profile.stateNameHindi ? profile.stateNameHindi : profile.stateName;
  });

  availableCategories = computed(() => {
    const data = this.db();
    if (!data) return [];
    const cats = new Set<string>();
    data.states.forEach(s => s.scams.forEach(scam => cats.add(scam.category)));
    data.cities.forEach(c => c.scams.forEach(scam => cats.add(scam.category)));
    return Array.from(cats).sort();
  });

  displayedScams = computed(() => {
    const data = this.db();
    if (!data) return [];
    
    let scams: RegionalScam[] = [];
    const tab = this.selectedTab();
    const loc = this.userLocation();

    if (tab === 'state' && loc.stateId) {
      scams = this.service.getScamsForStateSync(data, loc.stateId);
    } else if (tab === 'city' && loc.cityId) {
      const stateProfile = data.states.find(s => s.stateId === loc.stateId);
      const cityProfile = data.cities.find(c => c.cityId === loc.cityId);
      
      if (stateProfile) scams = [...scams, ...stateProfile.scams];
      if (cityProfile) scams = [...scams, ...cityProfile.scams];
    } else if (tab === 'national') {
      scams = this.service.getAllScamsSync(data);
    } else {
      // Fallback: If no location is set but tab is somehow state/city, show National to avoid empty screen
      scams = this.service.getAllScamsSync(data);
    }

    if (this.searchQuery()) {
      scams = this.service.searchScams(this.searchQuery(), scams);
    }
    
    if (this.selectedCategory()) {
      scams = scams.filter(s => s.category === this.selectedCategory());
    }
    
    return scams;
  });

  onboardingCompleted() {
    this.showOnboarding = false;
    this.hasSkippedOnboarding = true;
    
    // Auto-select tab based on newly set location
    const loc = this.userLocation();
    if (loc.cityId) {
      this.selectedTab.set('city');
    } else if (loc.stateId) {
      this.selectedTab.set('state');
    } else {
      this.selectedTab.set('national');
    }
  }

  shareScam(scam: RegionalScam) {
    const text = `⚠️ BEWARE OF THIS SCAM: ${scam.title}\n\n${scam.description}\n\nPrevention: ${scam.prevention}\n\nLearn more at Cycysafeclick Regional Scams.`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }
}
