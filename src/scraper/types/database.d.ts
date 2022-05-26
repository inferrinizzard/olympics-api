export interface GamesDetailRow extends Record<string, string | number> {
	game: string;
	year: number;
	season: string;
	title: string;
	emblem: string;
	host: string;
	numAthletes: number;
	startDate: string;
	endDate: string;
}

export interface CountryDetailRow extends Record<string, string> {
	country: string;
	name: string;
	flag: string;
}

export interface SportDetailRow extends Record<string, string> {
	sport: string;
	name: string;
	icon: string;
}

export interface CountryMedalRow extends Record<string, string | number> {
	game: string;
	country: string;
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

export interface CountryAttendenceRow extends Record<string, string | Record<string, number>> {
	game: string;
	countryAthletes: Record<string, number>;
}

export interface MedalTotalsRow extends Record<string, string | number> {
	country: string;
	season: string;
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}
