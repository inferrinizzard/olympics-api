import { JSDOM } from 'jsdom';

import Wikipedia from './index.js';
import { CountryMedalRow } from '../types/olympics.js';

const medalsPagesTemplateUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Template%3AOlympic_Games_medal_table&prop=text&disabletoc=1&formatversion=2';

const getMedalsPages = async () => {
	const medalsPagesTemplateDom = await Wikipedia.getPageHtml(medalsPagesTemplateUrl);
	const medalsPagesTemplate = new JSDOM(medalsPagesTemplateDom).window.document;

	const medalsPages = [
		...medalsPagesTemplate.querySelectorAll(
			'ul > li > a[href^="/wiki/"][href*="Olympics_medal_table"]'
		),
	].map(el => ({
		title: el.getAttribute('title')!,
		url: el.getAttribute('href')!.replace(/^\/wiki\//, ''),
	}));

	return medalsPages;
};

export const readCountryMedals = async () => {
	const medalsPages = await getMedalsPages();

	let gameCountryMedals = {} as Record<string, Omit<CountryMedalRow, 'game'>[]>;
	for (const { title, url } of medalsPages) {
		// get page contents from page title
		const medalPage = await Wikipedia.getPageHtml(Wikipedia.getPageUrl(url));

		// gets first wikitable in page
		const medalTable = new JSDOM(medalPage).window.document.querySelector(
			'table.wikitable'
		)! as HTMLTableElement;

		const year = parseInt(title.split(' ')[0]);
		const season = title.split(' ')[1].trim().toLowerCase();

		let countryMedals: Omit<CountryMedalRow, 'game'>[] = [];

		for (const row of medalTable.rows) {
			if (!row.cells[1].querySelector('img')) continue;
			const country = row.cells[1].textContent!.match(/[A-z\s]+(?=[[*(])|^[A-z\s]+$/)![0].trim();
			// pass country into countryCode lookup
			// const countryCode = get(code);

			const gold = parseInt(row.cells[2].textContent!);
			const silver = parseInt(row.cells[3].textContent!);
			const bronze = parseInt(row.cells[4].textContent!);
			const total = parseInt(row.cells[5].textContent!);

			countryMedals.push({ country, gold, silver, bronze, total });
		}

		gameCountryMedals[[year, season].toString()] = countryMedals; // lookup gamesKey
	}

	return gameCountryMedals;
};
