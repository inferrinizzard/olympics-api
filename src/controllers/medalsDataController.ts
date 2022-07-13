import { Controller, Get, Path, Route } from 'tsoa';

import type { GamesId } from '../models/gamesData';
import type { CountryId } from '../models/countryData';
import type { CountryMedalRow, MedalTotalsRow } from '../models/medalsData';
import { MedalsDataService } from '../services/medalsDataService.js';

@Route('medals')
export class MedalsDataController extends Controller {
	@Get()
	public async getAllTotals(): Promise<Record<CountryId, Exclude<MedalTotalsRow, CountryId>>> {
		return new MedalsDataService().getTotals();
	}

	@Get('countries/{country}')
	public async getMedals(@Path() country: CountryId): Promise<MedalTotalsRow | null> {
		return new MedalsDataService().getCountryTotals(country);
	}

	@Get('games/{game}')
	public async getGamesMedals(
		@Path() game: GamesId
	): Promise<Record<CountryId, Pick<CountryMedalRow, 'gold' | 'silver' | 'bronze' | 'total'>>> {
		return new MedalsDataService().getGameMedals(game);
	}
}
