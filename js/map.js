        // Geographical center of the US is 39.8283,-98.5795
        const map = L.map('map', {
            center: [37.3,-77.8],
            zoom: 5,
            minZoom: 3
        });
<!-- Leaflet JS Library-->
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
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

        // Complete official chapter list
        const collegiateData = [
            {
                id: "kappa",
                name: "University of North Carolina at Chapel Hill",
                subtitle: "Cryptik Kappa Chapter",
                exists: true,
                active: false,
                founded: "October 31, 2003",
                locationName: "103 South Building, Chapel Hill, North Carolina",
                coordinates: [35.9049,-79.0469],
                logo: "images/pspshield.png",
                bio: "Cryptik Kappa Chapter established at UNC Chapel Hill.",
                mapsLink: "https://maps.google.com/?q=103+South+Building,+Chapel+Hill,+North+Carolina"
            },
            {
                id: "mu",
                name: "University of North Carolina at Charlotte",
                subtitle: "Valiant Mu Chapter",
                exists: true,
                active: true,
                founded: "July 15, 2007",
                locationName: "9201 University City Blvd, Charlotte, North Carolina",
                coordinates: [35.3071,-80.7352],
                logo: "images/pspshield.png",
                bio: "Active chapter fostering leadership and brotherhood at UNC Charlotte.",
                mapsLink: "https://maps.google.com/?q=9201+University+City+Blvd,+Charlotte,+North+Carolina"
            },
            {
                id: "pi",
                name: "University of North Carolina at Greensboro",
                subtitle: "Prodigal Pi Chapter",
                exists: true,
                active: true,
                founded: "November 30, 2010",
                locationName: "203 Foust Building, Greensboro, North Carolina",
                coordinates: [36.0682,-79.8102],
                logo: "images/pspshield.png",
                bio: "Active pillar chapter driving multicultural leadership at UNC Greensboro.",
                mapsLink: "https://maps.google.com/?q=203+Foust+Building,+Greensboro,+North+Carolina"
            },
            
            // =========================
            // Expansion Institutions
            // =========================

            {
                id: "ncatsu",
                name: "North Carolina Agricultural and Technical State University",
                subtitle: "Expansion Candidate",
                exists: false,
                active: false,
                founded: "",
                locationName: "1601 East Market Street, Greensboro, North Carolina",
                coordinates: [36.0756,-79.7745],
                logo: "images/pspexpansion.PNG",
                bio: "Largest historically Black university in the United States.",
                mapsLink: "https://maps.google.com/?q=1601+East+Market+Street,+Greensboro,+North+Carolina"
            },
    {
        id: "guilford",
        name: "Guilford College",
        subtitle: "Minimal / No Greek Life",
        exists: false,
        active: false,
        founded: "",
        locationName: "5800 West Friendly Avenue, Greensboro, North Carolina",
        coordinates: [36.0927,-79.8920],
        logo: "images/pspexpansion.PNG",
        bio: "Private liberal arts college in Greensboro with minimal Greek life.",
        mapsLink: "https://maps.google.com/?q=5800+West+Friendly+Avenue,+Greensboro,+North+Carolina"
    }); 
