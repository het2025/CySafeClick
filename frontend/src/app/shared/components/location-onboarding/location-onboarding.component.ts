import { Component, inject, signal, computed, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { TranslationService } from '../../../core/services/translation.service';
import { RegionalScamsService, RegionalScamDatabase } from '../../../features/regional-scams/regional-scams.service';
import { setLocation, completeOnboarding } from '../../../store/location.store';

@Component({
  selector: 'CySafeClick-location-onboarding',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  template: `
    <div class="onboarding-overlay" *ngIf="isVisible()">
      <div class="onboarding-modal">
        <div class="modal-header">
          <h2>{{ 'ONBOARDING.TITLE' | translate }}</h2>
          <p>{{ 'ONBOARDING.SUBTITLE' | translate }}</p>
        </div>

        <!-- Step 1: State Selection -->
        <div class="step-container" *ngIf="step() === 1">
          <h3>{{ 'ONBOARDING.SELECT_STATE' | translate }}</h3>
          <div class="grid states-grid">
            <div class="grid-item" 
                 *ngFor="let state of db()?.states"
                 [class.selected]="selectedStateId() === state.stateId"
                 (click)="selectState(state.stateId)">
              <span class="abbr">{{ state.stateId }}</span>
              <div class="name-container">
                <span class="name-hi">{{ state.stateNameHindi }}</span>
                <span class="name-en">{{ state.stateName }}</span>
              </div>
            </div>
          </div>
          <div class="actions mt-4">
            <button class="btn-primary" [disabled]="!selectedStateId()" (click)="nextStep()">Next</button>
            <button class="btn-link" (click)="skip()">{{ 'ONBOARDING.SKIP' | translate }}</button>
          </div>
        </div>

        <!-- Step 2: City Selection -->
        <div class="step-container" *ngIf="step() === 2">
          <h3>{{ 'ONBOARDING.SELECT_CITY' | translate }}</h3>
          <div class="grid cities-grid">
            <div class="grid-item"
                 *ngFor="let city of availableCities()"
                 [class.selected]="selectedCityId() === city.cityId"
                 (click)="selectCity(city.cityId)">
              <span class="name-en">{{ city.cityName }}</span>
            </div>
            <div class="grid-item skip-city" 
                 [class.selected]="!selectedCityId()"
                 (click)="selectCity(null)">
              <span class="name-en">Entire State</span>
            </div>
          </div>
          
          <div class="actions mt-4">
            <button class="btn-secondary" (click)="prevStep()">Back</button>
            <button class="btn-primary" (click)="finish()">{{ 'ONBOARDING.START_EXPLORING' | translate }}</button>
          </div>
          <div class="footer-note">
            <p>{{ 'ONBOARDING.CHANGE_LATER' | translate }}</p>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .onboarding-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(10, 22, 40, 0.95);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      font-family: 'Inter', sans-serif;
    }
    .onboarding-modal {
      background: white;
      width: 100%;
      max-width: 800px;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      max-height: 90vh;
      overflow-y: auto;
    }
    .modal-header { text-align: center; margin-bottom: 2rem; }
    .modal-header h2 { font-size: 2rem; color: var(--CySafeClick-navy); margin: 0 0 0.5rem 0; }
    .modal-header p { color: #64748b; font-size: 1.1rem; margin: 0; }
    
    .grid {
      display: grid;
      gap: 1rem;
    }
    .states-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
    .cities-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); }
    
    .grid-item {
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 1rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.2s;
    }
    .grid-item:hover { border-color: #cbd5e1; background: #f8fafc; }
    .grid-item.selected { border-color: var(--CySafeClick-navy); background: #f1f5f9; box-shadow: 0 0 0 1px var(--CySafeClick-navy); }
    
    .abbr {
      background: #e2e8f0;
      color: #475569;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 0.8rem;
    }
    .name-container { display: flex; flex-direction: column; }
    .name-hi { font-size: 1.1rem; font-weight: 600; color: #1e293b; }
    .name-en { font-size: 0.85rem; color: #64748b; }
    
    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      align-items: center;
    }
    button { padding: 10px 24px; border-radius: 6px; font-weight: 600; cursor: pointer; border: none; font-size: 1rem; }
    .btn-primary { background: var(--CySafeClick-navy); color: white; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .btn-secondary { background: #e2e8f0; color: #1e293b; }
    .btn-link { background: none; color: #64748b; text-decoration: underline; }
    
    .footer-note { text-align: center; margin-top: 2rem; color: #94a3b8; font-size: 0.9rem; }
    .mt-4 { margin-top: 2rem; }
  `]
})
export class LocationOnboardingComponent implements OnInit {
  store = inject(Store);
  scamsService = inject(RegionalScamsService);

  isVisible = signal<boolean>(true);
  step = signal<number>(1);
  selectedStateId = signal<string | null>(null);
  selectedCityId = signal<string | null>(null);
  
  db = signal<RegionalScamDatabase | null>(null);
  
  @Output() completed = new EventEmitter<void>();

  availableCities = computed(() => {
    const sId = this.selectedStateId();
    const data = this.db();
    if (!sId || !data) return [];
    return data.cities.filter(c => c.stateId === sId);
  });

  ngOnInit() {
    this.scamsService.loadDatabase().subscribe(data => {
      this.db.set(data);
    });
  }

  selectState(stateId: string) {
    this.selectedStateId.set(stateId);
  }

  selectCity(cityId: string | null) {
    this.selectedCityId.set(cityId);
  }

  nextStep() {
    if (this.availableCities().length > 0) {
      this.step.set(2);
    } else {
      this.finish();
    }
  }

  prevStep() {
    this.step.set(1);
  }

  finish() {
    const stateId = this.selectedStateId();
    if (stateId) {
      this.store.dispatch(setLocation({ stateId, cityId: this.selectedCityId() || undefined }));
    }
    this.close();
  }

  skip() {
    this.store.dispatch(completeOnboarding());
    this.close();
  }

  close() {
    this.isVisible.set(false);
    this.completed.emit();
  }
}
