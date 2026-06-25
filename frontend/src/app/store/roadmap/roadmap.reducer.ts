import { createReducer, on } from '@ngrx/store';
import { initialRoadmapState } from './roadmap.state';
import * as RoadmapActions from './roadmap.actions';

export const roadmapReducer = createReducer(
  initialRoadmapState,
  on(RoadmapActions.completeDay, (state, { day, dateStr }) => {
    if (state.completedDays.includes(day)) return state;
    
    let newStreak = state.streak;
    let newBadges = [...state.badges];
    
    if (state.lastCompletedDate) {
      const lastDate = new Date(state.lastCompletedDate);
      const currDate = new Date(dateStr);
      // Remove time components for pure day diff
      lastDate.setHours(0,0,0,0);
      currDate.setHours(0,0,0,0);
      
      const diffTime = Math.abs(currDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        newStreak++;
      } else if (diffDays > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    if (day === 1 && !newBadges.includes('First Step')) newBadges.push('First Step');
    if (newStreak >= 7 && !newBadges.includes('Week Warrior')) newBadges.push('Week Warrior');
    if (newStreak >= 15 && !newBadges.includes('Halfway Hero')) newBadges.push('Halfway Hero');
    if (state.completedDays.length === 29 && !newBadges.includes('SafeClick Shield')) newBadges.push('SafeClick Shield');

    return {
      ...state,
      completedDays: [...state.completedDays, day],
      streak: newStreak,
      lastCompletedDate: dateStr,
      totalScore: state.totalScore + 10,
      badges: newBadges,
      currentDay: Math.min(30, state.currentDay + 1)
    };
  }),
  on(RoadmapActions.resetRoadmap, () => initialRoadmapState)
);
