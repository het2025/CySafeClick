import { TestBed } from '@angular/core/testing';

import { WebCryptoService } from './web-crypto.service';

describe('WebCryptoService', () => {
  let service: WebCryptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebCryptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
