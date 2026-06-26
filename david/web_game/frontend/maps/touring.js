window.map = null;
window.mapMode = "budapest";
window.teleportTargets = [];

/* ---------------- MAP CORE ---------------- */

function createMap(center, zoom, bounds) {

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

        // HARD LIMITS
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,

        minZoom: zoom,
        maxZoom: 18,

        worldCopyJump: false,     // IMPORTANT
        noWrap: true              // IMPORTANT (prevents horizontal wrapping)
    }).setView(center, zoom);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap",
        noWrap: true              // IMPORTANT (tiles also must not wrap)
    }).addTo(window.map);

    window.map.on("drag", () => {
        window.map.panInsideBounds(bounds, { animate: false });
    });

    window.map.on("zoomend", () => {
        window.map.panInsideBounds(bounds, { animate: false });
    });

    window.map.fitBounds(bounds, {
        padding: [0, 0]
    });

    // panes
    window.map.createPane("treesPane");
    window.map.getPane("treesPane").style.zIndex = 400;

    window.map.createPane("playerPane");
    window.map.getPane("playerPane").style.zIndex = 650;
}

/* ---------------- MODE SWITCH ---------------- */

const BUDAPEST_BOUNDS = [
    [47.35, 18.85],
    [47.62, 19.40]
];

window.setBudapestMap = async function () {

    window.mapMode = "budapest";

    createMap([47.4979, 19.0402], 12, BUDAPEST_BOUNDS);

    clearAllLayers();
};

const HUNGARY_BOUNDS = [
    [45.74, 16.11],
    [48.58, 22.90]
];

window.setTouringMap = async function () {

    window.mapMode = "touring";

    createMap([47.1625, 19.5033], 7, HUNGARY_BOUNDS);

    clearAllLayers();

    await fetch("/touring/start");

    await loadDistricts();
    await loadEdges();
    await loadTrees();

    if (window.setupTeleportSystem) {
        await window.setupTeleportSystem();
    }
};

/* ---------------- CLEAR ---------------- */

function clearAllLayers() {

    if (!window.map) return;

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