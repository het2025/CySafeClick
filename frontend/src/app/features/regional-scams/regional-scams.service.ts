import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, shareReplay, tap } from 'rxjs';

export interface RegionalScamDatabase {
  states: StateScamProfile[];
  cities: CityScamProfile[];
}

export interface StateScamProfile {
  stateId: string;
  stateName: string;
  stateNameHindi: string;
  regionalContext: string;
  dominantScamTypes: string[];
  scams: RegionalScam[];
  localHelplines: LocalHelpline[];
  stateLanguage: string;
  stateCyberCellPhone: string;
  stateCyberCellEmail: string;
}

export interface CityScamProfile {
  cityId: string;
  cityName: string;
  stateId: string;
  population: string;
  notableFor: string;
  scams: RegionalScam[];
}

export interface RegionalScam {
  id: string;
  title: string;
  titleHindi: string;
  titleLocal?: string;
  category: string;
  targetOccupation: string[];
  targetAgeGroup: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  averageLoss: number;
  description: string;
  descriptionHindi: string;
  localContext: string;
  localContextHindi?: string;
  howItWorks: string[];
  realScript: string;
  redFlags: string[];
  reportedCases: number;
  prevention: string;
  preventionHindi: string;
  reportTo: string;
}

export interface LocalHelpline {
  name: string;
  number: string;
  jurisdiction: string;
}

@Injectable({ providedIn: 'root' })
export class RegionalScamsService {
  private http = inject(HttpClient);
  private database$: Observable<RegionalScamDatabase> | null = null;

  loadDatabase(): Observable<RegionalScamDatabase> {
    if (!this.database$) {
      this.database$ = this.http.get<RegionalScamDatabase>('assets/data/regional-scams.json').pipe(
        shareReplay(1)
      );
    }
    return this.database$;
  }

  getStateProfile(stateId: string): Observable<StateScamProfile | null> {
    return this.loadDatabase().pipe(
      map(db => db.states.find(s => s.stateId === stateId) || null)
    );
  }

  getCityProfile(cityId: string): Observable<CityScamProfile | null> {
    return this.loadDatabase().pipe(
      map(db => db.cities.find(c => c.cityId === cityId) || null)
    );
  }

  getScamsForStateSync(db: RegionalScamDatabase, stateId: string): RegionalScam[] {
    const stateProfile = db.states.find(s => s.stateId === stateId);
    let scams: RegionalScam[] = [];
    if (stateProfile) {
      scams = [...stateProfile.scams];
    }
    const stateCities = db.cities.filter(c => c.stateId === stateId);
    for (const city of stateCities) {
      scams = [...scams, ...city.scams];
    }
    return scams;
  }

  getAllScamsSync(db: RegionalScamDatabase): RegionalScam[] {
    let scams: RegionalScam[] = [];
    db.states.forEach(s => scams = [...scams, ...s.scams]);
    db.cities.forEach(c => scams = [...scams, ...c.scams]);
    return scams;
  }

  searchScams(query: string, scams: RegionalScam[]): RegionalScam[] {
    if (!query) return scams;
    const q = query.toLowerCase();
    return scams.filter(s => 
      s.title.toLowerCase().includes(q) ||
      s.titleHindi.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.targetOccupation.some(occ => occ.toLowerCase().includes(q))
    );
  }

  getTopScamsByLoss(stateId: string, limit: number): Observable<RegionalScam[]> {
    return this.loadDatabase().pipe(
      map(db => {
        const scams = this.getScamsForStateSync(db, stateId);
        return scams.sort((a, b) => b.averageLoss - a.averageLoss).slice(0, limit);
      })
    );
  }

  getTopScamsByFrequency(stateId: string, limit: number): Observable<RegionalScam[]> {
    return this.loadDatabase().pipe(
      map(db => {
        const scams = this.getScamsForStateSync(db, stateId);
        return scams.sort((a, b) => b.reportedCases - a.reportedCases).slice(0, limit);
      })
    );
  }

  getUserState(): string | null {
    return localStorage.getItem('Cycysafeclick_user_state');
  }

  setUserState(stateId: string, cityId?: string): void {
    localStorage.setItem('Cycysafeclick_user_state', stateId);
    if (cityId) {
      localStorage.setItem('Cycysafeclick_user_city', cityId);
    } else {
      localStorage.removeItem('Cycysafeclick_user_city');
    }
    localStorage.setItem('Cycysafeclick_location_onboarded', 'true');
  }

  hasUserSetLocation(): boolean {
    return localStorage.getItem('Cycysafeclick_location_onboarded') === 'true';
  }
}
