import { createAction, props, createReducer, on, createFeatureSelector, createSelector } from '@ngrx/store';

export interface LocationState {
  userStateId: string | null;
  userCityId: string | null;
  hasOnboarded: boolean;
}

export const initialLocationState: LocationState = {
  userStateId: localStorage.getItem('safeclick_user_state') || null,
  userCityId: localStorage.getItem('safeclick_user_city') || null,
  hasOnboarded: localStorage.getItem('safeclick_location_onboarded') === 'true'
};

// Actions
export const setLocation = createAction(
  '[Location] Set Location',
  props<{ stateId: string; cityId?: string }>()
);

export const clearLocation = createAction('[Location] Clear Location');

export const completeOnboarding = createAction('[Location] Complete Onboarding');

// Reducer
export const locationReducer = createReducer(
  initialLocationState,
  on(setLocation, (state, { stateId, cityId }) => {
    localStorage.setItem('safeclick_user_state', stateId);
    if (cityId) {
      localStorage.setItem('safeclick_user_city', cityId);
    } else {
      localStorage.removeItem('safeclick_user_city');
    }
    localStorage.setItem('safeclick_location_onboarded', 'true');
    return { ...state, userStateId: stateId, userCityId: cityId || null, hasOnboarded: true };
  }),
  on(clearLocation, (state) => {
    localStorage.removeItem('safeclick_user_state');
    localStorage.removeItem('safeclick_user_city');
    return { ...state, userStateId: null, userCityId: null };
  }),
  on(completeOnboarding, (state) => {
    localStorage.setItem('safeclick_location_onboarded', 'true');
    return { ...state, hasOnboarded: true };
  })
);

// Selectors
export const selectLocationFeature = createFeatureSelector<LocationState>('location');

export const selectUserStateId = createSelector(
  selectLocationFeature,
  (state) => state.userStateId
);

export const selectUserCityId = createSelector(
  selectLocationFeature,
  (state) => state.userCityId
);

export const selectHasOnboarded = createSelector(
  selectLocationFeature,
  (state) => state.hasOnboarded
);

export const selectUserLocation = createSelector(
  selectLocationFeature,
  (state) => ({ stateId: state.userStateId, cityId: state.userCityId })
);
