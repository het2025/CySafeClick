import { Component, OnInit, OnDestroy, signal, computed, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../../core/services/translation.service';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { FraudTickerService, TickerItem } from '../../../core/services/fraud-ticker.service';
import { TickerDetailDrawerComponent } from './ticker-detail-drawer/ticker-detail-drawer.component';

export const tickerConfig = {
  scrollSpeed: 60, // pixels per second
  pauseOnHover: true,
  autoRefreshMinutes: 60,
  maxItemsToShow: 20,
  showBreakingFirst: true,
  defaultState: 'All India',
  dismissDurationHours: 24
};

@Component({
  selector: 'safeclick-fraud-ticker',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, TickerDetailDrawerComponent],
  template: `
    <div class="ticker-container" *ngIf="!isDismissed() && filteredItems().length > 0" 
         (mouseenter)="isPaused.set(true)" 
         (mouseleave)="isPaused.set(false)"
         tabindex="0">
      
      <!-- Left Label Section -->
      <div class="ticker-label">
        <div class="live-indicator">
          <span class="dot"></span>
          <span class="text">{{ 'TICKER.LIVE_ALERTS' | translate }}</span>
        </div>
        
        <div class="separator"></div>
        
        <select class="state-filter" [ngModel]="activeState()" (ngModelChange)="onStateChange($event)">
          <option *ngFor="let state of indianStates" [value]="state">{{ state }}</option>
        </select>
      </div>
      
      <!-- Scrolling Ticker Section -->
      <div class="ticker-content" [class.paused]="isPaused()">
        <div class="ticker-track">
          <!-- Render items twice for seamless loop -->
          <ng-container *ngTemplateOutlet="tickerItemsList"></ng-container>
          <ng-container *ngTemplateOutlet="tickerItemsList"></ng-container>
        </div>
      </div>
      
      <!-- Right Side Actions -->
      <button class="close-btn" (click)="dismissTicker()" aria-label="Close ticker">×</button>
    </div>
    
    <ng-template #tickerItemsList>
      <div class="ticker-item" *ngFor="let item of displayItems()" (click)="openDetail(item)" (keyup.enter)="openDetail(item)" tabindex="0">
        <span class="severity-badge" [ngClass]="item.severity">{{ item.severity }}</span>
        <span class="breaking-badge" *ngIf="item.isBreaking">BREAKING</span>
        
        <span class="ticker-item-text">
          {{ isHindi() ? item.textHindi : item.text }}
        </span>
        
        <span class="category-pill">{{ item.category }}</span>
        <span class="learn-more">LEARN MORE →</span>
        <span class="item-separator">◆</span>
      </div>
    </ng-template>

    <safeclick-ticker-detail-drawer 
      [item]="selectedItem()" 
      [isOpen]="isDrawerOpen()" 
      (close)="closeDrawer()">
    </safeclick-ticker-detail-drawer>
  `,
  styleUrls: ['./fraud-ticker.component.scss']
})
export class FraudTickerComponent implements OnInit, OnDestroy {
  tickerItems = signal<TickerItem[]>([]);
  activeState = signal<string>(tickerConfig.defaultState);
  isPaused = signal(false);
  isDismissed = signal(false);
  
  selectedItem = signal<TickerItem | null>(null);
  isDrawerOpen = signal(false);

  @HostBinding('class.paused') 
  get isPausedClass() { return this.isPaused(); }

  indianStates = [
    'All India', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 
    'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
    'Uttarakhand', 'West Bengal', 'Delhi'
  ];

  filteredItems = computed(() => {
    const state = this.activeState();
    let filtered = this.tickerItems().filter(item => 
      item.targetState === 'All India' || 
      item.targetState === state ||
      item.targetState.includes(state)
    );
    
    // Fallback if no alerts for specific state
    if (filtered.length === 0 && state !== 'All India') {
      filtered = this.tickerItems().filter(item => item.targetState === 'All India');
    }
    
    return filtered.slice(0, tickerConfig.maxItemsToShow);
  });

  // Derived signal for UI rendering to avoid function calls in template where possible
  displayItems = computed(() => this.filteredItems());

  hasBreakingItems = computed(() => this.filteredItems().some(i => i.isBreaking));

  private isBrowser: boolean;

  constructor(
    private fraudTickerService: FraudTickerService,
    private translationService: TranslationService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.checkDismissedStatus();
      const savedState = this.fraudTickerService.getUserState();
      if (savedState) {
        this.activeState.set(savedState);
      }
      
      this.loadData();
      this.fraudTickerService.startAutoRefresh(tickerConfig.autoRefreshMinutes, (items) => {
        this.tickerItems.set(items);
      });
    }
  }

  ngOnDestroy() {
    this.fraudTickerService.stopAutoRefresh();
  }

  loadData() {
    this.fraudTickerService.loadTickerItems().subscribe(items => {
      this.tickerItems.set(items);
    });
  }

  onStateChange(newState: string) {
    this.activeState.set(newState);
    this.fraudTickerService.setUserState(newState);
  }

  isHindi(): boolean {
    return this.translationService.currentLang() === 'hi';
  }

  openDetail(item: TickerItem) {
    this.selectedItem.set(item);
    this.isDrawerOpen.set(true);
    this.isPaused.set(true); // Pause while reading
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
    this.isPaused.set(false);
    setTimeout(() => this.selectedItem.set(null), 300); // Clear after animation
  }

  dismissTicker() {
    this.isDismissed.set(true);
    if (this.isBrowser) {
      localStorage.setItem('safeclick_ticker_dismissed', Date.now().toString());
    }
  }

  private checkDismissedStatus() {
    if (!this.isBrowser) return;
    const dismissedAt = localStorage.getItem('safeclick_ticker_dismissed');
    if (dismissedAt) {
      const dismissTime = parseInt(dismissedAt, 10);
      const hoursSince = (Date.now() - dismissTime) / (1000 * 60 * 60);
      if (hoursSince < tickerConfig.dismissDurationHours) {
        this.isDismissed.set(true);
      } else {
        localStorage.removeItem('safeclick_ticker_dismissed');
      }
    }
  }
}

