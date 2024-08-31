import type { GamesId } from './gamesData';

import type SportsList from '../../json/sportsDetail2.json';

export type SportId = SportDetailRow['code'];

type BaseSport = {
  code: (typeof SportsList)[number]['code'];
  name: string;
};

interface SportDiscipline extends BaseSport {
  category: 'discipline';
  parent: string;
  status: string;
  season?: string;
}

interface SportParentSport extends BaseSport {
  category: 'sport';
  status: string;
  season?: string;
}

interface SportGeneral extends BaseSport {
  category: 'general';
}

type Sport = SportDiscipline | SportParentSport | SportGeneral;

export type SportDetailRow = Sport;

export interface SportsEventRow
  extends Record<string, string | Partial<SportsEventWinners>> {
  game: GamesId;
  sport: SportId;
  events: Partial<SportsEventWinners>;
}

interface SportsEventWinners extends Record<string, string[]> {
  gold: string[];
  silver: string[];
  bronze: string[];
}

export type SportsIconMap = Record<SportId, string>;
