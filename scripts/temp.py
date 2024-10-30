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

sports = [
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/ALPINE_SKIING_0.svg?VersionId=l_u7RJy6c7eQV8UNeg1qktLdzFCtiTWu",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/BIATHLON.svg?VersionId=BO1.a_W3QI3aDeiSgEhA6IFqHVx3qQU6",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/BOBSLEIGH.svg?VersionId=8VeXslixUH9z5WqxWZOFwDaFGe1PL6Nk",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/CROSS-COUNTRY%20SKIING.svg?VersionId=rQ_8lF0vfVpqfsAcLuERuOqQiKZxRIi0",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/CURLING.svg?VersionId=eg0eZPd42mFgmdWhnLqzA2QTqYBtteAd",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/FIGURE_SKATING.svg?VersionId=.YeAh2OWksleiwEiwbxluwm4hgvYX1g1",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/FREESTYLE_SKIING.svg?VersionId=aP6rsq97daL9FFxhrxanKHhy_jyjpmm0",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/ICE_HOCKEY.svg?VersionId=nkvqF_ZHDwEZ2Eveu4pFKdk8nKCxdltd",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/LUGE.svg?VersionId=qFfLjmSRt6Tf1P0EgBjhgmFt7k5HIvHi",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/NORDIC_COMBINED.svg?VersionId=xbDkc44Kecm6IxnCeklvHDnQNYxJ3xoG",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/SHORT%20TRACK%20SPEED%20SKATING_0.svg?VersionId=0xj4OKxfBJve8Pex_ingOa9jNu7XHfGM",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/SKELETON.svg?VersionId=ouMFmrmHPkcdB76vmxo3peP2.5BgvcYn",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/SKI_JUMPING.svg?VersionId=xbk9RjzUigUjbGtTQqImlwDh5my5wegt",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-04/SkiMountaneering_5.svg?VersionId=2xRecBeLjec89nCKhHtY5._I6IQkCwZe",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/SNOWBOARD.svg?VersionId=LzG4riaAkAD2fHis9VvcgDnin7sguNCQ",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/SPEED_SKATING.svg?VersionId=41d6fbzM.SKfGOcVzScN9wWIU6B8lveH",]
para=    [
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/PARA_ALPINE%20SKIING_0.svg?VersionId=7igoiA8Lsj6I86GGWkGWC.X1v5ObeMDS",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/PARA_BIATHLON.svg?VersionId=97ah50C_.e4WUqEraok.UF6HHTRAGOXe",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/PARA_CROSS-COUNTRY_SKIING.svg?VersionId=Fa1uHhaLNJhN9DSyrN5iaFi6f3Jnd2DR",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/PARA_ICE_HOCKEY.svg?VersionId=NQgHaC1bLQqU14KxWCdkTHtLmsKVfulk",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-05/Snowboard%20Paralimpico_1.svg?VersionId=w2wl2.Ogn76sVlqNvP9jXjlQmQzQnJFT",
    "https://milanocortina2026.olympics.com/s3fs-public/images/2024-03/WHEELCHAIR_CURLING.svg?VersionId=tZNYUpyu5w84HnEHTW8Tfoy5OGJ8orPS"
]

