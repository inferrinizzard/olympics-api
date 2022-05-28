import got from 'got';
import { JSDOM } from 'jsdom';

import { writeFileSync } from 'fs';

// writes data to json file
export const toJson = (name: string, data: {}) => writeFileSync(name, JSON.stringify(data));

export interface WikipediaParse {
	parse: WikipediaParseBody;
}
export interface WikipediaParseBody {
	title: string;
	pageid: number;
	text: string;
}

export abstract class Wikipedia {
	static pageUrlTemplate =
		'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=WIKIPEDIA_PAGE&prop=text&disabletoc=1&formatversion=2';
	public static getPageUrl = (page: string): string =>
		Wikipedia.pageUrlTemplate.replace('WIKIPEDIA_PAGE', page);

	public static getPageHtml = (url: string) =>
		got
			.get(url)
			.json()
			.then(data => (data as WikipediaParse).parse.text);

	// gets the last table element within DOM
	public static extractTable = (element: JSDOM) =>
		[...element.window.document.body.firstElementChild?.children!]
			.reverse()
			.find(element => element.tagName.toLowerCase() === 'table')! as HTMLTableElement;
}

export default Wikipedia;
