import { createReducer, on } from '@ngrx/store';
import { initialSafetyScoreState } from './safety-score.state';
import * as SafetyScoreActions from './safety-score.actions';

export const safetyScoreReducer = createReducer(
  initialSafetyScoreState,
  on(SafetyScoreActions.saveScore, (state, { score, dateStr }) => ({
    ...state,
    latestScore: score,
    history: [...state.history, { date: dateStr, score }]
  })),
  on(SafetyScoreActions.clearScoreHistory, () => initialSafetyScoreState)
);
