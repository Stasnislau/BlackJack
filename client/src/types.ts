export interface CardDTO {
  isRevealed: boolean;
  rank: Rank;
  suit: Suit;
}

export interface PlayerDTO {
  name: string;
  hand: CardDTO[];
  money: number | null;
  isAI: boolean;
  isCroupier: boolean;
  score: number;
  id: string;
  bet: number;
  hasFinishedTurn: boolean;
  isBlackjack: boolean;
}

export interface GameState {
  currentPlayerId: string;
  isGameOver: boolean;
  isGamePaused: boolean;
  players: PlayerDTO[];
  results: Record<string, string>;
}

enum Rank {
  hidden = 0,
  two = 2,
  three = 3,
  four = 4,
  five = 5,
  six = 6,
  seven = 7,
  eight = 8,
  nine = 9,
  ten = 10,
  jack = 10,
  queen = 10,
  king = 10,
  ace = 11,
}

enum Suit {
  clubs = 0,
  diamonds = 1,
  hearts = 2,
  spades = 3,
}

export interface CreateResponse {
  task: string;
  sessionId: string;
  message: string;
}