import { createAction, props } from '@ngrx/store';

export const completeDay = createAction('[Roadmap] Complete Day', props<{ day: number, dateStr: string }>());
export const resetRoadmap = createAction('[Roadmap] Reset');
