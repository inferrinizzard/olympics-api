import { Controller, Get, Path, Route } from 'tsoa';

import type { CountryDetailRow, CountryId } from '../models/countryData';
import type { SportDetailRow, SportId } from '../models/sportsData';
import type { GamesDetailRow, GamesId } from '../models/gamesData';
import { ImageDataService } from '../services/imageDataService.js';

@Route('images')
export class ImageDataController extends Controller {
	@Get('countries')
	public async getCountryFlags(): Promise<Record<CountryId, CountryDetailRow['flag']>> {
		return new ImageDataService().getCountryFlags();
	}
	@Get('games')
	public async getGamesEmblems(): Promise<Record<GamesId, GamesDetailRow['emblem']>> {
		return new ImageDataService().getGamesEmblems();
	}
	@Get('sports')
	public async getSportsLogos(): Promise<Record<SportId, SportDetailRow['logo']>> {
		return new ImageDataService().getSportsLogos();
	}
}
