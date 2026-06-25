import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeepfakeAwarenessComponent } from './deepfake-awareness.component';

describe('DeepfakeAwarenessComponent', () => {
  let component: DeepfakeAwarenessComponent;
  let fixture: ComponentFixture<DeepfakeAwarenessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeepfakeAwarenessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeepfakeAwarenessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
