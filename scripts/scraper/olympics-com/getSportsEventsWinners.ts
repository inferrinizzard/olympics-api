import { existsSync, writeFileSync } from 'node:fs';

import { delay } from '../utils/delay';
import { getDocument } from '../utils/getDocument';

import resultsLinks from './resultsLinks.json';

let queue: string[] = [];

for (const link of resultsLinks) {
  const document = await getDocument(`${link}/results`);

  if (Number.isInteger(document) || typeof document === 'number') {
    console.log(link, document);
    continue;
  }

  const sports = [
    ...document.querySelectorAll('a[data-cy="disciplines-item"]'),
  ].flatMap((a) => a.getAttribute('href') ?? []);

  queue = queue.concat(sports);

  delay(5000);
}

for (const sportsLink in queue) {
  const [games, sport] = sportsLink.split('/').slice(-3, -1);

  const jsonPath = `./scripts/scraper/olympics-com/eventData/${games}_${sport}.json`;

  if (existsSync(jsonPath)) {
    continue;
  }

  const document = await getDocument(sportsLink);

  if (Number.isInteger(document) || typeof document === 'number') {
    console.log(sportsLink, document);
    continue;
  }

  const sections = [...document.querySelectorAll('section[data-row-id]')];

  const eventsData: Record<string, Record<string, string[]>> = {};

  sections.forEach((section, i) => {
    const cards = [...section.querySelectorAll('div[data-cy^="award-card"]')];

    const eventName = section.querySelector('h2')?.textContent;

    if (!eventName) {
      console.log(i);
      return;
    }

    const eventWinners: Record<string, string[]> = {};

    cards.forEach((card, j) => {
      // document.querySelector('section[data-row-id]').querySelector('div[data-cy^="award-card"]').querySelector('div[data-cy="team-award-card"]').querySelectorAll('div[data-cy]')
      const teamCard = card.querySelector('div[data-cy="team-award-card"]');
      const isTeam = !!teamCard;

      if (isTeam) {
        const [medalEl, winnerEl] = [
          ...teamCard.querySelectorAll('div[data-cy]'),
        ];
        const medal = medalEl.getAttribute('data-medal-id');
        const winner = winnerEl.getAttribute('data-cy');

        if (medal && winner) {
          console.log(j);
          eventWinners[medal] = (eventWinners[medal] ?? []).concat([winner]);
        }
      } else {
        const singleAthleteCard = card.querySelector(
          'div[data-cy="single-athlete-award-card"]'
        );

        if (!singleAthleteCard) {
          return;
        }

        const [medalEl, winnerEl] = [
          ...singleAthleteCard.querySelectorAll('div[data-cy]'),
        ];

        const medal = medalEl.getAttribute('data-medal-id');
        const winner = winnerEl
          .querySelector('span[data-cy]')
          ?.getAttribute('data-cy');

        if (medal && winner) {
          console.log(j);
          eventWinners[medal] = (eventWinners[medal] ?? []).concat([winner]);
        }
      }
    });

    eventsData[eventName] = eventWinners;
  });

  writeFileSync(jsonPath, JSON.stringify(eventsData, null, 2));

  delay(5000);
}
