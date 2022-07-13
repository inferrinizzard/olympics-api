import type { GamesId } from './gamesData';

export type SportId = SportDetailRow['sport'];

export interface SportDetailRow extends Record<string, string> {
	sport: string;
	name: string;
	icon: string;
}

export interface SportsEventRow extends Record<string, string | Partial<SportsEventWinners>> {
	game: GamesId;
	sport: SportId;
	events: Partial<SportsEventWinners>;
}

interface SportsEventWinners extends Record<string, string[]> {
	gold: string[];
	silver: string[];
	bronze: string[];
}

export type SportsIconMap = Record<SportId, SportDetailRow['icon']>;
