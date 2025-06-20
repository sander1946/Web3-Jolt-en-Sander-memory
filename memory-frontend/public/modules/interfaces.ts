export interface UserScore {
  username: string;
  score: number;
}

export type playerScores = UserScore[];

export interface PlayerToken {
  token: string;
}

export interface DateInfo {
  date: string;             // e.g. "2025-06-20 10:59:06.000000"
  timezone_type: number;    // e.g. 3
  timezone: string;         // e.g. "UTC"
}

export interface Game {
  date: DateInfo;
  day: string;              // e.g. "2025-06-20"
  score: number;
  api: string;
  color_closed: string;
  color_found: string;
}

export interface playerData {
  id: number;
  name: string;
  email: string;
  games: Game[];
}

export type playerGames = Game[];

export interface playerPreferences {
  preferred_api: string;      // e.g., "dogs"
  color_closed: string;       // e.g., "#0ff"
  color_found: string;        // e.g., "#ff0"
}

export interface adminTotalGames {
  aantal_spellen: number;
}

export interface adminTotalPlayers {
  aantal_spelers: number;
}

export interface adminApiCount {
  api: string;
  aantal: number;
}

export type adminAggregate = [
  adminTotalGames, 
  adminTotalPlayers,
  adminApiCount[]
];

export interface adminPlayer {
  username: string;
  email: string;
}

export interface adminDateMap {
  [date: string]: number;
}