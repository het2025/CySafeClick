import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecureVaultComponent } from './secure-vault.component';

describe('SecureVaultComponent', () => {
  let component: SecureVaultComponent;
  let fixture: ComponentFixture<SecureVaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecureVaultComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SecureVaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
