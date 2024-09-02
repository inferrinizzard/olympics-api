import json
import os
import subprocess
import shutil

official = ['alp.svg','arc.svg','ath.svg','bdm.svg','bk3.svg','bkb.svg','bkg.svg','bmf.svg','bmx.svg','bob.svg','box.svg','bs5.svg','bsb.svg','bth.svg','ccs.svg','ckt.svg','clb.svg','crd.svg','csl.svg','csp.svg','ctr.svg','cur.svg','div.svg','edr.svg','ejp.svg','equ.svg','eve.svg','fbl.svg','fen.svg','flf.svg','frs.svg','fsk.svg','fut.svg','gac.svg','gar.svg','glf.svg','gry.svg','gtr.svg','hbb.svg','hbl.svg','hoc.svg','iho.svg','jud.svg','kte.svg','lax.svg','lug.svg','mpn.svg','mtb.svg','ncb.svg','ows.svg','pel.svg','pol.svg','roc.svg','rol.svg','row.svg','rqt.svg','ru7.svg','sal.svg','sbd.svg','sho.svg','sjp.svg','skb.svg','skn.svg','smt.svg','squ.svg','srf.svg','ssk.svg','stk.svg','swa.svg','swm.svg','ten.svg','tkw.svg','tow.svg','tri.svg','tte.svg','vbv.svg','vvo.svg','wlf.svg','wpo.svg','wre.svg','wsu.svg',]


existing = os.listdir('./images/sports')

for image in existing:
    if image.lower() in official:
        shutil.move(f'./images/sports/{image}', f'./images/sports/official/{image}')

# all_existing = ' '.join(existing)

# with open('./json/gamesDetail2.json') as f:
#     games = json.load(f)

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
