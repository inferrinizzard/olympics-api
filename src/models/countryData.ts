import type { GamesId } from './gamesData';

export type CountryId = CountryDetailRow['code'];

type Country = {
  code: string;
  name: string;
  status: string;
  pageName: string;
};

export interface PartialCountry extends Country {
  imageUrl: string;
}

export type CountryDetailRow = Country;

export type CountryFlagMap = Record<CountryId, string>;

export type CountryAthletes = Record<CountryId, number>;

export interface CountryAttendanceRow {
  game: GamesId;
  countryAthletes: CountryAthletes;
}
