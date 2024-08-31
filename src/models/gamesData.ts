export type GamesId = GamesDetailRow['code'];

export type PartialGamesList = {
  code: string;
  year: number | string;
  host: string;
  season: string;
  edition: string;
  pageName: string;
};

export interface GamesDetailRow extends PartialGamesList {
  title: string;
  numAthletes: number;
  startDate: string;
  endDate: string;
}

export type GamesEmblemMap = Record<GamesId, string>;
