from fastapi import FastAPI
from game_state import GameState

app = FastAPI()

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
        "status": "ok",
        "state": get_state()
    }