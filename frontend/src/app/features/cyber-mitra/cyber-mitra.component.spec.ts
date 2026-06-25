import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyberMitraComponent } from './cyber-mitra.component';

describe('CyberMitraComponent', () => {
  let component: CyberMitraComponent;
  let fixture: ComponentFixture<CyberMitraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CyberMitraComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CyberMitraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
