import * as maptilersdk from "@maptiler/sdk";

export function initializeMap(coordinates, maptilerApiKey) {
    maptilersdk.config.apiKey = maptilerApiKey;

    // Create the map
    const map = new maptilersdk.Map({
        container: "map", // ID of the div where the map will render
        style: maptilersdk.MapStyle.STREETS,
        center: coordinates, // Starting position [lng, lat]
        zoom: 12, // Starting zoom level
    });

    // Add a marker to the map
    new maptilersdk.Marker()
        .setLngLat(coordinates)
        .addTo(map);
}
