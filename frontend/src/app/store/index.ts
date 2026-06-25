import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { roadmapReducer } from './roadmap/roadmap.reducer';
import { RoadmapState } from './roadmap/roadmap.state';
import { safetyScoreReducer } from './safety-score/safety-score.reducer';
import { SafetyScoreState } from './safety-score/safety-score.state';
import { userPreferencesReducer } from './user-preferences/user-preferences.reducer';
import { UserPreferencesState } from './user-preferences/user-preferences.state';
import { notificationReducer, NotificationState } from './notification.store';
import { digestReducer, DigestState } from './digest.store';
import { locationReducer, LocationState } from './location.store';

export interface AppState {
  roadmap: RoadmapState;
  safetyScore: SafetyScoreState;
  userPreferences: UserPreferencesState;
  notification: NotificationState;
  digest: DigestState;
  location: LocationState;
}

export const reducers: ActionReducerMap<AppState> = {
  roadmap: roadmapReducer,
  safetyScore: safetyScoreReducer,
  userPreferences: userPreferencesReducer,
  notification: notificationReducer,
  digest: digestReducer,
  location: locationReducer
};

export const metaReducers: MetaReducer<AppState>[] = [];
