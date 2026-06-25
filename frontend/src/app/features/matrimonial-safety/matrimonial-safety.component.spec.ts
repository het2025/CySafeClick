import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatrimonialSafetyComponent } from './matrimonial-safety.component';

describe('MatrimonialSafetyComponent', () => {
  let component: MatrimonialSafetyComponent;
  let fixture: ComponentFixture<MatrimonialSafetyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatrimonialSafetyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatrimonialSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
