let collegiateData = [];

fetch("data/chapters.json")
    .then(response => response.json())
    .then(data => {
        collegiateData = data;

        console.log("Chapters loaded:", collegiateData);

        loadMarkers();
        renderSidebar();
    })
    .catch(error => {
        console.error("Error loading chapters:", error);
    });
