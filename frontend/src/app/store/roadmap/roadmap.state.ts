export interface RoadmapState {
  currentDay: number;
  completedDays: number[];
  streak: number;
  lastCompletedDate: string | null;
  totalScore: number;
  badges: string[];
}

export const initialRoadmapState: RoadmapState = {
  currentDay: 1,
  completedDays: [],
  streak: 0,
  lastCompletedDate: null,
  totalScore: 0,
  badges: []
};
