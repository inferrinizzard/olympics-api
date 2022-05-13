import { JSDOM } from 'jsdom';

import Wikipedia from './index.js';

import { GamesKeyLookup } from '../../models/olympics.js';
import type { GamesDetailRow } from '../types/database.js';

const getInfobox = (html: string) => {
	const dom = new JSDOM(html);
	const infobox = dom.window.document.querySelector('table.infobox');
	return infobox as HTMLTableElement;
};

type GamesInfoboxData = Omit<GamesDetailRow, 'game' | 'year' | 'season'>;

const readGamesInfobox = (infobox: HTMLTableElement): GamesInfoboxData => {
	const title = infobox.querySelector('caption')?.textContent ?? '';
	const image = infobox
		.querySelector('img')
		?.getAttribute('src')
		?.replace(/^[/]{2}/, 'https://');

	let gamesData = { title, image };
	const infoKeys = {
		host: { key: 'host', pattern: '.*' },
		athletes: { key: 'numAthletes', pattern: '^([0-9]|(?:,))+' },
		opening: { key: 'start', pattern: /[0-9]+\s[A-z]+(\s[0-9]{4})?/ },
		closing: { key: 'end', pattern: /[0-9]+\s[A-z]+(\s[0-9]{4})?/ },
	};
	for (let i = 1; i < infobox.rows.length; i++) {
		const row = infobox.rows[i];

		const key = row.cells[0].textContent!.toLowerCase();
		const value = row.cells[1]?.textContent;
		Object.entries(infoKeys).forEach(([searchKey, { key: dataKey, pattern }]) => {
			if (key.includes(searchKey)) {
				const match = value?.match(pattern);
				if (!match) return;
				gamesData = { ...gamesData, [dataKey]: match[0] };
			}
		});
	}

	return gamesData as GamesInfoboxData;
};

export const readGamesDetail = async (gamesLookup: Record<string, GamesKeyLookup>) => {
	return await Promise.all(
		Object.entries(gamesLookup)
			.map(([key, { key: val }]) => [JSON.parse(key), val])
			.map(([[year, season], gamesKey]) => {
				// YYYY_Season_Olympics
				const gamesPageUrl = Wikipedia.getPageUrl(
					`${year}_${season[0].toUpperCase() + season.slice(1)}_Olympics`
				);

				const gamesDetailsPromise = Wikipedia.getPageHtml(gamesPageUrl)
					.then(getInfobox)
					.then(readGamesInfobox);

				return gamesDetailsPromise.then(
					gamesDetails =>
						({
							game: gamesKey,
							year,
							season,
							...gamesDetails,
						} as GamesDetailRow)
				);
			})
	);
};
