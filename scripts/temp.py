import json
import os
import subprocess

existing = os.listdir('./images/country')

all_existing = ' '.join(existing)

with open('./json/countryDetail2.json') as f:
    countries = json.load(f)

for country in countries:
    code = country['code']
    flag = country['flag']

    if code not in all_existing:
        print(code)

        try:
            command = subprocess.run(['curl', f'{flag}', '--output', f'./images/country/{code}.svg'])
        except:
            print(code, 'FAILED')
