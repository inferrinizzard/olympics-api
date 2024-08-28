import { Controller, Get, Path, Route } from 'tsoa';

import type { CountryFlagMap } from '../models/countryData';
import type { SportsIconMap } from '../models/sportsData';
import type { GamesEmblemMap } from '../models/gamesData';
import { ImageDataService } from '../services/imageDataService';

@Route('images')
export class ImageDataController extends Controller {
  @Get('countries')
  public async getCountryFlags(): Promise<CountryFlagMap> {
    return new ImageDataService().getCountryFlags();
  }
  @Get('games')
  public async getGamesEmblems(): Promise<GamesEmblemMap> {
    return new ImageDataService().getGamesEmblems();
  }
  @Get('sports')
  public async getSportsLogos(): Promise<SportsIconMap> {
    return new ImageDataService().getSportsLogos();
  }
}
