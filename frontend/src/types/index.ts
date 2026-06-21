export interface OnboardingConstraints {
  equipment?: string[];
  injuries?: string;
}

export interface OnboardingData {
  ringName: string;
  phone: string;
  age: number;
  height: number;
  weight: number;
  goals: string[];
  promiseWord: string;
  hasCompletedOnboarding: boolean;
  primary_goal: string;
  experience_level: string;
  available_time: number;
  constraints: OnboardingConstraints;
  stance: string;
  trigger: string;
  intensity: number;
  frequency: number;
}

export interface Drill {
  name: string;
  instruction: string;
  focus?: string;
  type: 'timer' | 'reps';
  reps?: string;
  duration?: number;
  sets?: number;
  isPlanner?: boolean;
  impact?: string;
}

export interface Workout {
  title: string;
  focus: string;
  drills: Drill[];
}

export interface Technique {
  id: string;
  name: string;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  category: 'stance' | 'punch' | 'kick' | 'defense' | 'footwork' | string;
  description: string;
  steps: string[];
  tips: string[];
  mediaUrl?: string;
  masteryScore?: number;
}

export interface StreakData {
  currentStreak: number;
  lastCompletedDate: string | null;
}

export interface LeaderboardEntry {
  name: string;
  score: number;
  display_val: string;
  last_updated: string;
  rank?: number;
}
