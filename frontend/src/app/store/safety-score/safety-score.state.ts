export interface SafetyScoreState {
  latestScore: number | null;
  history: { date: string, score: number }[];
}

export const initialSafetyScoreState: SafetyScoreState = {
  latestScore: null,
  history: []
};
