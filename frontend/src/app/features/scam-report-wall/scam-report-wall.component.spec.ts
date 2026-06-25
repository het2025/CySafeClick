import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScamReportWallComponent } from './scam-report-wall.component';

describe('ScamReportWallComponent', () => {
  let component: ScamReportWallComponent;
  let fixture: ComponentFixture<ScamReportWallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScamReportWallComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ScamReportWallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
