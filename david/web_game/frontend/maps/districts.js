async function loadDistricts() {

    if (!window.map) return;

    const res = await fetch("/touring/districts");
    const geojson = await res.json();

    if (districtLayer) {
        window.map.removeLayer(districtLayer);
    }

    districtLayer = L.geoJSON(geojson, {

        style: {
            color: "#1d6cff",
            weight: 2,
            fillColor: "#1d6cff",
            fillOpacity: 0.25
        },

        onEachFeature: function (feature, layer) {

            // 🟦 HOVER EFFECT
            layer.on("mouseover", () => {
                layer.setStyle({
                    fillOpacity: 0.45,
                    weight: 3
                });
            });

            layer.on("mouseout", () => {
                layer.setStyle({
                    fillOpacity: 0.25,
                    weight: 2
                });
            });

            layer.on("click", () => {

                const center = layer.getBounds().getCenter();
                        
                if (window.setPlayerPosition) {
                    window.setPlayerPosition(center.lat, center.lng);
                }
            
                // reset previous selection
                if (selectedDistrict) {
                    districtLayer.resetStyle(selectedDistrict);
                }
            
                // set new selection
                selectedDistrict = layer;
            
                layer.setStyle({
                    fillOpacity: 0.6,
                    color: "#00ffcc",
                    weight: 4
                });
            });
        }

    }).addTo(window.map);
}