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

export interface MedalTotalsRow extends Record<string, string | number> {
	country: string;
	season: string;
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}
