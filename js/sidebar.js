console.log("SIDEBAR FILE LOADED 11:09PM");

const sidebarList = document.getElementById('sidebarList');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sidebar = document.getElementById('sidebar');
const sidebarToggle = document.getElementById('sidebarToggle');

const clearSelectionBtn = document.getElementById('clearSelectionBtn');
const selectedCount = document.getElementById('selectedCount');

let currentFilter = 'all';
let selectedColleges = new Set();


// SIDEBAR COLLAPSE BUTTON
sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');

    sidebarToggle.innerText =
        sidebar.classList.contains('collapsed')
        ? '➔'
        : '❮';
});


// BUILD SIDEBAR
function renderSidebar() {

    const query = searchInput.value.toLowerCase().trim();

    sidebarList.innerHTML = '';

    selectedCount.innerText =
        `Selected: ${selectedColleges.size}`;


    collegiateData.forEach(college => {


        const matchesSearch =
            college.name.toLowerCase().includes(query) ||
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
            matchesFilter =
                college.exists === true &&
                college.active === true;
        }

        else if (currentFilter === 'inactive') {
            matchesFilter =
                college.exists === true &&
                college.active === false;
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



        // HANDLE MARKERS
        if (isVisible) {

            if (!map.hasLayer(markerObj.marker)) {
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



            const checkbox =
                card.querySelector('.college-select');



            // STOP CHECKBOX FROM OPENING PROFILE
            checkbox.addEventListener("click", e => {
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



            // CLICK CARD OPENS PROFILE
            card.addEventListener('click', () => {

                focusLocation(college,true);

            });



            sidebarList.appendChild(card);



        } else {


            if (map.hasLayer(markerObj.marker)) {

                map.removeLayer(markerObj.marker);

            }

        }


    });

}



// OPEN PROFILE LOCATION
function focusLocation(college, triggerPopup=true) {


    const targetZoom = 13;

    const markerObj =
        markerMap.get(college.id);



    const latLng =
        L.latLng(college.coordinates);



    map.flyTo(
        latLng,
        targetZoom,
        {
            duration:1.2
        }
    );



    document
    .querySelectorAll('.sidebar-card')
    .forEach(card => {

        card.classList.remove('active-card');

    });



    const selectedCard =
        document.getElementById(
            `sidebar-card-${college.id}`
        );


    if(selectedCard){

        selectedCard.classList.add('active-card');

    }



    if(triggerPopup && markerObj){

        markerObj.marker.openPopup();

    }

}




// ZOOM TO CHECKED ITEMS
function zoomToSelected(){

    const selectedMarkers=[];


    selectedColleges.forEach(id=>{


        const markerObj =
            markerMap.get(id);


        if(markerObj){

            selectedMarkers.push(
                markerObj.marker.getLatLng()
            );

        }


    });



    if(selectedMarkers.length===0){

        return;

    }



    if(selectedMarkers.length===1){


        map.flyTo(
            selectedMarkers[0],
            13,
            {
                duration:1
            }
        );


        return;

    }



    const bounds =
        L.latLngBounds(selectedMarkers);



    map.fitBounds(
        bounds,
        {
            padding:[60,60],
            animate:true
        }
    );


}




// SHOW/HIDE SELECTED MARKERS
function updateSelectionVisibility(){


    collegiateData.forEach(college=>{


        const markerObj =
            markerMap.get(college.id);



        if(!markerObj) return;



        if(
            selectedColleges.size===0 ||
            selectedColleges.has(college.id)
        ){


            if(!map.hasLayer(markerObj.marker)){

                markerObj.marker.addTo(map);

            }


        } else {


            if(map.hasLayer(markerObj.marker)){

                map.removeLayer(markerObj.marker);

            }


        }


    });


}




// SEARCH
searchInput.addEventListener(
    'input',
    renderSidebar
);




// FILTER BUTTONS
filterButtons.forEach(btn=>{


    btn.addEventListener('click',e=>{


        filterButtons.forEach(b=>{

            b.classList.remove('active');

        });



        e.target.classList.add('active');



        currentFilter =
            e.target.dataset.filter;



        renderSidebar();


    });


});





// CLEAR SELECTION
clearSelectionBtn.addEventListener('click',()=>{


    selectedColleges.clear();



    currentFilter="all";



    filterButtons.forEach(btn=>{


        btn.classList.toggle(
            "active",
            btn.dataset.filter==="all"
        );


    });



    updateSelectionVisibility();



    selectedCount.innerText =
        `Selected: ${selectedColleges.size}`;



    renderSidebar();



    map.flyTo(
        [37.3,-77.8],
        5,
        {
            duration:1
        }
    );


});





// START
window.addEventListener(
    "load",
    ()=>{
        renderSidebar();
    }
);
