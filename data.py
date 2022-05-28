import json

with open('json/countryAttendance.json', 'r') as f:
    countryAttendanceJson = json.load(f)

with open('json/countryAthletes.json', 'r') as f:
    countryAthletesJson = json.load(f)

with open('json/countryAthletesRaw.json', 'r') as f:
    countryAthletesRawJson = json.load(f)

countryAttendance = [
    country + ',' + game for country, games in countryAttendanceJson.items() for game in games
]
countryAthletes = [
    key + ',' + gameDict['game'] for gameDict in countryAthletesJson for key in gameDict['countryAthletes'].keys() if len(gameDict) > 0
]
countryAthletesRaw = [
    country + ',' + game for game, countries in countryAthletesRawJson.items() for country in countries.keys() if country
]


def addCountryAthletesDiff():
    with open('json/countryAthletesDiff.json', 'r') as f:
        countryAthletesDiffJson = json.load(f)

    newCountryAthletesJson = []
    for line in countryAthletesJson:
        if line['game'] in countryAthletesDiffJson:
            line['countryAthletes'].update(
                countryAthletesDiffJson[line['game']])
        newCountryAthletesJson.append(line)

    return newCountryAthletesJson


# with open('json/countryAttendanceSet.json', 'w+') as f:
#     countryAttendanceJson = json.dump(sorted(countryAttendance), f)

# with open('json/countryAthletesSet.json', 'w+') as f:
#     countryAthletesJson = json.dump(sorted(countryAthletes), f)

countryAthletesJson = addCountryAthletesDiff()
countryAthletes = [
    key + ',' + gameDict['game'] for gameDict in countryAthletesJson for key in gameDict['countryAthletes'].keys() if len(gameDict) > 0
]
print(list(set(countryAttendance) - set(countryAthletes)))
print()
print(list(set(countryAthletes) - set(countryAttendance)))


def getCountryAthletesDiff():
    countryAthletesDiff = list(set(countryAthletes) - set(countryAthletesRaw))
    countryAthletesDiff = [line.split(',') for line in countryAthletesDiff]

    diff = {}
    for [country, game] in countryAthletesDiff:
        if game not in diff:
            diff[game] = {}
        diff[game][country] = next((line for line in countryAthletesJson if line['game'] == game))[
            'countryAthletes'][country]
    print(diff)

# getCountryAthletesDiff()
