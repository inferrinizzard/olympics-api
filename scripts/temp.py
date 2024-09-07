import json
import os
import subprocess
import shutil

existing = os.listdir('./images/sports/official')
all_existing = ' '.join(existing)

with open('./json/partial/sportsPageNames.json') as f:
    page_names = json.load(f)

with open('./json/final/sportsDetail.json') as f:
    sports_detail = json.load(f)


with open('./csv/sportsDetail.csv') as f:
    sports_csv = f.read()


for page in page_names['olympic']:
    if 'Intercalated' in page:
        continue
    if page not in sports_csv:
        print(page)
print()
for page in page_names['paralympic']:
    if page not in sports_csv:
        print(page)

for sport in sports_detail:
    if not 'pageName' in sport:
        print(sport['code'], sport['name'])

# official = os.listdir('./images/sports/official')

# with open('./json/final/sportsDetail.json') as f:
#     sportsData = json.load(f)

# all_existing_sports = ' '.join([' '.join(existing), ' '.join(official)])
# for sport in sportsData:
#     code = sport['code']
#     if not code in all_existing_sports:
#         print(code, sport['name'])


# print(existing)
# for game in games:
#     code = game['code']

#     existing_images_for_game = os.listdir(f'./images/games/{code}')
#     emblem = next((image for image in existing_images_for_game if 'emblem' in image), None)

#     if not emblem:
#         print('MISSING', code)
#         continue

#     if not emblem.endswith('svg'):
#         if(game['image'].endswith('svg')):
#             subprocess.run(['curl', game['image'], '--output', f'./images/games/{code}/emblem.svg'])
#         else:
#             print(code)
    






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
