import { Controller, Get, Path, Route } from 'tsoa';

import type { GamesDetailRow, GamesId } from '../models/gamesData';
import { GamesDataService } from '../services/gamesDataService.js';

@Route('games')
export class GamesDataController extends Controller {
	@Get()
	public async getAllGames(): Promise<GamesId[]> {
		return new GamesDataService().getAll();
	}

	@Get('{game}')
	public async getGames(@Path() game: GamesId): Promise<GamesDetailRow | null> {
		return new GamesDataService().get(game);
	}
}
