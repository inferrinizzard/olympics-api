import { JSDOM } from 'jsdom';

import { pgp, db } from '../../src/db';

import { readFileSync, writeFileSync } from 'fs';

import OlympicsCom from './olympics-com/index';
import Wikipedia from './wikipedia/old/index';

import type {
  GamesKeyLookup,
  CountryDetailRow,
  GamesDetailRow,
  SportDetailRow,
  CountryMedalRow,
  MedalTotalsRow,
  CountryAttendanceRow,
} from './types/index';

import { readCountryDetail } from './wikipedia/old/countryDetailReader';
import { readGamesDetail } from './wikipedia/old/gamesDetailReader';
import { readSportsDetail } from './wikipedia/old/sportsDetailReader';
import { readCountryAttendance } from './wikipedia/old/countryAttendanceReader';
import { readCountryMedals } from './wikipedia/old/countryMedalsReader';
import { readMedalTotals } from './wikipedia/old/medalTotalsReader';

export class Olympics {
  private olympicsCom!: OlympicsCom;

  gamesLookup: Record<string, GamesKeyLookup> = {};

  countryDetail: CountryDetailRow[] = [];
  gamesDetail: GamesDetailRow[] = [];
  sportsDetail: SportDetailRow[] = [];

  countryMedals: CountryMedalRow[] = [];
  countryAttendance: CountryAttendanceRow[] = [];
  medalsTotals: MedalTotalsRow[] = [];
  sportsEvents = [];

  async init() {
    console.log('Starting Scraper...');
    // initial table reads, required for secondary data below
    await this.fetchGamesLookup();
    this.countryDetail = await readCountryDetail();

    const gamesDetailData = await readGamesDetail(
      this.gamesLookup,
      this.getCountryCode.bind(this)
    );
    this.gamesDetail = gamesDetailData.map(
      ({ countryAthletes, ...rest }) => rest
    );

    this.countryAttendance = gamesDetailData.map(
      ({ countryAthletes, game }) => ({
        game,
        countryAthletes,
      })
    );

    this.sportsDetail = await readSportsDetail();

    this.countryMedals = await readCountryMedals(
      this.getCountryCode.bind(this),
      this.getGamesKey.bind(this)
    );

    this.medalsTotals = await readMedalTotals();

    // write scrape results to json
    writeFileSync(
      './json/countryDetail.json',
      JSON.stringify(this.countryDetail, null, 2)
    );
    writeFileSync(
      './json/gamesDetail.json',
      JSON.stringify(this.gamesDetail, null, 2)
    );
    writeFileSync(
      './json/sportsDetail.json',
      JSON.stringify(this.sportsDetail, null, 2)
    );
    writeFileSync(
      './json/countryMedals.json',
      JSON.stringify(this.countryMedals, null, 2)
    );
    writeFileSync(
      './json/countryAttendance.json',
      JSON.stringify(this.countryAttendance, null, 2)
    );
    writeFileSync(
      './json/medalTotals.json',
      JSON.stringify(this.medalsTotals, null, 2)
    );

    return this;
  }

  private async fetchGamesLookup() {
    const url =
      'https://en.wikipedia.org/w/api.php?action=parse&format=json&page=Template%3AOlympic_Games&prop=text&disabletoc=1&formatversion=2';
    const response = await Wikipedia.getPageHtml(url);

    const document = new JSDOM(response).window.document;

    const gamesElements = [
      ...document.querySelectorAll(
        'ul > li > a[href^="/wiki/"][href$="Olympics"]'
      ),
    ].filter((el) => el.textContent?.match(/^[0-9]{4}/));
    const games = gamesElements.map((el) => {
      const text = el.textContent!;
      const year = parseInt(text.slice(0, 4));
      const host = text.slice(4).trim();

      const title = el.getAttribute('title')!;
      const season = title.split(' ')[1].trim().toLowerCase();

      return {
        // text,
        // title,
        year,
        season,
        key:
          text.length > 5
            ? host.match(/rio/i) // rio is the only exception to this pattern
              ? 'rio-2016'
              : host.replace(/[\s']/g, '-').replace(/\./g, '').toLowerCase() +
                '-' +
                year
            : '',
      };
    });

    // [YYYY, season]: {year: YYYY, season: string, key: host-YYYY}
    this.gamesLookup = games.reduce(
      (acc, cur) => ({ ...acc, [[cur.year, cur.season].toString()]: cur }),
      {}
    );
  }

  getGamesKey(year: number, season: string): string {
    return this.gamesLookup[[year, season].toString()].key;
  }

  getCountryCode(countryName: string): string {
    const res = this.countryDetail.find((country) =>
      country.name.match(new RegExp(countryName, 'i'))
    );

    // edge cases, TODO: resolve this
    if (!res && countryName.match(/ceylon/i)) return 'SRI';
    if (!res && countryName.match(/fr yugoslavia/i)) return 'YUG';

    if (!res) {
      // console.log(`Country not found: ${countryName}`);
      return '';
    }

    return res!.country;
  }
}
