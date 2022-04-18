export interface YearDetail {
	countries: Set<string>;
	host: string;
	cities: string[];
	sports: string[];
}

export interface CountryDetail {
	name: string;
	code: string;
	flag: string;
}

export interface CountryAttendanceRow extends Record<string, any> {
	name: string;
	code: string;
	year: number;
	season: OlympicsSeason;
	host: boolean;
}

export interface MedalsDetail {
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

export interface MedalsTotalRow extends Record<string, any> {
	country: string;
	season: OlympicsSeason | 'total';
	gold: number;
	silver: number;
	bronze: number;
	total: number;
}

export interface SportDetail {
	name: string;
	code: string;
	icon: string;
}

export interface SportEventsRow {
	sport: string;
	// event: string; // event|demonstration
	year: number;
	season: OlympicsSeason;
	// gold: string;
	// silver: string;
	// bronze: string;
}

export enum OlympicsSeason {
	SUMMER = 'summer',
	WINTER = 'winter',
}
