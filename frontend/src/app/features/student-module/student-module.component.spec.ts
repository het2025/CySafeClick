import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentModuleComponent } from './student-module.component';

describe('StudentModuleComponent', () => {
  let component: StudentModuleComponent;
  let fixture: ComponentFixture<StudentModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentModuleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
