import { TestBed } from '@angular/core/testing';

import { FactCheckerService } from './fact-checker.service';

describe('FactCheckerService', () => {
  let service: FactCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FactCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
