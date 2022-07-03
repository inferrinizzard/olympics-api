import { Controller, Get, Path, Route } from 'tsoa';

import type { CountryDetailRow, CountryId } from '../models/countryData';
import { CountryDataService } from '../services/countryDataService.js';

@Route('countries')
export class CountryDataController extends Controller {
	@Get()
	public async getAllCountries(): Promise<CountryId[]> {
		return new CountryDataService().getAll();
	}

	@Get('{country}')
	public async getCountry(@Path() country: CountryId): Promise<CountryDetailRow | null> {
		return new CountryDataService().get(country);
	}
}
