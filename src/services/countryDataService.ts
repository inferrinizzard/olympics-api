import { db } from '../db';

import type {
  CountryAttendanceRow,
  CountryDetailRow,
  CountryId,
} from '../models/countryData';
import type { GamesId } from '../models/gamesData';

export class CountryDataService {
  countryDetailTable = 'country_detail';
  countryAttendanceTable = 'country_attendance';

  public getAll = (): Promise<CountryId[]> =>
    db
      .any(
        `SELECT DISTINCT country FROM ${this.countryDetailTable} ORDER BY country;`
      )
      .then((rows: Pick<CountryDetailRow, 'country'>[]) =>
        rows.map((row) => row.country)
      );

  public get = (country: CountryId): Promise<CountryDetailRow | null> =>
    db.oneOrNone(
      `SELECT * FROM ${this.countryDetailTable} WHERE country = '${country}';`
    );

  public getAttendance = (
    game: GamesId
  ): Promise<CountryAttendanceRow | null> =>
    db.oneOrNone(
      `SELECT game, country_athletes FROM ${this.countryAttendanceTable} WHERE game = '${game}';`
    );
}
