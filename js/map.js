        // Geographical center of the US is 39.8283,-98.5795
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

        const hoverCard = document.getElementById('global-hover-card');



        const markerMap = new Map();
        let currentFilter = 'all';
        
        function getSidebarCardHtml(college) {
            const statusBadgeText = college.exists ? (college.active ? 'Existing • Active' : 'Existing • Inactive') : 'Expansion';
            const statusClass = college.exists ? (college.active ? 'active-status' : 'inactive-status') : 'expansion';

            return `
                <div class="card-header-line">
                    <div class="card-title">${college.name}</div>
                    <span class="status-badge ${statusClass}">${statusBadgeText}</span>
                </div>
                <div class="card-subtitle">${college.subtitle}</div>
                <div class="card-location">📍 ${college.locationName}</div>
            `;
        }

        function getDetailProfileHtml(college) {
            const statusText = college.exists ? 'Existing' : 'Expansion';
            const statusClass = college.exists ? (college.active ? 'active-status' : 'inactive-status') : 'expansion';

            let statusBadgesHtml = `
                <div class="profile-status-bar">
                    <span class="status-badge ${statusClass}">${statusText}</span>
            `;

            if (college.exists) {
                const activityText = college.active ? 'Active' : 'Inactive';
                const activityClass = college.active ? 'active-status' : 'inactive-status';
                statusBadgesHtml += `<span class="status-badge ${activityClass}">${activityText}</span>`;
            }

            statusBadgesHtml += `</div>`;

            let html = `
                ${statusBadgesHtml}
                <div class="logo-container">
                    <img class="logo-img" src="${college.logo}" alt="${college.name}">
                </div>
                <h3 class="profile-header">${college.name}</h3>
                <div class="profile-subtitle">${college.subtitle}</div>
            `;

            if (college.exists && college.founded) {
                html += `
                    <div class="profile-section">
                        <div class="profile-label">Founded</div>
                        <div class="profile-value">${college.founded}</div>
                    </div>
                `;
            }

            html += `
                <div class="profile-section">
                    <div class="profile-label">Institution</div>
                    <div class="profile-value">${college.name}</div>
                </div>
                <div class="profile-section">
                    <div class="profile-label">Location</div>
                    <div class="profile-value">${college.locationName}</div>
                </div>
                <div class="profile-section">
                    <div class="profile-label">About</div>
                    <div class="profile-value">${college.bio}</div>
                </div>
                <a href="${college.mapsLink}" target="_blank" class="directions-btn">📍 Get Directions</a>
            `;

            return html;
        }

        collegiateData.forEach(college => {

    let markerImg;
    let pinBgColor;
    let pinBorderColor;

    if (college.exists === false) {
        // Expansion candidate
        markerImg = 'images/pspexpansion.PNG';
        pinBgColor = '#4b5563';
        pinBorderColor = '#374151';

    } else if (college.exists === true && college.active === true) {
        // Existing active chapter
        markerImg = 'images/pspexists.png';
        pinBgColor = '#15803d';
        pinBorderColor = '#166534';

    } else {
        // Existing inactive chapter
        markerImg = 'images/pspexists.png';
        pinBgColor = '#780606';
        pinBorderColor = '#500404';
    }

    const customIcon = L.divIcon({
        html: `
            <div class="custom-pin-container" style="--pin-bg:${pinBgColor};--pin-border:${pinBorderColor};">
                <div class="custom-pin-head" 
                     style="background-image:url('${markerImg}'); background-color:${pinBgColor};">
                </div>
            </div>
        `,
        className: '',
        iconSize: [42,50],
        iconAnchor: [21,50]
    });
            const marker = L.marker(college.coordinates, { icon: customIcon });
            markerMap.set(college.id, { marker, data: college });

            marker.bindPopup(getDetailProfileHtml(college), {
                direction: 'auto',
                offset: [0,-20],
                closeButton: false,
                autoPan: false
            });

            marker.on('click', () => {
                focusLocation(college);
            });

            marker.on('mouseover', (e) => {
                hoverCard.innerHTML = getSidebarCardHtml(college);
                hoverCard.style.display = 'block';
                updateHoverPosition(e.originalEvent);
            });

            marker.on('mousemove', (e) => {
                updateHoverPosition(e.originalEvent);
            });

            marker.on('mouseout', () => {
                hoverCard.style.display = 'none';
            });

            marker.on('popupopen', () => {
                hoverCard.style.display = 'none';
            });
        });

        function updateHoverPosition(e) {
            const padding = 20;
            const cardWidth = hoverCard.offsetWidth || 280;
            const cardHeight = hoverCard.offsetHeight || 120;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let left = e.clientX + 15;
            let top = e.clientY- 20;

            if (left + cardWidth > viewportWidth- padding) {
                left = e.clientX- cardWidth- 15;
            }

            if (top + cardHeight > viewportHeight- padding) {
                top = viewportHeight- cardHeight- padding;
            }

            if (top < padding) {
                top = padding;
            }

            hoverCard.style.left = `${left}px`;
            hoverCard.style.top = `${top}px`;
        }
