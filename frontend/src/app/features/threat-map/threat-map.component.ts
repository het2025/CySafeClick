import { Component, OnInit, ElementRef, ViewChild, HostListener, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';
import { ThreatMapService, MergedStateData } from './threat-map.service';

@Component({
  selector: 'app-threat-map',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './threat-map.component.html',
  styleUrls: ['./threat-map.component.scss']
})
export class ThreatMapComponent implements OnInit {
  @ViewChild('svgMap', { static: false }) svgEl!: ElementRef<SVGSVGElement>;

  private threatService = inject(ThreatMapService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  public t = inject(TranslationService);

  mergedData = signal<MergedStateData[]>([]);
  selectedState = signal<MergedStateData | null>(null);
  hoveredState = signal<MergedStateData | null>(null);
  viewMode = signal<'threat' | 'count' | 'trend'>('threat');
  
  tooltipX = signal(0);
  tooltipY = signal(0);
  
  zoomLevel = signal(1);
  panOffset = signal({ x: 0, y: 0 });

  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  
  // Show labels for all states since we are using a uniform grid
  largeStates = computed(() => this.mergedData());

  nationalStats = computed(() => this.threatService.getNationalStats(this.mergedData()));

  topStates = computed(() => this.threatService.getTopStates(5, this.mergedData()));

  ngOnInit() {
    this.threatService.getMergedData().subscribe(data => {
      this.mergedData.set(data);
      this.handleRouteParams();
    });
  }

  private handleRouteParams() {
    this.route.queryParams.subscribe(params => {
      if (params['state']) {
        const s = this.mergedData().find(st => st.id === params['state']);
        if (s) this.selectedState.set(s);
      }
      if (params['view']) {
        this.viewMode.set(params['view'] as any);
      }
    });
  }

  currentLanguage() {
    return this.t.currentLang();
  }

  formatStateName(name: string): string[] {
    if (!name) return [];
    
    // Split on ampersands or spaces to wrap nicely
    if (name.includes(' & ')) {
      return name.split(' & ').map((part, i) => i === 0 ? part + ' &' : part);
    }
    
    const words = name.split(' ');
    if (words.length === 1) return words;
    
    // Simple logic: return first word, and rest of words joined
    return [words[0], words.slice(1).join(' ')];
  }

  onStateHover(state: MergedStateData) {
    this.hoveredState.set(state);
  }

  onStateLeave() {
    this.hoveredState.set(null);
  }

  onStateClick(state: MergedStateData) {
    this.selectedState.set(state);
    this.updateUrl();
  }

  setViewMode(mode: 'threat' | 'count' | 'trend') {
    this.viewMode.set(mode);
    this.updateUrl();
  }

  private updateUrl() {
    const queryParams: any = {};
    if (this.selectedState()) queryParams.state = this.selectedState()!.id;
    if (this.viewMode() !== 'threat') queryParams.view = this.viewMode();
    
    this.router.navigate([], {
      queryParams,
      queryParamsHandling: 'merge',
      replaceUrl: true
    });
  }

  getFillColor(state: MergedStateData): string {
    const mode = this.viewMode();
    if (mode === 'threat') return state.fillColor;
    if (mode === 'trend') {
      return state.trendDirection === 'rising' ? '#ef4444' : 
             state.trendDirection === 'falling' ? '#22c55e' : '#94a3b8';
    }
    // count mode - intensity based on relative count
    const max = this.nationalStats().highestThreatState ? 
                this.mergedData().find(s => s.name === this.nationalStats().highestThreatState)?.weeklyReportCount || 1000 
                : 1000;
    const intensity = Math.min(1, state.weeklyReportCount / max);
    return `rgba(255, 153, 51, ${Math.max(0.2, intensity)})`;
  }

  // --- SVG Pan/Zoom Handlers ---

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (this.isDragging) {
      const dx = event.clientX - this.dragStart.x;
      const dy = event.clientY - this.dragStart.y;
      this.panOffset.set({ 
        x: this.panOffset().x + dx, 
        y: this.panOffset().y + dy 
      });
      this.dragStart = { x: event.clientX, y: event.clientY };
    }

    if (this.hoveredState() && this.svgEl) {
      const svgRect = this.svgEl.nativeElement.getBoundingClientRect();
      const svgX = ((event.clientX - svgRect.left) - this.panOffset().x) / this.zoomLevel();
      const svgY = ((event.clientY - svgRect.top) - this.panOffset().y) / this.zoomLevel();
      this.tooltipX.set(svgX);
      this.tooltipY.set(svgY);
    }
  }

  onMouseDown(event: MouseEvent) {
    this.isDragging = true;
    this.dragStart = { x: event.clientX, y: event.clientY };
    event.preventDefault(); // prevent text selection
  }

  @HostListener('mouseup')
  @HostListener('mouseleave')
  onMouseUp() {
    this.isDragging = false;
  }

  onWheel(event: WheelEvent) {
    event.preventDefault();
    const zoomDelta = event.deltaY > 0 ? -0.1 : 0.1;
    this.zoom(zoomDelta);
  }

  zoom(delta: number) {
    const newZoom = Math.min(Math.max(0.8, this.zoomLevel() + delta), 8);
    this.zoomLevel.set(newZoom);
  }

  resetZoom() {
    this.zoomLevel.set(1);
    this.panOffset.set({ x: 0, y: 0 });
  }

  trackByFn(index: number, state: MergedStateData) {
    return state.id;
  }
}
