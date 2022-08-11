import type { GamesId } from './gamesData';

export type CountryId = CountryDetailRow['country'];

export interface CountryDetailRow extends Record<string, string> {
	country: string;
	name: string;
	flag: string;
}

export type CountryFlagMap = Record<CountryId, CountryDetailRow['flag']>;

export type CountryAthletes = Record<CountryId, number>;

export interface CountryAttendanceRow {
	game: GamesId;
	countryAthletes: CountryAthletes;
}
