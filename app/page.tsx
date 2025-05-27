"use client";
import {
  Marker,
  AdvancedMarker,
  APIProvider,
  Map,
  MapMouseEvent,
  MapControl,
} from "@vis.gl/react-google-maps";
import Image from "next/image";
import { useState } from "react";
import { format } from "date-fns";
import LocationSubmitComponent from "./LocationSubmitComponent";

const GMAPS_API: string = process.env.NEXT_PUBLIC_GMAPS_API || "";
const TRANSPORT_URL: string = process.env.NEXT_PUBLIC_TRANSPORT_URL || "";
const TRANSPORT_TOKEN = process.env.NEXT_PUBLIC_TRANSPORT_TOKEN || "";
const mapHeight = "100vh";
const containerStyle = { width: "100vw", height: mapHeight };
const position = { lat: 11.4478283, lng: 77.7262866 };

export default function Home() {
  return (
    <APIProvider apiKey={GMAPS_API}>
      <Map style={containerStyle} defaultZoom={9} defaultCenter={position}>
        <MarkerComponent />
      </Map>
    </APIProvider>
  );
}

const MarkerComponent = () => {
  const [markerPosition, setMarkerPosition] = useState(position);
  const [time, setTime] = useState<string>("");
  const [currentTime, setCurrentTime] = useState(false);
  const [token, setToken] = useState(TRANSPORT_TOKEN);
  const [isLoading, setIsLoading] = useState(false);

  const handlePositionChange = (event: google.maps.MapMouseEvent) => {
    if (!event) return;
    const lng = event.latLng && event.latLng.lng();
    const lat = event.latLng && event.latLng.lat();

    if (lat && lng) setMarkerPosition({ lng, lat });
  };

  const submitLocation = async () => {
    try {
      const gpsId = "TEST_01";

      const formattedDate = currentTime
        ? format(new Date(), "yyyy-MM-dd HH:mm:ss")
        : format(new Date(time), "yyyy-MM-dd HH:mm:ss");

      setIsLoading(true);
      const reqData = {
        gpsId,
        lat: markerPosition.lat,
        lon: markerPosition.lng,
        speed: 40,
        course: 0,
        time: formattedDate,
        ign: 1,
        vno: "KL-07-8945",
        addr: "NIL",
      };
      const response = await fetch(`${TRANSPORT_URL}/locations/v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(reqData),
      });
      const data = await response.text();
      console.log(data, "response");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Marker
        position={markerPosition}
        draggable
        onDrag={(event: google.maps.MapMouseEvent) =>
          handlePositionChange(event)
        }
      ></Marker>
      <MapControl position={google.maps.ControlPosition.RIGHT_TOP}>
        <LocationSubmitComponent
          submitLocation={submitLocation}
          markerPosition={markerPosition}
          setMarkerPosition={setMarkerPosition}
          setTime={setTime}
          time={time}
          setCurrentTime={setCurrentTime}
          currentTime={currentTime}
          token={token}
          setToken={setToken}
          isLoading={isLoading}
        />
      </MapControl>
    </>
  );
};
