import got from 'got';
import { JSDOM } from 'jsdom';
import { readFileSync } from 'fs';

import { DataTable } from '../../dataTable.js';

const baseUrl = 'https://olympics.com/en/olympic-games/';
const startUrl = baseUrl + 'olympic-results';

const get = (url: string) => got.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

const chunk = (arr: any[], size: number) =>
	new Array(Math.ceil(arr.length / size))
		.fill(0)
		.map((_, i) => arr.slice(i * size, (i + 1) * size));

interface EventWinnersRow {
	game: string;
	sport: string;
	code: string;
	event: string;
	gold?: string[];
	silver?: string[];
	bronze?: string[];
}

class OlympicsCom {
	games: string[] = [];
	gamesSports: Record<string, string[]> = {};

	gamesEventWinners: DataTable<EventWinnersRow> = new DataTable();

	private sportsCodeJson: { code: string; name: string }[] = JSON.parse(
		readFileSync('src/olympics-com/sportCodes.json', 'utf8')
	);

	async init() {
		await this.getGamesList();
		await this.getEvents();

		// console.time('get events');
		for (let [game, sports] of Object.entries(this.gamesSports)) {
			for (let sportChunk of chunk(sports, 10)) {
				await sleep(500);
				await Promise.all(sportChunk.map(sport => this.getEventsResults(game, sport))).then(
					chunkResults =>
						chunkResults.forEach(results => this.gamesEventWinners.insertRows(results))
				);
			}
		}
		// console.timeEnd('get events');
	}

	private async getGamesList() {
		const startBody = await get(startUrl).then(page => page.body);
		const startDom = new JSDOM(startBody);
		const games = new Set(
			[...startDom.window.document.querySelectorAll('button[data-cy]')].map(
				el => el.getAttribute('data-cy')!
			)
		);

		this.games = [...games];
	}

	private async getEvents() {
		const eventsBaseUrl = 'https://olympics.com/en/olympic-games/seo/disciplines/'; // base url for finding sports for each game, uses seo endpoint

		// collect all http requests for all games
		const resultsPages = await Promise.all(
			this.games.map(game => get(eventsBaseUrl + game).then(page => [game, page.body]))
		);

		resultsPages.forEach(([game, body]) => {
			const document = new JSDOM(body).window.document;

			// get all sports for this game
			const presentSportsElements = document
				.querySelector('section[data-cy=disciplines-list]')!
				.querySelectorAll('a[data-cy=disciplines-item]');

			// format into url-friendly slug format
			const presentSports = [...presentSportsElements]
				.map(el => el.textContent!)
				.map(sport => sport.toLowerCase().replace(/[/]|\s/g, '-'));

			this.gamesSports[game] = presentSports;
		});
	}

	private async getEventsResults(game: string, sport: string) {
		const url = `${baseUrl}${game}/results/${sport}`;

		const body = await get(url).then(page => page.body);
		const document = new JSDOM(body).window.document;

		const resultRows = document.querySelectorAll('section.event-row[data-row-id^=award-row]');
		return [...resultRows].map(row => {
			const eventName = row.querySelector('h2')!.textContent!;

			const teamAward = row.querySelectorAll('div[data-cy=team-award-card]'); // check if is team sport
			const medalTypes: string[] = [...row.querySelectorAll('span[data-cy=medal-additional]')].map(
				medal => medal.textContent!.toLowerCase()
			);
			let winners: string[] = [];
			if (teamAward.length > 0) {
				// if team sport, get country winners from team award card
				winners = [...teamAward].map(
					div =>
						div
							.querySelector('picture[data-cy=picture-wrapper]')! // div[data-cy=<countryCode>] directly follows picture
							.nextElementSibling!.getAttribute('data-cy')!
				);
			} else {
				const winnerDivs = [...row.querySelectorAll('div[data-cy=flag-with-label]')];
				winners = winnerDivs.map(
					div => div.querySelector('span[data-cy]')!.getAttribute('data-cy')! // span[data-cy=<countryCode>]
				);
			}

			return {
				game,
				sport,
				code: this.sportsCodeJson.find(s =>
					new RegExp(`^${sport}$|${sport}\sSport|${sport.replace('-', 's')}`, 'i').test(
						s.name.replace('-', 's')
					)
				)?.code,
				event: eventName,
				...medalTypes.reduce(
					(acc, medal, i) => ({ ...acc, [medal]: (acc[medal] ?? []).concat([winners[i]]) }),
					{} as Record<string, string[]>
				),
			};
		});
	}
}

export default OlympicsCom;
