import gamesDetail from '@/json/final/gamesDetail.json';

interface GamesCodeParams {
  year: string;
  season: string; // 'summer' | 'winter';
  edition: string; // 'olympics' | 'paralympics' | 'youth';
}

export const findGamesCode = ({ year, season, edition }: GamesCodeParams) =>
  gamesDetail.find(
    (games) =>
      games.year === year.trim() &&
      games.season === season.trim() &&
      games.edition === edition.trim()
  );
