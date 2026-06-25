import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessSecurityComponent } from './business-security.component';

describe('BusinessSecurityComponent', () => {
  let component: BusinessSecurityComponent;
  let fixture: ComponentFixture<BusinessSecurityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessSecurityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BusinessSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
