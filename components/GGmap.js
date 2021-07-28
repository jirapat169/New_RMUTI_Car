import React from "react";
import TextField from "@material-ui/core/TextField";

class AutocompleteDirectionsHandler {
  constructor(props) {
    this.setMapData = props.setMapData;
    this.map = props.map;
    this.originPlaceId = "";
    this.destinationPlaceId = "";
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsRenderer = new window.google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(props.map);
    const originInput = document.getElementById("origin-input");
    const destinationInput = document.getElementById("destination-input");
    const originAutocomplete = new window.google.maps.places.Autocomplete(
      originInput
    );
    originAutocomplete.setFields(["place_id"]);
    const destinationAutocomplete = new window.google.maps.places.Autocomplete(
      destinationInput
    );
    destinationAutocomplete.setFields(["place_id"]);
    this.setupPlaceChangedListener(originAutocomplete, "ORIG");
    this.setupPlaceChangedListener(destinationAutocomplete, "DEST");
  }

  setupPlaceChangedListener(autocomplete, mode) {
    autocomplete.bindTo("bounds", this.map);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert("โปรดเลือกสถานที่จากรายการที่แสดง");
        return;
      }
      if (mode === "ORIG") {
        this.originPlaceId = place.place_id;
      } else {
        this.destinationPlaceId = place.place_id;
      }
      this.route();
    });
  }

  route() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      this.setMapData([]);
      return;
    }
    const me = this;
    this.directionsService.route(
      {
        origin: { placeId: this.originPlaceId },
        destination: { placeId: this.destinationPlaceId },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          me.directionsRenderer.setDirections(response);
          this.setMapData(response.routes);
        } else {
          window.alert("ไม่มีเส้นทางทีท่านเลือก");
          this.setMapData([]);
        }
      }
    );
  }
}

const GGMap = (props) => {
  const [mapData, setMapData] = React.useState([]);

  React.useEffect(() => {
    let rmutiLocation = { lat: 14.988319611169972, lng: 102.11773235118517 };
    const map = new window.google.maps.Map(
      window.document.getElementById(`mapRender`),
      {
        mapTypeControl: false,
        zoom: 8,
        center: rmutiLocation,
      }
    );

    new AutocompleteDirectionsHandler({
      map: map,
      setMapData: (data) => {
        setMapData(data);
      },
    });
  }, []);

  React.useEffect(() => {
    if (mapData.length > 0) {
      console.log(mapData);
      props.dataGGmap &&
        props.dataGGmap({
          location: {
            start: mapData[0].legs[0].start_location,
            end: mapData[0].legs[0].end_location,
          },
          start: mapData[0].legs[0].start_address,
          end: mapData[0].legs[0].end_address,
          distance: mapData[0].legs[0].distance.text,
          time: mapData[0].legs[0].duration.text,
          cost: parseInt(mapData[0]["legs"][0]["distance"]["text"]) * 4,
        });
    }
  }, [mapData]);

  return (
    <>
      <h5>คำนวนค่าใช้จ่าย</h5>
      <div style={{ padding: "15px" }}>
        <div className="row">
          <div className="col-md-8">
            <div className="" id="mapRender" style={{ height: "400px" }}></div>
          </div>
          <div className="col-md-4">
            <div>
              <TextField
                id="origin-input"
                label="จุดเริ่มต้น"
                multiline
                rows={4}
                defaultValue=""
                variant="outlined"
                fullWidth
                margin="normal"
              />

              <TextField
                id="destination-input"
                label="จุดสิ้นสุด"
                multiline
                rows={4}
                defaultValue=""
                variant="outlined"
                fullWidth
                margin="normal"
              />
            </div>

            {(() => {
              if (mapData.length > 0) {
                return (
                  <div className="mb-3">
                    <h6>
                      <b>ระยะทางประมาณ : </b>
                      {mapData[0]["legs"][0]["distance"]["text"]}
                    </h6>
                    <h6>
                      <b>เวลาในการเดินทาง : </b>
                      {mapData[0]["legs"][0]["duration"]["text"]}
                    </h6>
                    <h6>
                      <b>ค่าใช้จ่ายประมาณ : </b>
                      {parseInt(mapData[0]["legs"][0]["distance"]["text"]) *
                        4}{" "}
                      บาท
                    </h6>
                  </div>
                );
              } else return <></>;
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default GGMap;
