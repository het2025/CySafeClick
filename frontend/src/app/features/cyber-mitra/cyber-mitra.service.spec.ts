import { TestBed } from '@angular/core/testing';

import { CyberMitraService } from './cyber-mitra.service';

describe('CyberMitraService', () => {
  let service: CyberMitraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CyberMitraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('prioritizes financial loss with emergency reporting guidance', (done) => {
    service.processMessage('money deducted in upi fraud', 'en').subscribe(reply => {
      expect(reply.content).toContain('Call 1930');
      expect(reply.actionButtons?.[0].route).toBe('/report-cybercrime');
      done();
    });
  });
});
