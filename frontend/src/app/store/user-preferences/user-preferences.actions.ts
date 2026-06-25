import { createAction, props } from '@ngrx/store';

export const setTheme = createAction('[Preferences] Set Theme', props<{ theme: 'light' | 'dark' }>());
export const setLanguage = createAction('[Preferences] Set Language', props<{ language: string }>());
export const setHasSeenInstallPrompt = createAction('[Preferences] Set Has Seen Install Prompt', props<{ hasSeen: boolean }>());
