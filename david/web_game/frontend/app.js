let mapMode = "budapest";

async function loadState() {

    const res = await fetch("/state");
    const data = await res.json();

    document.getElementById("time").innerText = data.time;

    document.getElementById("resources").innerText =
        `Elégedettség: ${data.elegedettseg} | ` +
        `Szakértelem: ${data.szakertelem} | ` +
        `Furgon: ${data.furgon}`;
}

async function endTurn() {

    await fetch("/end_turn", { method: "POST" });

    await loadState();
}

function openProfile() {
    console.log("Profile clicked");
}

function openMissions() {
    console.log("Mission clicked");
}



/* Called from Touring button */
function toggleTouring() {

    if (window.mapMode === "touring") {
        window.setBudapestMap();
    } else {
        window.setTouringMap();
    }
}

loadState();