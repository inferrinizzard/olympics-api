export type GamesId = GamesDetailRow['game'];

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

export type GamesEmblemMap = Record<GamesId, GamesDetailRow['emblem']>;
