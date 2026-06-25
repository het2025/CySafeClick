import { TestBed } from '@angular/core/testing';

import { IncidentResponseService } from './incident-response.service';

describe('IncidentResponseService', () => {
  let service: IncidentResponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IncidentResponseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
