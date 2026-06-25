import { PhishingDetectorComponent } from './phishing-detector.component';

describe('PhishingDetectorComponent', () => {
  it('flags shortener and brand impersonation URLs', () => {
    const component = new PhishingDetectorComponent();
    component.mode.set('url');
    component.input.set('http://bit.ly/sbi-kyc-verify');

    component.scan();

    expect(component.riskLevel()).not.toBe('LOW RISK');
    expect(component.findings().length).toBeGreaterThan(1);
  });
});
