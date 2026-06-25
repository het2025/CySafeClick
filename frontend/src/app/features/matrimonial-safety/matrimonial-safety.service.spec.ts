import { TestBed } from '@angular/core/testing';

import { MatrimonialSafetyService } from './matrimonial-safety.service';

describe('MatrimonialSafetyService', () => {
  let service: MatrimonialSafetyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatrimonialSafetyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
