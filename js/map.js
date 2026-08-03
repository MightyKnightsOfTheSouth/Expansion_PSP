        // Geographical center of the US is 39.8283,-98.5795// Create Map
const map = L.map('map', {
    center: [37.3,-77.8],
    zoom: 5,
    minZoom: 3
});


// Dark-themed map canvas layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);
