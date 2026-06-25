import { TestBed } from '@angular/core/testing';

import { QuizChampionshipService } from './quiz-championship.service';

describe('QuizChampionshipService', () => {
  let service: QuizChampionshipService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuizChampionshipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
