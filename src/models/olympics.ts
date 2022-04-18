export interface YearDetail {
	countries: Set<string>;
	host: string;
	cities: string[];
	sports: string[];
}

export interface CountryDetail {
	name: string;
	flag: string;
	hosted: string[];
	attended: {
		summer: number[];
		winter: number[];
	};
	medals: {};
}

export interface MedalsGames {
	summer: MedalsDetail;
	winter: MedalsDetail;
	total: MedalsDetail;
}

export interface MedalsDetail {
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

export interface SportDetail {
	name: string;
	code: string;
	icon: string;
	years: number[];
}

export enum OlympicsSeason {
	SUMMER = 'summer',
	WINTER = 'winter',
}
