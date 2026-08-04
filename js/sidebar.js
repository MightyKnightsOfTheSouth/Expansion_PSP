console.log("SIDEBAR FILE LOADED 11:04PM");

const sidebarList = document.getElementById('sidebarList');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

const clearSelectionBtn = document.getElementById('clearSelectionBtn');
const selectedCount = document.getElementById('selectedCount');

let currentFilter = 'all';
let selectedColleges = new Set();

      
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebarToggle.innerText = sidebar.classList.contains('collapsed') ? '➔' : '❮';
});

      
        function renderSidebar() {
            const query = searchInput.value.toLowerCase().trim();
            sidebarList.innerHTML = '';
            selectedCount.innerText = `Selected: ${selectedColleges.size}`;

            collegiateData.forEach(college => {
                const matchesSearch = college.name.toLowerCase().includes(query) ||
                                      college.subtitle.toLowerCase().includes(query) ||
                                      college.locationName.toLowerCase().includes(query);

let matchesFilter = false;

if (currentFilter === 'all') {
    matchesFilter = true;
}
else if (currentFilter === 'existing') {
    matchesFilter = college.exists === true;
}
else if (currentFilter === 'active') {
    matchesFilter = college.exists === true && college.active === true;
}
else if (currentFilter === 'inactive') {
    matchesFilter = college.exists === true && college.active === false;
}
else if (currentFilter === 'expansion') {
    matchesFilter = college.exists === false;
}

                  const isVisible =
    matchesSearch &&
    matchesFilter;
                  
const markerObj = markerMap.get(college.id);

if (!markerObj) {
    console.warn("Missing marker:", college.id);
    return;
}

if (
    selectedColleges.size === 0 ||
    selectedColleges.has(college.id)
) {

    if (!map.hasLayer(markerObj.marker)) {
        markerObj.marker.addTo(map);
    }

} else {

    if (map.hasLayer(markerObj.marker)) {
        map.removeLayer(markerObj.marker);
    }

}

const card = document.createElement('div');

card.className = 'sidebar-card';

card.id = `sidebar-card-${college.id}`;

card.innerHTML = `
    <input 
        type="checkbox" 
        class="college-select"
        data-id="${college.id}"
        ${selectedColleges.has(college.id) ? "checked" : ""}
    >

    ${getSidebarCardHtml(college)}
`;

const checkbox = card.querySelector('.college-select');

checkbox.addEventListener("click", (e) => {

    e.stopPropagation();

});

checkbox.addEventListener("change", () => {

    if (checkbox.checked) {
        selectedColleges.add(college.id);
    } else {
        selectedColleges.delete(college.id);
    }

selectedCount.innerText =
    `Selected: ${selectedColleges.size}`;

updateSelectionVisibility();

zoomToSelected();

});
      
    card.addEventListener('click', () => {
        focusLocation(college, true);
    });

    sidebarList.appendChild(card);

} else {

if (markerObj && map.hasLayer(markerObj.marker)) {
    map.removeLayer(markerObj.marker);
}

}
            });
        }

        function focusLocation(college, triggerPopup = true) {
            const targetZoom = 13;
            const markerObj = markerMap.get(college.id);

            const latLng = L.latLng(college.coordinates);
            const containerHeight = map.getSize().y;
            const yOffset = (0.80- 0.50) * containerHeight;

            const pinPoint = map.project(latLng, targetZoom);
            const targetPoint = L.point(pinPoint.x, pinPoint.y- yOffset);
            const targetLatLng = map.unproject(targetPoint, targetZoom);

            map.flyTo(targetLatLng, targetZoom, {
                duration: 1.2
            });

            document.querySelectorAll('.sidebar-card').forEach(c => c.classList.remove('active-card'));
            const selectedCard = document.getElementById(`sidebar-card-${college.id}`);
            if (selectedCard) {
                selectedCard.classList.add('active-card');
                selectedCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }

            if (triggerPopup && markerObj) {
    markerObj.marker.openPopup();
            }
        }

function zoomToSelected() {

    const selectedMarkers = [];

    selectedColleges.forEach(id => {

        const markerObj = markerMap.get(id);

        if (markerObj) {
            selectedMarkers.push(markerObj.marker.getLatLng());
        }

    });

    if (selectedMarkers.length === 0) {
        return;
    }

    if (selectedMarkers.length === 1) {

        map.flyTo(
            selectedMarkers[0],
            13,
            {
                duration: 1
            }
        );

        return;
    }

    const bounds = L.latLngBounds(selectedMarkers);

    map.fitBounds(bounds, {
        padding: [60, 60],
        animate: true
    });

}


// SHOW ONLY SELECTED MARKERS

function updateSelectionVisibility() {

    collegiateData.forEach(college => {

        const markerObj = markerMap.get(college.id);

        if (!markerObj) return;


        if (
            selectedColleges.size === 0 ||
            selectedColleges.has(college.id)
        ) {

            if (!map.hasLayer(markerObj.marker)) {
                markerObj.marker.addTo(map);
            }

        } else {

            if (map.hasLayer(markerObj.marker)) {
                map.removeLayer(markerObj.marker);
            }

        }

    });

}


// CLEAR ALL SELECTIONS

clearSelectionBtn.addEventListener('click', () => {
      

    // Clear all selected colleges
selectedColleges.clear();

updateSelectionVisibility();


    // Return to ALL filter
    currentFilter = "all";

    // Highlight the ALL button again
    filterButtons.forEach(btn => {

        btn.classList.toggle(
            "active",
            btn.dataset.filter === "all"
        );

    });

    // Reset counter
    selectedCount.innerText = `Selected: ${selectedColleges.size}`;

    // Redraw sidebar and markers
    renderSidebar();

    // Zoom back to the default map view
    map.flyTo([37.3, -77.8], 5, {
        duration: 1
    });

});

// INITIAL LOAD

window.addEventListener("load", () => {
    renderSidebar();
});
