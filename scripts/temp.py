import json
import os
import subprocess
import shutil


existing = os.listdir('./images/games')

all_existing = ' '.join(existing)

with open('./json/gamesDetail2.json') as f:
    games = json.load(f)

for game in games:
    os.mkdir(f'./images/games/{game["code"]}')
    old_image = next((g for g in existing if game['year'] in g and game['season'] in g), None)

    if not old_image is None:
        shutil.move(f'./images/games/{old_image}', f'./images/games/{game["code"]}/emblem{old_image[-4:]}')






# with open('./json/sportsDetail2.json') as f:
#     sports = json.load(f)

# sports_map = {}

    # subprocess.run(['rm', f'./images/country/{flag}.svg'])

# missing = []

# for sport in sports:
#     code = sport['code']

#     if not code in all_existing:
#         missing.append(code)

# ['AQU', 'BSK', 'CAS', 'CYC', 'DAN', 'FBS', 'GYM', 'HO5', 'SKS', 'VOL', 'WRS', 'WRB', 'WRF', 'WRG', 'BSN', 'SKT', 'SKI', 'NEV', 'P-ARC', 'P-ATH', 'P-BDM', 'P-FBB', 'P-BOC', 'P-CAS', 'P-CYC', 'P-EQU', 'P-GBL', 'P-JUD', 'P-PWL', 'P-ROW', 'P-SHO', 'P-VBS', 'P-SWM', 'P-TTE', 'P-TKW', 'P-TRI', 'P-WBK', 'P-WFE', 'P-WRU', 'P-WTE', 'P-ALP', 'P-BTH', 'P-CCS', 'P-IHO', 'P-SBD', 'P-CUR', 'MTR', 'BBL', 'RAR', 'BWO', 'DIS', 'HPP', 'LAT', 'SLS', 'STA', 'STD', 'END', 'BSC', 'GAE', 'PAR', 'ROI', 'ASK', 'IAS', 'IDS', 'INF', 'INH', 'ISS', 'RHO', 'RDY', 'RFS', 'SCO', 'SKC', 'GSK', 'SPS', 'TMS', 'WRP', 'WRK', 'WRT', 'AIR', 'AFB', 'AUT', 'BDY', 'BLD', 'BOU', 'BWL', 'BDG', 'CHL', 'CHS', 'MTN', 'FLR', 'FDS', 'IST', 'KIK', 'KBL', 'LFC', 'MCS', 'MTI', 'NBL', 'ORI', 'RQL', 'SBO', 'SLG', 'SUM', 'TEQ', 'UWA', 'WSK', 'AIK', 'JES', 'JJI', 'KAB', 'KUR', 'LBO', 'APG', 'PSI', 'SPK', 'TST', 'CER', 'GEN', 'IOC', 'MDL', 'ART', 'OLV', 'PCO', 'TRU']
