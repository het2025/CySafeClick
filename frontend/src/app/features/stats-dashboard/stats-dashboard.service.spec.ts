import { TestBed } from '@angular/core/testing';

import { StatsDashboardService } from './stats-dashboard.service';

describe('StatsDashboardService', () => {
  let service: StatsDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatsDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
