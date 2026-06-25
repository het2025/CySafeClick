import { createAction, props } from '@ngrx/store';

export const saveScore = createAction('[Safety Score] Save Score', props<{ score: number, dateStr: string }>());
export const clearScoreHistory = createAction('[Safety Score] Clear History');
