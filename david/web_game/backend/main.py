from fastapi import FastAPI
from backend.game_state import GameState
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

@app.get("/trees")
def get_trees():

    trees = []

    with open(
        "backend/dendro_final.csv",
        newline="",
        encoding="utf-8"
    ) as f:

        reader = csv.DictReader(f)

        for row in reader:

            try:

                row["lat"] = float(row["lat"])
                row["lon"] = float(row["lon"])

                trees.append(row)

            except:
                pass

    return trees