export type GamesKey = GamesKeyLookup['key'];

export interface GamesKeyLookup {
	key: string;
	year: number;
	season: OlympicsSeason;
}

export interface GameDetail {
	year: number;
	season: OlympicsSeason;
	title: string;
	image: string;
	host: string;
	numAthletes: number;
	start: string;
	end: string;
	countries: string[];
}

export interface CountryDetail {
	name: string;
	code: string;
	flag: string;
}

export interface CountryAttendanceRow extends Record<string, any> {
	name: string;
	code: string;
	game: GamesKey;
	host: boolean;
}

export interface MedalsDetail {
	[MedalType.GOLD]: number;
	[MedalType.SILVER]: number;
	[MedalType.BRONZE]: number;
	total: number;
}

export enum MedalType {
	GOLD = 'gold',
	SILVER = 'silver',
	BRONZE = 'bronze',
}

export interface MedalsTotalRow extends Record<string, any> {
	country: string;
	season: OlympicsSeason | 'total';
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

export interface SportDetail {
	name: string;
	code: string;
	icon: string;
}

export interface SportEventsRow extends Record<string, any> {
	game: GamesKey;
	sport: string;
	event: string; // event|demonstration
	gold: string | string[];
	silver: string | string[];
	bronze: string | string[];
}

export enum EventSex {
	MEN = 'men',
	WOMEN = 'women',
	MIXED = 'mixed',
}

export enum OlympicsSeason {
	SUMMER = 'summer',
	WINTER = 'winter',
}
