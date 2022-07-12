import { Controller, Get, Path, Route } from 'tsoa';

import type { CountryId } from '../models/countryData';
import type { MedalTotalsRow } from '../models/medalsData';
import { MedalsDataService } from '../services/medalsDataService.js';

@Route('medals')
export class MedalsDataController extends Controller {
	@Get()
	public async getAllTotals(): Promise<Record<CountryId, Exclude<MedalTotalsRow, CountryId>>> {
		return new MedalsDataService().getTotals();
	}

	@Get('{country}')
	public async getMedals(@Path() country: CountryId): Promise<MedalTotalsRow | null> {
		return new MedalsDataService().getCountryTotals(country);
	}
}
