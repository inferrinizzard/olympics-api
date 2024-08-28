import { Controller, Get, Path, Route } from 'tsoa';

import type { GamesId } from '../models/gamesData';
import type {
  CountryAttendanceRow,
  CountryDetailRow,
  CountryId,
} from '../models/countryData';
import { CountryDataService } from '../services/countryDataService';

@Route('countries')
export class CountryDataController extends Controller {
  @Get()
  public async getAllCountries(): Promise<CountryId[]> {
    return new CountryDataService().getAll();
  }

  @Get('{country}')
  public async getCountry(
    @Path() country: CountryId
  ): Promise<CountryDetailRow | null> {
    return new CountryDataService().get(country);
  }

  @Get('games/{game}')
  public async getCountryAttendance(
    @Path() game: GamesId
  ): Promise<CountryAttendanceRow | null> {
    return new CountryDataService().getAttendance(game);
  }
}
