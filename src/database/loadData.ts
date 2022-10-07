import { db, pgp } from '../db.js';

import { readFileSync } from 'fs';
import type {
	CountryAttendanceRow,
	CountryDetailRow,
	GamesDetailRow,
	SportDetailRow,
	SportsEventRow,
} from '../scraper/types';

const loadFile = (path: string) => JSON.parse(readFileSync(path, 'utf8'));

const insertData = async <Row extends Record<string, any>>(
	table: string,
	data: Row[],
	force = false
) => {
	if (!force) {
		// check if rows already exist
		const hasRows = await db
			.oneOrNone(`SELECT TRUE FROM ${table} LIMIT 1`)
			.then(res => res?.bool ?? false);
		if (hasRows) {
			console.log(`${table} already has data, skipping`);
			return;
		}
	} else {
		db.none(`TRUNCATE TABLE ${table} CASCADE;`);
	}

	// load data into table
	return db
		.none(
			pgp.helpers
				.insert(data, new pgp.helpers.ColumnSet(Object.keys(data[0]), { table }))
				.concat(' ON CONFLICT DO NOTHING')
		)
		.finally(() => console.log(`Loaded table ${table} with ${data.length} rows`));
};

const refreshView = (view: string) => db.none(`REFRESH MATERIALIZED VIEW ${view};`);

export const loadData = async () => {
	const countryDetail = loadFile('./json/countryDetail.json') as CountryDetailRow[];
	const gamesDetail = loadFile('./json/gamesDetail.json') as GamesDetailRow[];
	const sportsDetail = loadFile('./json/sportsDetail.json') as SportDetailRow[];

	const countryAthletes = loadFile('./json/countryAthletes.json') as CountryAttendanceRow[];
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

	insertData('country_athletes', countryAthletes)
		.catch(console.error)
		.then(() => db.none('REFRESH MATERIALIZED VIEW country_attendance;'));

	insertData('sports_events', sportsEvents)
		.catch(console.error)
		.then(() => {
			refreshView('country_game_medals').then(() => refreshView('country_medal_totals'));
			refreshView('country_sports_medals');
		});
};
