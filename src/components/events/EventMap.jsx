import React from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";

function EventMap(props) {
   const containerStyle = props.anEvent
      ? { width: "30rem", height: "25rem" }
      : { width: "45rem", height: "25rem" };

   const zoom = props.anEvent ? 8 : 3;

   const center = {
      lat: parseFloat(
         props.anEvent
            ? props.anEvent.metadata?.location.latitude
            : props.arrayOfMarkers[0].lat
      ),
      lng: parseFloat(
         props.anEvent
            ? props.anEvent.metadata?.location.longitude
            : props.arrayOfMarkers[0].lng
      ),
   };
   console.log(center);

   return (
      <React.Fragment>
         <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
            {props.anEvent && <Marker position={center}></Marker>}
            {props.arrayOfMarkers &&
               props.arrayOfMarkers.map((marker, i) =>{ return(
                      <Marker position={marker} key={"marker" + i}></Marker>
                  )})
               }
            <></>
         </GoogleMap>
      </React.Fragment>
   );
}

export default React.memo(EventMap);
