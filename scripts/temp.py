import json
import os
import subprocess
import shutil


existing = os.listdir('./images/sports')
# all_existing = ' '.join(existing)
official = os.listdir('./images/sports/official')

with open('./json/final/sportsDetail.json') as f:
    sportsData = json.load(f)

all_existing_sports = ' '.join([' '.join(existing), ' '.join(official)])
for sport in sportsData:
    code = sport['code']
    if not code in all_existing_sports:
        print(code, sport['name'])

        [
    {
        "alt": "Para Archery Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaArchery_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaArchery_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaArchery_uncropped 3x"
    },
    {
        "alt": "Para Badminton Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBadminton_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBadminton_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBadminton_uncropped 3x"
    },
    {
        "alt": "Para Boccia Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBoccia_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBoccia_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBoccia_uncropped 3x"
    },
    {
        "alt": "Para Kayak Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaKayak_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaKayak_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaKayak_uncropped 3x"
    },
    {
        "alt": "Para Cycling Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaCycling_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaCycling_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaCycling_uncropped 3x"
    },
    {
        "alt": "Para Equestiran Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaEquestrian_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaEquestrian_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaEquestrian_uncropped 3x"
    },
    {
        "alt": "Para Goal Ball Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaGoalBall_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaGoalBall_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaGoalBall_uncropped 3x"
    },
    {
        "alt": "Para Judo Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaJudo_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaJudo_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaJudo_uncropped 3x"
    },
    {
        "alt": "Para Power Lifting Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaPowerLifting_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaPowerLifting_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaPowerLifting_uncropped 3x"
    },
    {
        "alt": "Para Rowing Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaRowing_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaRowing_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaRowing_uncropped 3x"
    },
    {
        "alt": "Para Shooting Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaShooting_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaShooting_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaShooting_uncropped 3x"
    },
    {
        "alt": "Para Volleyball Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaVolleyball_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaVolleyball_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaVolleyball_uncropped 3x"
    },
    {
        "alt": "Para Soccer Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSoccer_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSoccer_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSoccer_uncropped 3x"
    },
    {
        "alt": "Para Swimming Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSwimming_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSwimming_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSwimming_uncropped 3x"
    },
    {
        "alt": "Para Table Tennis Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTableTennis_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTableTennis_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTableTennis_uncropped 3x"
    },
    {
        "alt": "Para Taekwondo Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTaekwondo_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTaekwondo_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTaekwondo_uncropped 3x"
    },
    {
        "alt": "Para Athletics Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaAthletics_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaAthletics_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaAthletics_uncropped 3x"
    },
    {
        "alt": "Para Triathlon Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTriathlon_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTriathlon_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTriathlon_uncropped 3x"
    },
    {
        "alt": "Para Basketball Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBasketball_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBasketball_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaBasketball_uncropped 3x"
    },
    {
        "alt": "Para Fencing Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaFencing_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaFencing_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaFencing_uncropped 3x"
    },
    {
        "alt": "Para Wheelchair Rugby Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaWheelchairRugby_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaWheelchairRugby_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaWheelchairRugby_uncropped 3x"
    },
    {
        "alt": "Para Tennis Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTennis_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTennis_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaTennis_uncropped 3x"
    },
    {
        "alt": "Para Alpine Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaAlpine_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaAlpine_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaAlpine_uncropped 3x"
    },
    {
        "alt": "Para Cross Country Skiing Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaCrossCountrySkiing_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaCrossCountrySkiing_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaCrossCountrySkiing_uncropped 3x"
    },
    {
        "alt": "Para Sled Hockey Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSledHockey_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSledHockey_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSledHockey_uncropped 3x"
    },
    {
        "alt": "Para Snowboard Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSnowboard_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSnowboard_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaSnowboard_uncropped 3x"
    },
    {
        "alt": "Para Wheelchair Curling Pictogram",
        "src": "https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_740/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaWheelchairCurling_uncropped, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_1480/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaWheelchairCurling_uncropped 2x, https://res.cloudinary.com/usopc-prod/image/upload/c_scale,w_2220/q_auto/f_auto/USOPC%20Assets/Initial%20migration%20assets/Pictograms/1_ParaWheelchairCurling_uncropped 3x"
    }
]


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
