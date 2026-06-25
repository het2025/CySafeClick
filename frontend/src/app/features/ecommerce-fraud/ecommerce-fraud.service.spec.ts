import { TestBed } from '@angular/core/testing';

import { EcommerceFraudService } from './ecommerce-fraud.service';

describe('EcommerceFraudService', () => {
  let service: EcommerceFraudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EcommerceFraudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
