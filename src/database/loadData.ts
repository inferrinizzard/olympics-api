import { db, pgp } from '../db.js';

import { readFileSync } from 'fs';
import type {
	CountryAttendanceRow,
	CountryDetailRow,
	CountryMedalRow,
	GamesDetailRow,
	MedalTotalsRow,
	SportDetailRow,
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

	const medalTotals = loadFile('./json/medalTotals.json') as MedalTotalsRow[];
	const countryAttendance = loadFile('./json/countryAttendance.json') as CountryAttendanceRow[];
	const countryMedals = loadFile('./json/countryMedals.json') as CountryMedalRow[];

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

	insertData('medal_totals', medalTotals).catch(console.error);
	insertData('country_attendance', countryAttendance).catch(console.error);
	insertData('country_medals', countryMedals);
};
