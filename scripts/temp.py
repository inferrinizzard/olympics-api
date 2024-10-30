import json
import os
import subprocess
import shutil

official = os.listdir('./images/sports/official')
other = [img for img in os.listdir('./images/sports') if img.endswith('.svg')]

with open('./json/final/sportsDetail.json') as f:
    sports_detail = json.load(f)

for img in official:
    sport = next((sport for sport in sports_detail if sport['code'] == img.split('.')[0]), None)
    if not sport:
        print(img)

