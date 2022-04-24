import { JSDOM } from 'jsdom';

import {
	CountryAttendanceRow,
	CountryDetail,
	MedalsTotalRow,
	OlympicsSeason,
	SportDetail,
	SportEventsRow,
	GameDetail,
} from './models/olympics.js';
import { DataTable } from './dataTable.js';

import Wikipedia, {
	extractTable,
	readCountryTable,
	readEventWinners,
	readMedalsTable,
	readSportsTable,
} from './wikipedia/index.js';

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

	countryDetail: Record<string, CountryDetail> = {};
	countryAttendance: DataTable<CountryAttendanceRow> = new DataTable<CountryAttendanceRow>();

	medalsTotals: DataTable<MedalsTotalRow> = new DataTable<MedalsTotalRow>();

	gamesDetail: Record<string, GameDetail> = {};

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

		this.loadCountryData();
		await this.loadGamesData();
		this.loadMedalsData();
		this.loadSportsData();
		await this.loadEventWinnersData();

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
				attended.forEach(year =>
					this.countryAttendance.insert({
						name,
						code,
						year,
						season: season as OlympicsSeason,
						host: hosted.includes(year),
					})
				)
			)
		);
	}

	async getGamesDetail(year: number, season: OlympicsSeason): Promise<GameDetail> {
		const attendance = this.countryAttendance.where({ year, season });
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
		const rawYearSeason = this.countryAttendance.select(['year', 'season']);
		const gamesList = [
			...new Set(rawYearSeason.year.map((year, i) => [year, rawYearSeason.season[i]].toString())),
		];

		const gamesDetail = await Promise.all(
			gamesList
				.map(game => game.split(','))
				.map(([year, season]) => this.getGamesDetail(parseInt(year), season as OlympicsSeason))
		);
		this.gamesDetail = gamesDetail.reduce(
			(acc, cur) => ({ ...acc, [[cur.year, cur.season].toString()]: cur }),
			{}
		);
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

	async loadEventWinnersData() {
		const year = 2020;
		const season: OlympicsSeason = OlympicsSeason.SUMMER;

		let promise;
		try {
			const gamesPageUrl = Wikipedia.getPageUrl(
				`List_of_${year}_${season[0].toUpperCase() + season.slice(1)}_Olympics_medal_winners`
			);
			promise = await Wikipedia.getPageHtml(gamesPageUrl);
		} catch {
			return;
		}

		const dom = new JSDOM(promise);

		let sportsLookup: Record<string, string> = {};
		let countryLookup: Record<string, string> = {};
		const eventTableData = readEventWinners(dom.window.document);
		const eventData = eventTableData.map(event => {
			// find sportCode from sportsDetail
			let lookupKey = event.sport + event.discipline;
			let sport = '';
			if (lookupKey in sportsLookup) {
				sport = sportsLookup[lookupKey];
			} else {
				try {
					sport = Object.values(this.sportsDetail).find(
						sport =>
							new RegExp(event.discipline, 'i').test(sport.name) ||
							new RegExp(event.discipline.split(' ')[0], 'i').test(sport.name) ||
							new RegExp(event.sport, 'i').test(sport.name)
					)!.code;
				} catch {
					console.log(event.discipline, event.sport);
				}
				sportsLookup[lookupKey] = sport;
			}

			// find countryCode from countryDetail
			const winners = Object.entries({
				gold: event.gold,
				silver: event.silver,
				bronze: event.bronze,
			}).reduce(
				(acc, [medal, countries]) => ({
					...acc,
					[medal]: countries.map(country => {
						if (country in countryLookup) {
							return countryLookup[country];
						} else {
							const countryCode = Object.values(this.countryDetail).find(detail =>
								new RegExp(country, 'i').test(detail.name)
							)!.code;
							countryLookup[country] = countryCode;
							return countryCode;
						}
					}),
				}),
				{} as Pick<SportEventsRow, 'gold' | 'silver' | 'bronze'>
			);

			return {
				sport,
				event: event.event,
				year,
				season,
				sex: event.sex,
				gold: winners.gold.length === 1 ? winners.gold[0] : winners.gold,
				silver: winners.silver.length === 1 ? winners.silver[0] : winners.silver,
				bronze: winners.bronze.length === 1 ? winners.bronze[0] : winners.bronze,
			};
		});

		this.sportsEvents.insertRows(eventData);
	}
}
