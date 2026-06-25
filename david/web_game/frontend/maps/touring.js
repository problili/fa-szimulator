let map;
let treeMarkers = [];

window.mapMode = "budapest";

const treeIcon = L.icon({
    iconUrl: "/static/assets/tree.png",
    iconSize: [24, 24],
    iconAnchor: [12, 12]
});

async function setTouringMap() {

    window.mapMode = "touring";

    await fetch("/touring/start");

    if (map) {
        map.remove();
        map = null;
    }

    document.getElementById("map").innerHTML = "";

    map = L.map("map").setView([47.1625, 19.5033], 7);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);

    await loadTrees();

    document.getElementById("touringButton").innerText = "Budapest";
}

function setBudapestMap() {

    window.mapMode = "budapest";

    if (map) {
        map.remove();
        map = null;
    }

    document.getElementById("map").innerHTML = "";

    map = L.map("map").setView([47.4979, 19.0402], 12);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap"
    }).addTo(map);

    document.getElementById("touringButton").innerText = "Touring";
}

async function loadTrees() {

    const res = await fetch("/trees");
    const data = await res.json();

    console.log("TREES:", data);

    treeMarkers.forEach(m => map.removeLayer(m));
    treeMarkers = [];

    data.forEach(point => {

        const marker = L.marker([point.lat, point.lon], {
            icon: treeIcon
        }).addTo(map);

        treeMarkers.push(marker);
    });
}

/* CRITICAL: expose functions globally */
window.toggleTouring = function () {
    if (window.mapMode === "touring") {
        setBudapestMap();
    } else {
        setTouringMap();
    }
};

window.setTouringMap = setTouringMap;
window.setBudapestMap = setBudapestMap;