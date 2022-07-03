import { Controller, Get, Path, Route } from 'tsoa';

import type { GamesDetailRow, GamesId } from '../models/gamesData';
import { GamesDetailService } from '../services/gamesDataService.js';

@Route('games')
export class GamesDetailController extends Controller {
	@Get()
	public async getAllGames(): Promise<GamesId[]> {
		return new GamesDetailService().getAll();
	}

	@Get('{game}')
	public async getGames(@Path() game: GamesId): Promise<GamesDetailRow | null> {
		return new GamesDetailService().get(game);
	}
}
