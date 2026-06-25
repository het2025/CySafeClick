import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildSafetyComponent } from './child-safety.component';

describe('ChildSafetyComponent', () => {
  let component: ChildSafetyComponent;
  let fixture: ComponentFixture<ChildSafetyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildSafetyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildSafetyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
