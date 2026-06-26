let playerMarker = null;

const playerIcon = L.icon({
    iconUrl: "/static/assets/player.png",
    iconSize: [48, 48],
    iconAnchor: [24, 24]
});

window.setPlayerPosition = function (lat, lng) {

    if (!window.map) return;

    if (!playerMarker) {
        playerMarker = L.marker([lat, lng], {
            icon: playerIcon,
            pane: "playerPane"
        }).addTo(window.map);
    } else {
        playerMarker.setLatLng([lat, lng]);
    }
};