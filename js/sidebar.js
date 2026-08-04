console.log("SIDEBAR FILE LOADED");

const sidebarList = document.getElementById('sidebarList');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

let currentFilter = 'all';
let selectedColleges = new Set();
      
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    sidebarToggle.innerText = sidebar.classList.contains('collapsed') ? '➔' : '❮';
});

      
        function renderSidebar() {
            const query = searchInput.value.toLowerCase().trim();
            sidebarList.innerHTML = '';

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

const isVisible = matchesSearch && matchesFilter;
const markerObj = markerMap.get(college.id);

if (!markerObj) {
    console.warn("Missing marker:", college.id);
    return;
}

if (isVisible) {

if (markerObj && !map.hasLayer(markerObj.marker)) {
    markerObj.marker.addTo(map);
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

checkbox.addEventListener('click', (e) => {

    e.stopPropagation();

    if (checkbox.checked) {

        selectedColleges.add(college.id);

    } else {

        selectedColleges.delete(college.id);

    }

    console.log("Selected:", [...selectedColleges]);

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
    
        
        searchInput.addEventListener('input', renderSidebar);

filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        currentFilter = e.target.dataset.filter;
        renderSidebar();
    });
});


renderSidebar();
