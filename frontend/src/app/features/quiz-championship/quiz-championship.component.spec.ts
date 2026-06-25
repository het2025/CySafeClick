import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizChampionshipComponent } from './quiz-championship.component';

describe('QuizChampionshipComponent', () => {
  let component: QuizChampionshipComponent;
  let fixture: ComponentFixture<QuizChampionshipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizChampionshipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizChampionshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
