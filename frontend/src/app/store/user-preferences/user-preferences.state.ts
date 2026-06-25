export interface UserPreferencesState {
  theme: 'light' | 'dark';
  language: string;
  hasSeenInstallPrompt: boolean;
}

export const initialUserPreferencesState: UserPreferencesState = {
  theme: 'light',
  language: 'en',
  hasSeenInstallPrompt: false
};
