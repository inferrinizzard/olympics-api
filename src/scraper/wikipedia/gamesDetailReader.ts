import { JSDOM } from 'jsdom';

import Wikipedia from './index.js';

import type { GamesKeyLookup, GamesDetailRow } from '../types';

const getInfobox = (html: string) => {
	const dom = new JSDOM(html);
	const infobox = dom.window.document.querySelector('table.infobox');
	return infobox as HTMLTableElement;
};

type GamesInfoboxData = Omit<GamesDetailRow, 'game' | 'year' | 'season'>;

const readGamesInfobox = (infobox: HTMLTableElement): GamesInfoboxData => {
	const title = infobox.querySelector('caption')?.textContent ?? '';
	const image =
		infobox
			.querySelector('img')
			?.getAttribute('src')
			?.replace(/^[/]{2}/, 'https://') ?? '';

	let gamesData = { title, image };
	const infoKeys = {
		host: { key: 'host', pattern: '.*' },
		athletes: { key: 'numAthletes', pattern: '^([0-9]|(?:,))+' },
		opening: { key: 'startDate', pattern: /[0-9]+\s[A-z]+(\s[0-9]{4})?/ },
		closing: { key: 'endDate', pattern: /[0-9]+\s[A-z]+(\s[0-9]{4})?/ },
	};
	for (let i = 1; i < infobox.rows.length; i++) {
		const row = infobox.rows[i];

		const key = row.cells[0].textContent!.toLowerCase();
		const value = row.cells[1]?.textContent;
		Object.entries(infoKeys).forEach(([searchKey, { key: dataKey, pattern }]) => {
			if (key.includes(searchKey)) {
				const match = value?.match(pattern);
				gamesData = { ...gamesData, [dataKey]: match?.[0] ?? '' };
			}
		});
	}

	Object.values(infoKeys).forEach(({ key: dataKey }) => {
		if (!(dataKey in gamesData)) gamesData = { ...gamesData, [dataKey]: '' };
	});

	return gamesData as GamesInfoboxData;
};

export const readGamesDetail = async (gamesLookup: Record<string, GamesKeyLookup>) => {
	if (Object.keys(gamesLookup).length === 0) {
		throw new Error('No games found');
	}
	return await Promise.all(
		Object.entries(gamesLookup)
			.map(
				([key, { key: val }]) =>
					[key.replace(/[\[\]]/g, '').split(','), val] as [[string, string], string] // split '[year,season]' into year & season
			)
			.map(async ([[year, season], gamesKey]) => {
				// YYYY_Season_Olympics
				const gamesPageUrl = Wikipedia.getPageUrl(
					`${year}_${season[0].toUpperCase() + season.slice(1)}_Olympics`
				);

				const { numAthletes, ...gamesDetails } = await Wikipedia.getPageHtml(gamesPageUrl)
					.then(getInfobox)
					.then(readGamesInfobox);

				return {
					game: gamesKey || year + '-' + season,
					year: parseInt(year),
					season,
					numAthletes: parseInt((numAthletes as string)?.replace(/,/g, '') ?? '-1'),
					...gamesDetails,
				} as GamesDetailRow;
			})
	);
};
