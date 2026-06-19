async function loadState() {
    const res = await fetch("http://127.0.0.1:8000/state");
    const data = await res.json();

    document.getElementById("time").innerText = data.time;

    document.getElementById("resources").innerText =
        `Elégedettség: ${data.elegedettseg} | ` +
        `Szakértelem: ${data.szakertelem} | ` +
        `Furgon: ${data.furgon}`;
}

async function endTurn() {
    await fetch("http://127.0.0.1:8000/end_turn", {
        method: "POST"
    });

    loadState();
}

function openProfile() {
    console.log("Profile clicked");
}

function openMissions() {
    console.log("Mission clicked");
}

loadState();
setInterval(loadState, 1000);