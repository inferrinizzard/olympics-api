import { JSDOM } from 'jsdom';

import { pgp, db } from '../db.js';

import { readFileSync, writeFileSync } from 'fs';

import {
	CountryAttendanceRow,
	CountryDetail,
	MedalsTotalRow,
	OlympicsSeason,
	SportDetail,
	SportEventsRow,
	GameDetail,
	GamesKeyLookup,
} from '../models/olympics.js';
import Wikipedia from './wikipedia/index.js';

import { DataTable } from '../dataTable.js';

import OlympicsCom from './olympics-com/index.js';

import { readCountryDetail } from './wikipedia/countryDetailReader.js';
import { readCountryMedals } from './wikipedia/countryMedalsReader.js';

export class Olympics {
	private olympicsCom!: OlympicsCom;

	gamesLookup: Record<string, GamesKeyLookup> = {};

	countryDetail: Record<string, CountryDetail> = {};
	gamesDetail: Record<string, GameDetail> = {};
	sportsDetail: Record<string, SportDetail> = {};

	countryAttendance: DataTable<CountryAttendanceRow> = new DataTable<CountryAttendanceRow>();
	medalsTotals: DataTable<MedalsTotalRow> = new DataTable<MedalsTotalRow>();
	sportsEvents: DataTable<SportEventsRow> = new DataTable<SportEventsRow>();

	async init() {
		await this.fetchGamesLookup();
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

	getGamesKey(year: number, season: OlympicsSeason): string {
		return this.gamesLookup[[year, season].toString()].key;
	}
}
