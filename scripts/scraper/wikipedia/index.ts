import { writeFileSync } from 'fs';
import { fetchGamesList } from './fetchGamesList';

const main = async () => {
  console.log('START');

  console.log('GET INITIAL GAMES PAGES');
  const gamesList = await fetchGamesList();
  writeFileSync('./json/gamesList.json', JSON.stringify(gamesList, null, 2));
};

await main();
