import { TestBed } from '@angular/core/testing';

import { InvestmentScamService } from './investment-scam.service';

describe('InvestmentScamService', () => {
  let service: InvestmentScamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InvestmentScamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
