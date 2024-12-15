import json
import os
import subprocess
import shutil

para_map = {
    'P-ARC' :'P-AR',
    'P-ALP' :'P-AS',
    'P-ATH' :'P-AT',
    'P-BDM' :'P-BD',
    'P-BOC' :'P-BO',
    'P-CCS' :'P-CC',
    'P-CAS' :'P-CF',
    'P-CYC' :'P-CR',
    'P-EQU' :'P-EQ',
    'P-FBB' :'P-FB',
    'P-GBL' :'P-GB',
    'P-IHO' :'P-IH',
    'P-JUD' :'P-JU',
    'P-PWL' :'P-PO',
    'P-ROW' :'P-RO',
    'P-SBD' :'P-SB',
    'P-SHO' :'P-SH',
    'P-SWM' :'P-SW',
    'P-TKW' :'P-TK',
    'P-TRI' :'P-TR',
    'P-TTE' :'P-TT',
    'P-VBS' :'P-VS',
    'P-WBK' :'P-WB',
    'P-CUR' :'P-WC',
    'P-WFE' :'P-WF',
    'P-WRU' :'P-WR',
    'P-WTE' :'P-WT',
}

# official = os.listdir('./images/sports/official')
# other = [img for img in os.listdir('./images/sports') if img.endswith('.svg')]

games = os.listdir('./images/games')

for game in games:
    sports_dir = f'./images/games/{game}/sports'
    if not os.path.exists(sports_dir):
        continue
    
    sports = os.listdir(sports_dir)

    for sport in sports:
        if not sport.startswith('P-'):
            continue
        
        code = 'P-' + sport.split('P-')[1].split('.')[0]

        if len(code) < 5:
            continue

        new_code = para_map.get(code)

        if not new_code:
            print(f'NOT FOUND, {sports_dir}/{code}')
            continue

        # print(os.path.join(sports_dir, sport), os.path.join(sports_dir, sport).replace(code, new_code))
        os.rename(os.path.join(sports_dir, sport), os.path.join(sports_dir, sport).replace(code, new_code))
        



# with open('./json/final/sportsDetail.json') as f:
#     sports_detail = json.load(f)

# for img in official:
#     sport = next((sport for sport in sports_detail if sport['code'] == img.split('.')[0]), None)
#     if not sport:
#         print(img)

