// =============================
// Marker Creation
// =============================

const markerMap = new Map();


function loadMarkers() {


    collegiateData.forEach(college => {


        let markerImg;
        let pinBgColor;
        let pinBorderColor;


        // Expansion Candidate
        if (college.exists === false) {

            markerImg = "images/pspexpansion.PNG";
            pinBgColor = "#4b5563";
            pinBorderColor = "#374151";


        // Existing Active Chapter
        } else if (college.active === true) {

            markerImg = "images/pspexists.png";
            pinBgColor = "#15803d";
            pinBorderColor = "#166534";


        // Existing Inactive Chapter
        } else {

            markerImg = "images/pspexists.png";
            pinBgColor = "#780606";
            pinBorderColor = "#500404";

        }



        const customIcon = L.divIcon({

            html: `
                <div class="custom-pin-container"
                     style="--pin-bg:${pinBgColor};
                            --pin-border:${pinBorderColor};">

                    <div class="custom-pin-head"
                         style="
                         background-image:url('${markerImg}');
                         background-color:${pinBgColor};
                         ">
                    </div>

                </div>
            `,

            className: "",
            iconSize: [42,50],
            iconAnchor: [21,50]

        });



        const marker = L.marker(
            college.coordinates,
            {
                icon: customIcon
            }
        );



        markerMap.set(college.id,{
            marker: marker,
            data: college
        });



        marker.bindPopup(
            getDetailProfileHtml(college),
            {
                direction: "auto",
                offset: [0,-20],
                closeButton: false,
                autoPan: false
            }
        );



        marker.on("click", () => {

            focusLocation(college);

        });



        marker.on("mouseover", (e)=>{

            hoverCard.innerHTML = getSidebarCardHtml(college);

            hoverCard.style.display = "block";

            updateHoverPosition(e.originalEvent);

        });



        marker.on("mousemove",(e)=>{

            updateHoverPosition(e.originalEvent);

        });



        marker.on("mouseout",()=>{

            hoverCard.style.display = "none";

        });



        marker.on("popupopen",()=>{

            hoverCard.style.display = "none";

        });



        marker.addTo(map);


    });

}

loadMarkers();
