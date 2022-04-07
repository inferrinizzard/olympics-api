export interface WikipediaParse {
	parse: WikipediaParseBody;
}
export interface WikipediaParseBody {
	title: string;
	pageid: number;
	text: string;
}
