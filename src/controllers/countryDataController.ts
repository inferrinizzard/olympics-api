import { Controller, Get, Path, Route } from 'tsoa';

import type { CountryDetailRow, CountryId } from '../models/countryData';
import { CountryDetailService } from '../services/countryDataService.js';

@Route('countries')
export class CountryDetailController extends Controller {
	@Get()
	public async getAllCountries(): Promise<CountryId[]> {
		return new CountryDetailService().getAll();
	}

	@Get('{country}')
	public async getCountry(@Path() country: CountryId): Promise<CountryDetailRow | null> {
		return new CountryDetailService().get(country);
	}
}
