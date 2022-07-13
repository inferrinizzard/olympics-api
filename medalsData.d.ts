import type { CountryId } from './countryData';
import type { GamesId } from './gamesData';

export interface MedalTotalsRow extends Record<string, string | number> {
	country: CountryId;
	season: string;
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

export interface CountryMedalRow extends Record<string, string | number> {
	game: GamesId;
	country: CountryId;
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}
