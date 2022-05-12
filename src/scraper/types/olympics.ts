export interface CountryDetailRow extends Record<string, string> {
	country: string;
	name: string;
	flag: string;
}

export interface CountryMedalRow extends Record<string, string | number> {
	game: string;
	country: string;
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}
