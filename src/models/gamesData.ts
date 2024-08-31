export type GamesId = GamesDetailRow['code'];

type PartialGamesList = {
  code: string;
  year: number;
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
