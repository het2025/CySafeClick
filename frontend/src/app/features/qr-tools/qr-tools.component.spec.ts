import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QrToolsComponent } from './qr-tools.component';

describe('QrToolsComponent', () => {
  let component: QrToolsComponent;
  let fixture: ComponentFixture<QrToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QrToolsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QrToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
