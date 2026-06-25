import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentScamComponent } from './investment-scam.component';

describe('InvestmentScamComponent', () => {
  let component: InvestmentScamComponent;
  let fixture: ComponentFixture<InvestmentScamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentScamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InvestmentScamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
