const hoverCard = document.getElementById('global-hover-card');

function getSidebarCardHtml(college) {

    const statusBadgeText = college.exists 
        ? (college.active ? 'Existing • Active' : 'Existing • Inactive') 
        : 'Expansion';

    const statusClass = college.exists 
        ? (college.active ? 'active-status' : 'inactive-status') 
        : 'expansion';


    return `
        <div class="card-header-line">
            <div class="card-title">${college.name}</div>
            <span class="status-badge ${statusClass}">
                ${statusBadgeText}
            </span>
        </div>

        <div class="card-subtitle">${college.subtitle}</div>

        <div class="card-location">
            📍 ${college.locationName}
        </div>
    `;
}



function getDetailProfileHtml(college) {

    const statusText = college.exists ? 'Existing' : 'Expansion';

    const statusClass = college.exists 
        ? (college.active ? 'active-status' : 'inactive-status') 
        : 'expansion';


    let statusBadgesHtml = `
        <div class="profile-status-bar">
            <span class="status-badge ${statusClass}">
                ${statusText}
            </span>
    `;


    if (college.exists) {

        const activityText = college.active ? 'Active' : 'Inactive';

        const activityClass = college.active 
            ? 'active-status' 
            : 'inactive-status';


        statusBadgesHtml += `
            <span class="status-badge ${activityClass}">
                ${activityText}
            </span>
        `;
    }


    statusBadgesHtml += `</div>`;


    let html = `
        ${statusBadgesHtml}

        <div class="logo-container">
            <img class="logo-img" 
                 src="${college.logo}" 
                 alt="${college.name}">
        </div>

        <h3 class="profile-header">
            ${college.name}
        </h3>

        <div class="profile-subtitle">
            ${college.subtitle}
        </div>
    `;


    return html;
}




// Hover card position helper

function updateHoverPosition(e) {

    const padding = 20;

    const cardWidth = hoverCard.offsetWidth || 280;

    const cardHeight = hoverCard.offsetHeight || 120;

    const viewportWidth = window.innerWidth;

    const viewportHeight = window.innerHeight;


    let left = e.clientX + 15;

    let top = e.clientY - 20;


    if (left + cardWidth > viewportWidth - padding) {
        left = e.clientX - cardWidth - 15;
    }


    if (top + cardHeight > viewportHeight - padding) {
        top = viewportHeight - cardHeight - padding;
    }


    if (top < padding) {
        top = padding;
    }


    hoverCard.style.left = `${left}px`;

    hoverCard.style.top = `${top}px`;
}
