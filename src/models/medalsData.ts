import type { CountryId } from './countryData';
import type { GamesId } from './gamesData';

export interface Medals extends Record<string, string | number> {
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

export type MedalColumn = keyof Medals;
export interface MedalTotalsRow extends Medals {
	country: CountryId;
	season: string;
}

export interface CountryMedalRow extends Medals {
	game: GamesId;
	country: CountryId;
}

export type CountryMedalsMap = Record<CountryId, Record<MedalColumn, number>>;
