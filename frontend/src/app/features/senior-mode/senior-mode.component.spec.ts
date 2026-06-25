import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeniorModeComponent } from './senior-mode.component';

describe('SeniorModeComponent', () => {
  let component: SeniorModeComponent;
  let fixture: ComponentFixture<SeniorModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeniorModeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeniorModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
