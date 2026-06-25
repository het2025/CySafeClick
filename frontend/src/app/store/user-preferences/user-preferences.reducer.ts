import { createReducer, on } from '@ngrx/store';
import { initialUserPreferencesState } from './user-preferences.state';
import * as UserPrefActions from './user-preferences.actions';

export const userPreferencesReducer = createReducer(
  initialUserPreferencesState,
  on(UserPrefActions.setTheme, (state, { theme }) => ({ ...state, theme })),
  on(UserPrefActions.setLanguage, (state, { language }) => ({ ...state, language })),
  on(UserPrefActions.setHasSeenInstallPrompt, (state, { hasSeen }) => ({ ...state, hasSeenInstallPrompt: hasSeen }))
);
