import { Controller, Get, Path, Route } from 'tsoa';

import type { GamesId } from '../models/gamesData';
import type {
  SportDetailRow,
  SportId,
  SportsEventRow,
} from '../models/sportsData';
import { SportsDataService } from '../services/sportsDataService';

@Route('sports')
export class SportsDataController extends Controller {
  @Get()
  public async getAllSports(): Promise<SportId[]> {
    return new SportsDataService().getAll();
  }

  @Get('{sport}')
  public async getSports(
    @Path() sport: SportId
  ): Promise<SportDetailRow | null> {
    return new SportsDataService().get(sport);
  }

  @Get('{sport}/events/{game}')
  public async getSportsEvent(
    @Path() sport: SportId,
    @Path() game: GamesId
  ): Promise<SportsEventRow | null> {
    return new SportsDataService().getEventResults(sport, game);
  }

  // @Get('games/{game}')
  // public async getGameSports(@Path() game: GamesId): Promise<SportsEventRow[]> {
  // 	return new SportsDataService().getGameEvents(game);
  // }
}
