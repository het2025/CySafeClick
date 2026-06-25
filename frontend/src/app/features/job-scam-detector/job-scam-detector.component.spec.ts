import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobScamDetectorComponent } from './job-scam-detector.component';

describe('JobScamDetectorComponent', () => {
  let component: JobScamDetectorComponent;
  let fixture: ComponentFixture<JobScamDetectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobScamDetectorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobScamDetectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
