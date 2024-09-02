## Country

### Data

#### Process

1.  `wikipedia/country/getAllCountryData.ts`

    a. Fetch data from Olympedia (`wikipedia/country/getCountryDataFromOlympedia.ts`)

    b. run `findDiff.ts`, check for extras

    c. adjust based on repeats + Olympedia, ie. (ROC -> KMT\*)

    d. run `clean2final.ts`, (sorts, removes imageUrl)

2.  get images and remove `imageUrl` field (see below)
3.  convert to csv

#### Sources

- Wikipedia
  - All IOC/IPC Codes — https://en.wikipedia.org/wiki/List_of_IOC_country_codes
  - Summer Olympic — https://en.wikipedia.org/wiki/List_of_participating_nations_at_the_Summer_Olympic_Games
  - Winter Olympic — https://en.wikipedia.org/wiki/List_of_participating_nations_at_the_Winter_Olympic_Games
  - Summer Paralympic — https://en.wikipedia.org/wiki/List_of_participating_nations_at_the_Summer_Paralympic_Games
  - Winter Paralympic — https://en.wikipedia.org/wiki/List_of_participating_nations_at_the_Winter_Paralympic_Games
- Olympedia — https://www.olympedia.org/countries

#### Caveats

- Duplicated Codes:
  - ROC, Republic of China -> KMT
  - GUI, British Guiana -> BGU
  - ZZX, Mixed Team -> XXB
  - ANZ, Australasia -> special copy removed
  - EUA, Unified Germany -> special copy removed
  - EUN, Equipe Unifiee -> historic copy removed
  - IPA, Individual Paralympic Athletes -> removed in favour of 'Independent Paralympic Athletes'
- Countries that don't already include pageName:
  - IHO -> Indonesia_at_the_1952_Summer_Olympics
  - MAL -> Malaya_at_the_Olympics
  - IPA, PNA -> Independent_Paralympians_at_the_Paralympic_Games
  - VNM, ZAI, BIR, BGU -> append `'_at_the_Olympics'`

### Images

- Provided with country data, fetch and remove `imageUrl`
- Name each image with code under `/images/country/[CODE].svg`

## Games

### Data

#### Process

#### Sources

#### Caveats

### Images

## Sports

### Data

#### Process

Manual copy from PDF, identify parents for disciplines
Repeat for paralympics and merge

#### Sources

- Official — https://odf.olympictech.org/project.htm
- Olympics — https://odf.olympictech.org/ioc/Olympic_Movement_Sport_Codes.pdf
- Paralympics — https://www.paralympic.org/sites/default/files/2021-08/IPC%20Guide%20to%20Para%20and%20IPC%20Terminology.pdf
- Olympedia — https://www.olympedia.org/sports

#### Caveats

### Images

#### Process

Extract svg from wikipedia infobox for each sport page (ie. _SPORT_ at the _YEAR_ _SEASON_ games) if exists
Rely on Olympic designs for png if not
Convert rasters to avif

YOG: Copy from design and hand extract screenshots from group image

#### Sources

- The Olympic Design
  - Olympics — https://www.theolympicdesign.com/olympics/pictograms/
  - Paralympics — https://www.theolympicdesign.com/paralympics/pictograms/
  - YOG — https://www.theolympicdesign.com/yog/

#### Caveats

Sports pictograms for atlanta-1996_paralympics, nagano-1998_paralympics are missing
