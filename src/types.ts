export interface Team {
  id: number;
  name: string;
  score: number;
}

export interface ScoreRecord {
  correct: boolean;
  bonus: boolean;
}

export type ChallengeType = 'mcq' | 'matching' | 'ordering';

export interface MCQOption {
  id: string;
  text: string;
}

export interface MatchingSlot {
  id: string;
  title: string;
}

export interface MatchingCard {
  id: string;
  code: string;
  text: string;
}

export interface Challenge {
  id: number;
  title: string;
  prompt: string;
  type: ChallengeType;
  options?: MCQOption[];
  correctAnswer?: string;
  slots?: MatchingSlot[];
  cards?: MatchingCard[];
  correctOrder?: string[];
  explanation: string;
  discussion: string;
  hint: string;
  audioQuestionId: string;
  audioAnswerId: string;
}

export interface DiscourseMessage {
  lock: number;
  badge: string;
  title: string;
  quote: string;
  lesson: string;
  audioScript: string;
  audioId: string;
}

export interface CipherPiece {
  id: number;
  word: string;
  context: string;
}
