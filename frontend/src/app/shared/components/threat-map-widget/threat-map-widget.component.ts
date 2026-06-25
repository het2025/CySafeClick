import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThreatMapService, MergedStateData, NationalStats } from '../../../features/threat-map/threat-map.service';

@Component({
  selector: 'safeclick-threat-map-widget',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="threat-card">

      <!-- Header -->
      <div class="card-header">
        <div class="header-left">
          <div class="live-badge">
            <span class="pulse-dot"></span>
            <span>LIVE</span>
          </div>
          <div>
            <h2>🛡️ India Cyber Threat Overview</h2>
            <p class="subtitle">Real-time fraud activity across all states</p>
          </div>
        </div>
        <a routerLink="/map" class="full-map-btn">View Full Map →</a>
      </div>

      <!-- National Stats Bar -->
      <div class="stats-bar" *ngIf="nationalStats()">
        <div class="stat-item">
          <span class="stat-value danger">{{ nationalStats()?.statesAlert }}</span>
          <span class="stat-label">🔴 States on High Alert</span>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <span class="stat-value warning">{{ nationalStats()?.statesRising }}</span>
          <span class="stat-label">📈 States with Rising Trend</span>
        </div>
        <div class="divider"></div>
        <div class="stat-item">
          <span class="stat-value safe">{{ nationalStats()?.totalReports?.toLocaleString() }}</span>
          <span class="stat-label">📊 Weekly Reports Nationwide</span>
        </div>
      </div>

      <!-- Main Content: Map + Top States -->
      <div class="main-content">

        <!-- SVG Map -->
        <div class="svg-wrapper">
          <svg viewBox="60 70 720 860" width="100%" height="100%">
            <defs>
              <filter id="drop-shadow">
                <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
              </filter>
            </defs>
            <g>
              <!-- State shapes -->
              <path *ngFor="let state of mergedData()"
                class="state-path"
                [attr.d]="state.svgPath"
                [attr.fill]="state.fillColor"
                stroke="#0f172a"
                stroke-width="1.5"
                (mouseenter)="hoveredState.set(state)"
                (mouseleave)="hoveredState.set(null)"
                (click)="goToFullMap(state.id)"
              />
              <!-- State labels: abbreviation + short name -->
              <g *ngFor="let state of mergedData()"
                 (mouseenter)="hoveredState.set(state)"
                 (mouseleave)="hoveredState.set(null)"
                 (click)="goToFullMap(state.id)"
                 style="cursor:pointer; pointer-events:none;">
                <!-- State ID abbreviation (large, bold) -->
                <text
                  [attr.x]="state.centroidX"
                  [attr.y]="state.centroidY - 8"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  fill="white"
                  font-weight="900"
                  font-size="18"
                  font-family="'Segoe UI', sans-serif"
                  filter="url(#drop-shadow)"
                  style="pointer-events:none;">{{ state.id }}</text>
                <!-- State short name (smaller, below) -->
                <text
                  [attr.x]="state.centroidX"
                  [attr.y]="state.centroidY + 14"
                  text-anchor="middle"
                  dominant-baseline="middle"
                  fill="rgba(255,255,255,0.9)"
                  font-weight="600"
                  font-size="11"
                  font-family="'Segoe UI', sans-serif"
                  filter="url(#drop-shadow)"
                  style="pointer-events:none;">{{ getShortName(state.name) }}</text>
              </g>
            </g>
          </svg>

          <!-- Hover Tooltip -->
          <div class="hover-tooltip" *ngIf="hoveredState()">
            <div class="tooltip-name">{{ hoveredState()?.name }}</div>
            <div class="tooltip-threat" [style.color]="hoveredState()?.fillColor">
              ● {{ hoveredState()?.threatLabel }} Threat
            </div>
            <div class="tooltip-reports">{{ hoveredState()?.weeklyReportCount }} reports this week</div>
            <div class="tooltip-trend" *ngIf="hoveredState()?.trendDirection">
              {{ getTrendIcon(hoveredState()?.trendDirection!) }} Trend: {{ hoveredState()?.trendDirection | titlecase }}
            </div>
          </div>

          <!-- Legend -->
          <div class="map-legend">
            <div class="legend-item" *ngFor="let l of legend">
              <span class="legend-dot" [style.background]="l.color"></span>
              <span>{{ l.label }}</span>
            </div>
          </div>
        </div>

        <!-- Right Panel: Top States -->
        <div class="right-panel">
          <h4 class="panel-title">🔥 Top Affected States</h4>
          <div class="state-list">
            <div class="state-row" *ngFor="let state of topStates(); let i = index"
                 (click)="goToFullMap(state.id)">
              <span class="rank-badge">#{{ i + 1 }}</span>
              <div class="state-info">
                <span class="state-name">{{ state.name }}</span>
                <span class="state-reports">{{ state.weeklyReportCount }} reports</span>
              </div>
              <div class="state-right">
                <span class="threat-pill" [style.background]="state.fillColor + '22'" [style.color]="state.fillColor" [style.border]="'1px solid ' + state.fillColor">
                  {{ state.threatLabel }}
                </span>
                <span class="trend-icon">{{ getTrendIcon(state.trendDirection) }}</span>
              </div>
            </div>
          </div>

          <!-- Most Common Scam -->
          <div class="scam-highlight" *ngIf="topScamType()">
            <div class="scam-highlight-label">⚠️ Most Reported Scam This Week</div>
            <div class="scam-highlight-value">{{ topScamType() }}</div>
          </div>

          <!-- Safety Tip -->
          <div class="safety-tip">
            <div class="tip-header">💡 Stay Safe</div>
            <p>Never share your OTP, UPI PIN, or Aadhaar number with anyone — not even bank officials.</p>
            <a routerLink="/report-cybercrime" class="report-link">Report a Crime →</a>
          </div>
        </div>

      </div>

      <!-- Footer -->
      <div class="card-footer">
        <span class="last-updated">🔄 Data refreshed weekly · Source: Cybercrime.gov.in</span>
        <span class="helpline">Emergency? Call <strong>1930</strong></span>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .threat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      margin: 32px 0;
    }

    /* ── Header ── */
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 24px;
      background: linear-gradient(135deg, #0A1628 0%, #1e3a5f 100%);
      flex-wrap: wrap;
      gap: 12px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .live-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(239,68,68,0.15);
      border: 1px solid rgba(239,68,68,0.4);
      color: #f87171;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 1px;
      white-space: nowrap;
    }
    .pulse-dot {
      width: 7px; height: 7px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 1.5s infinite;
      display: inline-block;
    }
    .card-header h2 {
      color: white;
      font-size: 1.25rem;
      margin: 0 0 2px 0;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 0.85rem;
      margin: 0;
    }
    .full-map-btn {
      color: #FF9933;
      font-weight: 700;
      font-size: 0.9rem;
      text-decoration: none;
      border: 1px solid rgba(255,153,51,0.4);
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .full-map-btn:hover {
      background: rgba(255,153,51,0.1);
    }

    /* ── Stats Bar ── */
    .stats-bar {
      display: flex;
      align-items: center;
      justify-content: space-around;
      background: linear-gradient(135deg, #0f172a, #1e293b);
      padding: 14px 24px;
      gap: 8px;
      flex-wrap: wrap;
    }
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    .stat-value {
      font-size: 1.8rem;
      font-weight: 900;
      line-height: 1;
    }
    .stat-value.danger { color: #ef4444; }
    .stat-value.warning { color: #f59e0b; }
    .stat-value.safe { color: #22c55e; }
    .stat-label {
      font-size: 0.78rem;
      color: #94a3b8;
      text-align: center;
      font-weight: 600;
    }
    .divider {
      width: 1px;
      height: 40px;
      background: rgba(255,255,255,0.1);
    }

    /* ── Main Content ── */
    .main-content {
      display: grid;
      grid-template-columns: 1fr 320px;
      min-height: 320px;
    }

    /* Map */
    .svg-wrapper {
      position: relative;
      padding: 12px;
      background: linear-gradient(180deg, #0f172a 0%, #0A1628 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      min-height: 320px;
    }
    .svg-wrapper svg {
      width: 100%;
      height: 100%;
      min-height: 290px;
    }
    .state-path {
      cursor: pointer;
      transition: filter 0.2s, stroke-width 0.2s;
    }
    .state-path:hover {
      filter: brightness(1.3) drop-shadow(0 0 6px currentColor);
      stroke: #FF9933 !important;
      stroke-width: 2.5px !important;
    }

    /* Hover Tooltip */
    .hover-tooltip {
      position: absolute;
      bottom: 60px;
      left: 16px;
      background: rgba(10,22,40,0.95);
      border: 1px solid rgba(255,153,51,0.4);
      border-radius: 10px;
      padding: 10px 14px;
      pointer-events: none;
      min-width: 160px;
      backdrop-filter: blur(8px);
    }
    .tooltip-name {
      color: white;
      font-weight: 800;
      font-size: 0.95rem;
      margin-bottom: 4px;
    }
    .tooltip-threat {
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .tooltip-reports {
      color: #94a3b8;
      font-size: 0.8rem;
    }
    .tooltip-trend {
      color: #94a3b8;
      font-size: 0.8rem;
      margin-top: 2px;
    }

    /* Legend */
    .map-legend {
      position: absolute;
      bottom: 12px;
      right: 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      background: rgba(10,22,40,0.85);
      padding: 8px 12px;
      border-radius: 8px;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.72rem;
      color: #94a3b8;
      font-weight: 600;
    }
    .legend-dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    /* ── Right Panel ── */
    .right-panel {
      background: var(--surface);
      border-left: 1px solid var(--border);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      overflow-y: auto;
    }
    .panel-title {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--text);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .state-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .state-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
      border-radius: 8px;
      background: var(--bg);
      border: 1px solid var(--border);
      cursor: pointer;
      transition: all 0.2s;
    }
    .state-row:hover {
      border-color: #FF9933;
      transform: translateX(3px);
    }
    .rank-badge {
      font-size: 0.72rem;
      font-weight: 900;
      color: var(--muted);
      min-width: 24px;
    }
    .state-info {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    .state-name {
      font-weight: 700;
      font-size: 0.88rem;
      color: var(--text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .state-reports {
      font-size: 0.75rem;
      color: var(--muted);
    }
    .state-right {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-shrink: 0;
    }
    .threat-pill {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 700;
      white-space: nowrap;
    }
    .trend-icon {
      font-size: 1rem;
    }

    /* Scam Highlight */
    .scam-highlight {
      background: rgba(239,68,68,0.08);
      border: 1px solid rgba(239,68,68,0.25);
      border-left: 4px solid #ef4444;
      padding: 10px 12px;
      border-radius: 8px;
    }
    .scam-highlight-label {
      font-size: 0.72rem;
      font-weight: 700;
      color: #ef4444;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .scam-highlight-value {
      font-size: 0.9rem;
      font-weight: 800;
      color: var(--text);
    }

    /* Safety Tip */
    .safety-tip {
      background: rgba(255,153,51,0.07);
      border: 1px solid rgba(255,153,51,0.2);
      border-left: 4px solid #FF9933;
      padding: 10px 12px;
      border-radius: 8px;
      margin-top: auto;
    }
    .tip-header {
      font-size: 0.75rem;
      font-weight: 800;
      color: #FF9933;
      margin-bottom: 4px;
      text-transform: uppercase;
    }
    .safety-tip p {
      font-size: 0.82rem;
      color: var(--muted);
      line-height: 1.4;
      margin: 0 0 8px 0;
    }
    .report-link {
      color: #FF9933;
      font-size: 0.82rem;
      font-weight: 700;
      text-decoration: none;
    }
    .report-link:hover { text-decoration: underline; }

    /* Footer */
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 24px;
      background: var(--bg);
      border-top: 1px solid var(--border);
      flex-wrap: wrap;
      gap: 8px;
    }
    .last-updated {
      font-size: 0.78rem;
      color: var(--muted);
    }
    .helpline {
      font-size: 0.82rem;
      color: var(--text);
    }
    .helpline strong {
      color: #ef4444;
    }

    /* Animations */
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.6); opacity: 0.5; }
    }

    /* Responsive */
    @media (max-width: 900px) {
      .main-content {
        grid-template-columns: 1fr;
      }
      .right-panel {
        border-left: none;
        border-top: 1px solid var(--border);
        max-height: 400px;
      }
      .svg-wrapper svg {
        max-height: 260px;
      }
    }
    @media (max-width: 600px) {
      .stats-bar { flex-direction: column; gap: 12px; }
      .divider { width: 100%; height: 1px; }
    }
  `]
})
export class ThreatMapWidgetComponent implements OnInit {
  private threatService = inject(ThreatMapService);
  private router = inject(Router);

  mergedData = signal<MergedStateData[]>([]);
  hoveredState = signal<MergedStateData | null>(null);
  nationalStats = signal<NationalStats | null>(null);

  legend = [
    { color: '#22c55e', label: 'Low' },
    { color: '#84cc16', label: 'Moderate' },
    { color: '#f59e0b', label: 'High' },
    { color: '#f97316', label: 'Very High' },
    { color: '#ef4444', label: 'Critical' },
  ];

  topStates = computed(() =>
    [...this.mergedData()]
      .sort((a, b) => b.weeklyReportCount - a.weeklyReportCount)
      .slice(0, 6)
  );

  topScamType = computed(() => {
    const top = this.topStates();
    if (!top.length) return null;
    // Count scam types across top states
    const counts: Record<string, number> = {};
    top.forEach(s => s.topScamTypes?.forEach(t => {
      counts[t.type] = (counts[t.type] || 0) + t.count;
    }));
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || null;
  });

  ngOnInit() {
    this.threatService.getMergedData().subscribe(data => {
      this.mergedData.set(data);
      this.nationalStats.set(this.threatService.getNationalStats(data));
    });
  }

  goToFullMap(stateId: string) {
    this.router.navigate(['/map'], { queryParams: { state: stateId } });
  }

  getTrendIcon(direction: string): string {
    if (direction === 'rising') return '📈';
    if (direction === 'falling') return '📉';
    return '➡️';
  }

  getShortName(name: string): string {
    const map: Record<string, string> = {
      'Andhra Pradesh': 'Andhra Pr.',
      'Arunachal Pradesh': 'Arunachal',
      'Himachal Pradesh': 'Himachal',
      'Madhya Pradesh': 'Madhya Pr.',
      'Uttar Pradesh': 'Uttar Pr.',
      'Uttarakhand': 'Uttarakhand',
      'Chhattisgarh': 'Chhattisgarh',
      'Jharkhand': 'Jharkhand',
      'West Bengal': 'W. Bengal',
      'Tamil Nadu': 'Tamil Nadu',
      'Jammu & Kashmir': 'J&K',
    };
    return map[name] || name;
  }
}
