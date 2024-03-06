export interface CardDTO {
  isRevealed: boolean;
  rank: string;
  suit: string;
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
  isGameStarted: boolean;
  players: PlayerDTO[];
  results: Record<string, string>;
}

export interface CreateResponse {
  task: string;
  gameCode: string;
  message: string;
}

export interface GameMessageInterface {
  task: string;
  message: string;
  gameCode: string;
  gameState?: GameState;
  connectionId?: string;
  playerId?: string;
}