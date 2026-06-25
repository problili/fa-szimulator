from fastapi import FastAPI
from backend.game_state import GameState
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from shapely.geometry import Point
from backend.geo import get_random_district, DISTRICTS
import csv

app = FastAPI()

app.mount(
    "/static",
    StaticFiles(directory="frontend"),
    name="static"
)

@app.get("/")
def home():
    return FileResponse("frontend/index.html")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

game = GameState()


@app.get("/state")
def get_state():
    return {
        "time": game.get_time(),
        "elegedettseg": game.elegedettseg,
        "szakertelem": game.szakertelem,
        "furgon": game.furgon
    }


@app.post("/end_turn")
def end_turn():

    game.next_turn()

    return {
        "time": game.get_time(),
        "elegedettseg": game.elegedettseg,
        "szakertelem": game.szakertelem,
        "furgon": game.furgon
    }


# ----------------------------------
# TREES FROM CSV
# ----------------------------------

CURRENT_DISTRICT = None

@app.get("/touring/start")
def start_touring():

    global CURRENT_DISTRICT
    CURRENT_DISTRICT = get_random_district()

    return {
        "name": str(CURRENT_DISTRICT.get("name", "unknown")),
        "id": str(CURRENT_DISTRICT.name)
    }

@app.get("/trees")
def get_trees():

    global CURRENT_DISTRICT

    if CURRENT_DISTRICT is None:
        return []

    polygon = CURRENT_DISTRICT.geometry

    trees = []

    with open("backend/dendro_final.csv", newline="", encoding="utf-8") as f:

        reader = csv.DictReader(f)

        for row in reader:

            try:
                lat = float(row["lat"])
                lon = float(row["lon"])

                point = Point(lon, lat)  # IMPORTANT: lon, lat order

                if polygon.contains(point):

                    row["lat"] = lat
                    row["lon"] = lon

                    trees.append(row)

            except:
                pass

    return trees