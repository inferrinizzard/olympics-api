export type CountryId = CountryDetailRow['country'];

export interface CountryDetailRow extends Record<string, string> {
	country: string;
	name: string;
	flag: string;
}
