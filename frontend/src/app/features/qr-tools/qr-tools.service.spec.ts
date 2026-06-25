import { TestBed } from '@angular/core/testing';

import { QrToolsService } from './qr-tools.service';

describe('QrToolsService', () => {
  let service: QrToolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QrToolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
