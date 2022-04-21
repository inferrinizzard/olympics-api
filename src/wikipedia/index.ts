import got from 'got';
import { JSDOM } from 'jsdom';

import { WikipediaParse } from '../models/wikipedia';

const pageUrl =
	'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=WIKIPEDIA_PAGE&prop=text&disabletoc=1&formatversion=2';

abstract class Wikipedia {
	public static getPageUrl = (page: string): string => pageUrl.replace('WIKIPEDIA_PAGE', page);

	public static getPageHtml = (url: string) =>
		got
			.get(url)
			.json()
			.then(data => (data as WikipediaParse).parse.text);

	public static getInfobox = (html: string) => {
		const dom = new JSDOM(html);
		const infobox = dom.window.document.querySelector('table.infobox');
		return infobox as HTMLTableElement;
	};

	public static readGamesInfobox = (infobox: HTMLTableElement) => {
		const title = infobox.querySelector('caption')?.textContent;
		const image = infobox
			.querySelector('img')
			?.getAttribute('src')
			?.replace(/^[/]{2}/, 'https://');

		let gamesData = { title, emblem: image };
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

		return gamesData;
	};
}

export default Wikipedia;
