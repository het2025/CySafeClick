import { UpiScannerService } from './upi-scanner.service';

describe('UpiScannerService', () => {
  let service: UpiScannerService;

  beforeEach(() => {
    service = new UpiScannerService();
  });

  it('flags phone-number VPAs as personal accounts', () => {
    const result = service.analyze('9876543210@ybl');

    expect(result.riskLevel).toBe('suspicious');
    expect(result.flags.some(flag => flag.type === 'Phone Number VPA')).toBeTrue();
  });

  it('flags deceptive UPI notes as dangerous', () => {
    const result = service.analyze('upi://pay?pa=refund@ybl&pn=SBI%20Refund&am=1&tn=urgent%20otp%20verify');

    expect(result.riskLevel).toBe('dangerous');
    expect(result.flags.length).toBeGreaterThan(0);
  });
});
