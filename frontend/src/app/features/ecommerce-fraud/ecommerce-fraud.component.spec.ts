import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcommerceFraudComponent } from './ecommerce-fraud.component';

describe('EcommerceFraudComponent', () => {
  let component: EcommerceFraudComponent;
  let fixture: ComponentFixture<EcommerceFraudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EcommerceFraudComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EcommerceFraudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
