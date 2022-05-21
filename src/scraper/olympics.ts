import { JSDOM } from 'jsdom';

import { pgp, db } from '../db.js';

import { readFileSync, writeFileSync } from 'fs';

import OlympicsCom from './olympics-com/index.js';
import Wikipedia from './wikipedia/index.js';

import type {
	GamesKeyLookup,
	CountryDetailRow,
	GamesDetailRow,
	SportDetailRow,
	CountryMedalRow,
	MedalTotalsRow,
} from './types';

import { readCountryDetail } from './wikipedia/countryDetailReader.js';
import { readGamesDetail } from './wikipedia/gamesDetailReader.js';
import { readSportsDetail } from './wikipedia/sportsDetailReader.js';
import { readCountryAttendance } from './wikipedia/countryAttendanceReader.js';
import { readCountryMedals } from './wikipedia/countryMedalsReader.js';
import { readMedalTotals } from './wikipedia/medalTotalsReader.js';

export class Olympics {
	private olympicsCom!: OlympicsCom;

	gamesLookup: Record<string, GamesKeyLookup> = {};

	countryDetail: CountryDetailRow[] = [];
	gamesDetail: GamesDetailRow[] = [];
	sportsDetail: SportDetailRow[] = [];

	countryAttendance: CountryMedalRow[] = [];
	medalsTotals: MedalTotalsRow[] = [];
	sportsEvents = [];

	async init() {
		await this.fetchGamesLookup();
		this.countryDetail = await readCountryDetail();

		this.gamesDetail = await readGamesDetail(this.gamesLookup);
		this.sportsDetail = await readSportsDetail();

		let countryMedals: Record<string, Partial<CountryMedalRow>[]> = await readCountryMedals(
			this.getCountryCode.bind(this),
			this.getGamesKey.bind(this)
		);
		const countryAttendance = await readCountryAttendance(this.getGamesKey.bind(this));

		this.medalsTotals = await readMedalTotals();

		// writeFileSync('./json/countryDetail.json', JSON.stringify(this.countryDetail, null, 2));
		// writeFileSync('./json/gamesDetail.json', JSON.stringify(this.gamesDetail, null, 2));
		// writeFileSync('./json/sportsDetail.json', JSON.stringify(this.sportsDetail, null, 2));
		// writeFileSync('./json/countryMedals.json', JSON.stringify(countryMedals, null, 2));
		// writeFileSync('./json/countryAttendance.json', JSON.stringify(countryAttendance, null, 2));
		// writeFileSync('./json/medalTotals.json', JSON.stringify(this.medalsTotals, null, 2));

		return this;
	}

	private async fetchGamesLookup() {
		const url =
			'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Template%3AOlympic_Games&prop=text&disabletoc=1&formatversion=2';
		const response = await Wikipedia.getPageHtml(url);

		const document = new JSDOM(response).window.document;

		const gamesElements = [
			...document.querySelectorAll('ul > li > a[href^="/wiki/"][href$="Olympics"]'),
		].filter(el => el.textContent?.match(/^[0-9]{4}/));
		const games = gamesElements.map(el => {
			const text = el.textContent!;
			const year = parseInt(text.slice(0, 4));
			const host = text.slice(4).trim();

			const title = el.getAttribute('title')!;
			const season = title.split(' ')[1].trim().toLowerCase();

			return {
				// text,
				// title,
				year,
				season,
				key:
					text.length > 5
						? host.match(/rio/i) // rio is the only exception to this pattern
							? 'rio-2016'
							: host.replace(/[\s']/g, '-').replace(/\./g, '').toLowerCase() + '-' + year
						: '',
			};
		});

		// [YYYY, season]: {year: YYYY, season: string, key: host-YYYY}
		this.gamesLookup = games.reduce(
			(acc, cur) => ({ ...acc, [[cur.year, cur.season].toString()]: cur }),
			{}
		);
	}

	getGamesKey(year: number, season: string): string {
		return this.gamesLookup[[year, season].toString()].key;
	}

	getCountryCode(countryName: string): string {
		const res = this.countryDetail.find(country =>
			country.name.match(new RegExp(countryName, 'i'))
		);

		// edge cases, TODO: resolve this
		if (!res && countryName.match(/ceylon/i)) return 'SRI';
		if (!res && countryName.match(/fr yugoslavia/i)) return 'YUG';

		return res!.country;
	}
}
