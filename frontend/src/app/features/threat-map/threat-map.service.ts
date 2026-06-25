import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface StateMapData {
  id: string;
  name: string;
  nameHindi: string;
  capital: string;
  svgPath: string;
  labelX: number;
  labelY: number;
  centroidX: number;
  centroidY: number;
}

export interface StatScamType {
  type: string;
  count: number;
  percentOfTotal: number;
}

export interface StateThreatData {
  stateId: string;
  stateName: string;
  threatLevel: 1 | 2 | 3 | 4 | 5;
  weeklyReportCount: number;
  topScamTypes: StatScamType[];
  activeAlerts: string[];
  totalLossThisMonth: number;
  mostTargetedCity: string;
  mostTargetedAgeGroup: string;
  trendDirection: 'rising' | 'falling' | 'stable';
  lastUpdated: string;
}

export interface MergedStateData extends StateMapData, StateThreatData {
  fillColor: string;
  hoverColor: string;
  threatLabel: string;
}

export interface NationalStats {
  totalReports: number;
  totalLoss: number;
  highestThreatState: string;
  lowestThreatState: string;
  statesRising: number;
  statesAlert: number;
}

@Injectable({
  providedIn: 'root'
})
export class ThreatMapService {
  private readonly MAP_DATA_URL = 'assets/maps/india-states.json';
  private readonly THREAT_DATA_URL = `${environment.apiUrl}/map`;

  constructor(private http: HttpClient) {}

  loadMapData(): Observable<StateMapData[]> {
    return this.http.get<StateMapData[]>(this.MAP_DATA_URL).pipe(
      catchError(err => {
        console.error('Failed to load map data', err);
        return [];
      })
    );
  }

  loadThreatData(): Observable<StateThreatData[]> {
    return this.http.get<StateThreatData[]>(this.THREAT_DATA_URL).pipe(
      catchError(err => {
        console.error('Failed to load threat data', err);
        return [];
      })
    );
  }

  getThreatColor(level: 1 | 2 | 3 | 4 | 5): string {
    switch (level) {
      case 1: return '#22c55e'; // Green
      case 2: return '#84cc16'; // Light green
      case 3: return '#f59e0b'; // Amber
      case 4: return '#f97316'; // Orange
      case 5: return '#ef4444'; // Red
      default: return '#334155'; // Unknown
    }
  }

  getThreatColorDark(level: 1 | 2 | 3 | 4 | 5): string {
    switch (level) {
      case 1: return '#16a34a';
      case 2: return '#65a30d';
      case 3: return '#d97706';
      case 4: return '#ea580c';
      case 5: return '#dc2626';
      default: return '#1e293b';
    }
  }

  getStateLabel(level: 1 | 2 | 3 | 4 | 5): string {
    switch (level) {
      case 1: return 'Low';
      case 2: return 'Moderate';
      case 3: return 'High';
      case 4: return 'Very High';
      case 5: return 'Critical';
      default: return 'Unknown';
    }
  }

  getMergedData(): Observable<MergedStateData[]> {
    return forkJoin({
      mapData: this.loadMapData(),
      threatData: this.loadThreatData()
    }).pipe(
      map(({ mapData, threatData }) => {
        return mapData.map(state => {
          const threat = threatData.find(t => t.stateId === state.id) || this.getDefaultThreat(state);
          return {
            ...state,
            ...threat,
            fillColor: this.getThreatColor(threat.threatLevel),
            hoverColor: this.getThreatColorDark(threat.threatLevel),
            threatLabel: this.getStateLabel(threat.threatLevel)
          } as MergedStateData;
        });
      })
    );
  }

  getTopStates(count: number, mergedData: MergedStateData[]): MergedStateData[] {
    return [...mergedData]
      .sort((a, b) => b.weeklyReportCount - a.weeklyReportCount)
      .slice(0, count);
  }

  getNationalStats(mergedData: MergedStateData[]): NationalStats {
    if (!mergedData || mergedData.length === 0) {
      return {
        totalReports: 0,
        totalLoss: 0,
        highestThreatState: 'N/A',
        lowestThreatState: 'N/A',
        statesRising: 0,
        statesAlert: 0
      };
    }

    const sorted = [...mergedData].sort((a, b) => b.weeklyReportCount - a.weeklyReportCount);
    
    return {
      totalReports: mergedData.reduce((sum, state) => sum + state.weeklyReportCount, 0),
      totalLoss: mergedData.reduce((sum, state) => sum + state.totalLossThisMonth, 0),
      highestThreatState: sorted[0].name,
      lowestThreatState: sorted[sorted.length - 1].name,
      statesRising: mergedData.filter(s => s.trendDirection === 'rising').length,
      statesAlert: mergedData.filter(s => s.threatLevel >= 4).length
    };
  }

  private getDefaultThreat(state: StateMapData): StateThreatData {
    return {
      stateId: state.id,
      stateName: state.name,
      threatLevel: 1,
      weeklyReportCount: 0,
      topScamTypes: [],
      activeAlerts: [],
      totalLossThisMonth: 0,
      mostTargetedCity: state.capital || 'Unknown',
      mostTargetedAgeGroup: 'N/A',
      trendDirection: 'stable',
      lastUpdated: new Date().toISOString()
    };
  }
}
