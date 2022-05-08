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
	GamesKey,
} from '../models/olympics.js';
import { DataTable } from '../dataTable.js';

import Wikipedia, {
	extractTable,
	readCountryTable,
	readEventWinners,
	readMedalsTable,
	readSportsTable,
} from './wikipedia/index.js';
import OlympicsCom from './olympics-com/index.js';

const summerCountriesUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_participating_nations_at_the_Summer_Olympic_Games&prop=text&section=11&formatversion=2';
const winterCountriesUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=List_of_participating_nations_at_the_Winter_Olympic_Games&prop=text&section=9&formatversion=2';
const medalsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=All-time_Olympic_Games_medal_table&prop=text&section=1&formatversion=2';
const summerSportsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Olympic_sports&prop=text&section=6&formatversion=2';
const winterSportsUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Olympic_sports&prop=text&section=10&formatversion=2';

export class Olympics {
	private htmlTables: Partial<{
		summer: string;
		winter: string;
		medals: string;
		summerSports: string;
		winterSports: string;
	}> = {};

	private summerCountriesTable!: HTMLTableElement;
	private winterCountriesTable!: HTMLTableElement;
	private medalsTable!: HTMLTableElement;
	private summerSportsTable!: HTMLTableElement;
	private winterSportsTable!: HTMLTableElement;

	private olympicsCom!: OlympicsCom;

	countryDetail: Record<string, CountryDetail> = {};
	countryAttendance: DataTable<CountryAttendanceRow> = new DataTable<CountryAttendanceRow>();

	medalsTotals: DataTable<MedalsTotalRow> = new DataTable<MedalsTotalRow>();

	gamesDetail: Record<string, GameDetail> = {};
	gamesLookup: Record<string, GamesKeyLookup> = {};

	sportsDetail: Record<string, SportDetail> = {};
	sportsEvents: DataTable<SportEventsRow> = new DataTable<SportEventsRow>();

	async init() {
		this.htmlTables = await Promise.all(
			Object.entries({
				summer: summerCountriesUrl,
				winter: winterCountriesUrl,
				medals: medalsUrl,
				summerSports: summerSportsUrl,
				winterSports: winterSportsUrl,
			}).map(([key, url]) => Wikipedia.getPageHtml(url).then(val => [key, val]))
		).then(data =>
			data.reduce(
				(acc, [key, data]) => ({ ...acc, [key as string]: data }),
				{} as typeof this.htmlTables
			)
		);

		this.olympicsCom = new OlympicsCom();
		// const fetchSportEventsPromise = this.olympicsCom.init();

		await this.fetchGamesLookup();
		this.loadCountryData();
		await this.loadGamesData();
		this.loadMedalsData();
		this.loadSportsData(); // load this after events

		// await fetchSportEventsPromise;
		// this.loadEventWinnersData();

		const eventTableJson = JSON.parse(
			readFileSync('src/scraper/olympics-com/gamesEventWinners.json', 'utf8')
		);

		this.sportsEvents.insertRows(eventTableJson);

		return this;
	}

	private loadCountryData() {
		// read DOM from parsed HTML request
		this.summerCountriesTable = extractTable(new JSDOM(this.htmlTables.summer));
		this.winterCountriesTable = extractTable(new JSDOM(this.htmlTables.winter));
		// extract table data
		const summerTableData = Object.entries(readCountryTable(this.summerCountriesTable));
		const winterTableData = Object.entries(readCountryTable(this.winterCountriesTable));

		// add entry for each country
		this.countryDetail = summerTableData
			.concat(winterTableData)
			.map(([code, { name, flag }]) => ({ code, name, flag }))
			.reduce((acc, cur) => ({ ...acc, [cur.code]: cur }), {});

		// insert row for each country x year x season
		Object.entries({
			[OlympicsSeason.SUMMER]: summerTableData,
			[OlympicsSeason.WINTER]: winterTableData,
		}).forEach(([season, tableData]) =>
			tableData.forEach(([code, { name, attended, hosted }]) =>
				this.countryAttendance.insertRows(
					attended.map(year => ({
						name,
						code,
						game: this.getGamesKey(year, season as OlympicsSeason),
						host: hosted.includes(year),
					}))
				)
			)
		);
	}

	private async getGamesDetail(year: number, season: OlympicsSeason): Promise<GameDetail> {
		const attendance = this.countryAttendance.where({ game: this.getGamesKey(year, season) });
		const countries = attendance.distinct(['code']).code.sort();

		// YYYY_Season_Olympics
		const gamesPageUrl = Wikipedia.getPageUrl(
			`${year}_${season[0].toUpperCase() + season.slice(1)}_Olympics`
		);

		const gamesDetailsPromise = Wikipedia.getPageHtml(gamesPageUrl)
			.then(Wikipedia.getInfobox)
			.then(Wikipedia.readGamesInfobox);

		return gamesDetailsPromise.then(gamesDetails => ({
			year,
			season,
			...gamesDetails,
			countries,
		}));
	}

	private async loadGamesData() {
		const gamesDetail = await Promise.all(
			Object.values(this.gamesLookup).map(({ year, season }) => this.getGamesDetail(year, season))
		);

		this.gamesDetail = gamesDetail.reduce(
			(acc, cur) => ({ ...acc, [this.getGamesKey(cur.year, cur.season)]: cur }),
			{}
		);

		// const gamesDetailTable = gamesDetail
		// 	.map(gameRow => {
		// 		const {
		// 			year,
		// 			season,
		// 			title,
		// 			image: emblem,
		// 			host,
		// 			numAthletes: num_athletes,
		// 			start: start_date,
		// 			end: end_date,
		// 			...gameDetails
		// 		} = gameRow;

		// 		return {
		// 			game: this.getGamesKey(gameRow.year, gameRow.season),
		// 			year,
		// 			season,
		// 			title,
		// 			emblem,
		// 			host,
		// 			num_athletes: parseInt((num_athletes ?? 0).toString().replace(',', '')),
		// 			start_date: start_date ?? '',
		// 			end_date: end_date ?? '',
		// 		};
		// 	})
		// 	.filter(gameRow => gameRow.game);

		// const columnSet = new pgp.helpers.ColumnSet(Object.keys(gamesDetailTable[0]), {
		// 	table: new pgp.helpers.TableName({ schema: 'public', table: 'games_detail' }),
		// });

		// const query = pgp.helpers.insert(gamesDetailTable, columnSet);

		// // console.log(columnSet);

		// db.none(query)
		// 	.then(() => console.log('games_detail loaded'))
		// 	.catch(console.error);
	}

	private loadMedalsData() {
		this.medalsTable = extractTable(new JSDOM(this.htmlTables.medals));
		const medalsData = Object.entries(readMedalsTable(this.medalsTable));

		// insert row for each country x season
		medalsData.forEach(([code, medals]) =>
			Object.entries(medals).forEach(([season, { gold, silver, bronze, total }]) =>
				this.medalsTotals.insertRows([
					{
						country: code,
						season: season as OlympicsSeason | 'total',
						gold,
						silver,
						bronze,
						total,
					},
				])
			)
		);
	}

	private loadSportsData() {
		// read DOM from parsed HTML request
		this.summerSportsTable = extractTable(new JSDOM(this.htmlTables.summerSports));
		this.winterSportsTable = extractTable(new JSDOM(this.htmlTables.winterSports));
		// extract table data
		const summerSportsData = Object.entries(readSportsTable('summer', this.summerSportsTable));
		const winterSportsData = Object.entries(readSportsTable('winter', this.winterSportsTable));

		// add entry for each sport
		this.sportsDetail = summerSportsData
			.concat(winterSportsData)
			.map(([code, { name, icon }]) => ({ code, name, icon }))
			.reduce((acc, cur) => ({ ...acc, [cur.code]: cur }), {});
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

	private loadEventWinnersData() {
		const eventWinners = this.olympicsCom.gamesEventWinners;
	}
}
