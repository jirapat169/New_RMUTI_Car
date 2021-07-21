import React from "react";

function calculateAndDisplayRoute(directionsService, directionsRenderer, location) {
  directionsService
    .route({
      origin: { lat: location['start']['g'], lng: location['end']['g'] }, // A
      destination:{ lat: location['start']['i'], lng: location['end']['i'] }, // B
      travelMode: google.maps.TravelMode['DRIVING'],
    })
    .then((response) => {
      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}

const GGMapDirection = (props)=>{
  React.useEffect(() => {
    let rmutiLocation = { lat: 14.988319611169972, lng: 102.11773235118517 };
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("mapRenderDirection"), {
      zoom: 8,
      center: rmutiLocation,
    });
    directionsRenderer.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsRenderer, props?.location);
  }, []);

  return <React.Fragment>
     <div className="" id="mapRenderDirection" style={{ height: "400px" }}></div>
  </React.Fragment>
}

export default GGMapDirection