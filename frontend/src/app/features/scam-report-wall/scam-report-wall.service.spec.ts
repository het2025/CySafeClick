import { TestBed } from '@angular/core/testing';

import { ScamReportWallService } from './scam-report-wall.service';

describe('ScamReportWallService', () => {
  let service: ScamReportWallService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScamReportWallService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
