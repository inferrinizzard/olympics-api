import { writeFileSync, existsSync } from 'fs';
import { fetchGamesList } from './fetchGamesList';

import gamesList from '../../../json/gamesList.json';
import { readGamesInfoBoxFromPage } from './fetchGamesData';

const GAMES_LIST_JSON_PATH = './json/gamesList.json';
const GAMES_DETAIL_JSON_PATH = './json/gamesDetail2.json';

const main = async () => {
  console.log('START');

  console.log('GET INITIAL GAMES LIST');
  if (existsSync(GAMES_LIST_JSON_PATH) && gamesList.length) {
    console.log('Games List already exists, skipping fetch');
  } else {
    const newGamesList = await fetchGamesList();
    writeFileSync(GAMES_LIST_JSON_PATH, JSON.stringify(newGamesList, null, 2));
  }

  console.log('GET GAMES DETAILS');
  const gamesDetail = await Promise.all(
    gamesList.map(readGamesInfoBoxFromPage)
  );
  writeFileSync(GAMES_DETAIL_JSON_PATH, JSON.stringify(gamesDetail, null, 2));
};

await main();
