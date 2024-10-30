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

discipline_parent_map = {}

for sport in sports_detail:
    if 'parent' in sport:
        discipline_parent_map[sport['code']] = sport['parent']


parent_discipline_map = {}

for discipline, parent in discipline_parent_map.items():
    if parent in parent_discipline_map:
        parent_discipline_map[parent] = [*parent_discipline_map[parent], discipline]
    else:
        parent_discipline_map[parent] = [discipline]

parent_discipline_map = { k: v[0] if len(v) == 1 else v for k,v in parent_discipline_map.items() }

print(parent_discipline_map)
