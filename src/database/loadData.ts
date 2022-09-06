import { db, pgp } from '../db.js';

import { readFileSync } from 'fs';
import type {
	CountryAttendanceRow,
	CountryDetailRow,
	CountryMedalRow,
	GamesDetailRow,
	MedalTotalsRow,
	SportDetailRow,
	SportsEventRow,
} from '../scraper/types';

const loadFile = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

const insertData = <Row extends Record<string, any>>(table: string, data: Row[]) =>
	db.none(
		pgp.helpers
			.insert(data, new pgp.helpers.ColumnSet(Object.keys(data[0]), { table }))
			.concat(' ON CONFLICT DO NOTHING')
	);

export const loadData = async () => {
	// check here if the data is already loaded
	const countryDetail = loadFile('./json/countryDetail.json') as CountryDetailRow[];
	const gamesDetail = loadFile('./json/gamesDetail.json') as GamesDetailRow[];
	const sportsDetail = loadFile('./json/sportsDetail.json') as SportDetailRow[];

	// const medalTotals = loadFile('./json/medalTotals.json') as MedalTotalsRow[];
	const countryAthletes = loadFile('./json/countryAthletes.json') as CountryAttendanceRow[];
	// const countryMedals = loadFile('./json/countryMedals.json') as CountryMedalRow[];
	const sportsEvents = loadFile('./json/sportsEvents.json') as SportsEventRow[];

	insertData('country_detail', countryDetail).catch(console.error);
	insertData(
		'games_detail',
		gamesDetail.map(
			({
				numAthletes: num_athletes,
				startDate: start_date,
				endDate: end_date,
				image: emblem,
				...rest
			}) => ({
				...rest,
				emblem,
				num_athletes,
				start_date,
				end_date,
			})
		)
	).catch(console.error);
	insertData('sports_detail', sportsDetail).catch(console.error);

	// insertData('medal_totals', medalTotals).catch(console.error);
	insertData('country_athletes', countryAthletes).catch(console.error);
	// insertData('country_medals', countryMedals).catch(console.error);
	insertData('sports_events', sportsEvents).catch(console.error);
};
