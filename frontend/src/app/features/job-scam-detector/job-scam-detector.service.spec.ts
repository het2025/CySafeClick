import { TestBed } from '@angular/core/testing';

import { JobScamDetectorService } from './job-scam-detector.service';

describe('JobScamDetectorService', () => {
  let service: JobScamDetectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobScamDetectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
