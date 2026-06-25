import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WeeklyDigestService, WeeklyDigest } from '../features/weekly-digest/weekly-digest.service';
import { map, catchError, switchMap, of } from 'rxjs';

export interface DigestState {
  allDigests: WeeklyDigest[];
  selectedWeekId: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialDigestState: DigestState = {
  allDigests: [],
  selectedWeekId: null,
  isLoading: false,
  error: null
};

// Actions
export const loadDigests = createAction('[Digest] Load Digests');
export const loadDigestsSuccess = createAction(
  '[Digest] Load Digests Success',
  props<{ digests: WeeklyDigest[] }>()
);
export const loadDigestsFailure = createAction(
  '[Digest] Load Digests Failure',
  props<{ error: string }>()
);
export const selectWeek = createAction(
  '[Digest] Select Week',
  props<{ weekId: string }>()
);

// Reducer
export const digestReducer = createReducer(
  initialDigestState,
  on(loadDigests, (state) => ({ ...state, isLoading: true, error: null })),
  on(loadDigestsSuccess, (state, { digests }) => ({
    ...state,
    isLoading: false,
    allDigests: digests,
    selectedWeekId: state.selectedWeekId || (digests.length > 0 ? digests[0].weekId : null)
  })),
  on(loadDigestsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),
  on(selectWeek, (state, { weekId }) => ({ ...state, selectedWeekId: weekId }))
);

// Selectors
export const selectDigestFeature = createFeatureSelector<DigestState>('digest');

export const selectAllDigests = createSelector(
  selectDigestFeature,
  (state) => state.allDigests
);

export const selectIsLoading = createSelector(
  selectDigestFeature,
  (state) => state.isLoading
);

export const selectLatestDigest = createSelector(
  selectAllDigests,
  (digests) => digests.length > 0 ? digests[0] : null
);

export const selectSelectedWeekId = createSelector(
  selectDigestFeature,
  (state) => state.selectedWeekId
);

export const selectDigestByWeekId = createSelector(
  selectAllDigests,
  selectSelectedWeekId,
  (digests, weekId) => {
    if (!weekId && digests.length > 0) return digests[0];
    return digests.find(d => d.weekId === weekId) || null;
  }
);

// Effects
@Injectable()
export class DigestEffects {
  loadDigests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDigests),
      switchMap(() =>
        this.digestService.loadAllDigests().pipe(
          map(digests => loadDigestsSuccess({ digests })),
          catchError(error => of(loadDigestsFailure({ error: error.message })))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private digestService: WeeklyDigestService
  ) {}
}
