window.map = null;
window.mapMode = "budapest";

/* ---------------- MAP CORE ---------------- */

function createMap(center, zoom) {

    if (window.map) {
        window.map.remove();
        window.map = null;
    }

    const container = document.getElementById("map");
    if (!container) {
        console.error("Map container missing");
        return;
    }

    window.map = L.map(container, {
        inertia: true,
        zoomAnimation: true,
        fadeAnimation: true,
        maxZoom: 18,
        minZoom: 6
    }).setView(center, zoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap"
    }).addTo(window.map);
}

/* ---------------- MODE SWITCH ---------------- */

window.setBudapestMap = async function () {

    window.mapMode = "budapest";

    createMap([47.4979, 19.0402], 12);

    clearAllLayers();
};

window.setTouringMap = async function () {

    window.mapMode = "touring";

    createMap([47.1625, 19.5033], 7);

    clearAllLayers();

    await fetch("/touring/start");

    await loadDistricts();
    await loadEdges();
    await loadTrees();
};

/* ---------------- CLEAR ---------------- */

function clearAllLayers() {

    if (window.treeLayer) window.map.removeLayer(window.treeLayer);
    if (window.districtLayer) window.map.removeLayer(window.districtLayer);
    if (window.edgeLayer) window.map.removeLayer(window.edgeLayer);

    window.treeLayer = null;
    window.districtLayer = null;
    window.edgeLayer = null;
}

/* ---------------- INIT ---------------- */

window.addEventListener("load", () => {
    setTimeout(() => window.setBudapestMap(), 0);
});