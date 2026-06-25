import { TestBed } from '@angular/core/testing';

import { SeniorModeService } from './senior-mode.service';

describe('SeniorModeService', () => {
  let service: SeniorModeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeniorModeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
