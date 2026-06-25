import { NumberLookupService } from './number-lookup.service';

describe('NumberLookupService', () => {
  let service: NumberLookupService;

  beforeEach(() => {
    service = new NumberLookupService({} as any);
  });

  it('normalizes Indian numbers with country code and separators', () => {
    expect(service.normalizeNumber('+91-98765-43210')).toBe('9876543210');
  });

  it('validates normalized 10 digit numbers', () => {
    expect(service.validateIndianNumber('9876543210')).toBeTrue();
    expect(service.validateIndianNumber('12345')).toBeFalse();
  });
});
