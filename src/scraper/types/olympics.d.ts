export type GamesKey = GamesKeyLookup['key'];

export interface GamesKeyLookup {
	key: string;
	year: number;
	season: OlympicsSeason;
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
