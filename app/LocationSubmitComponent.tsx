"use client";

import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";

type PROPS_TYPES = {
  submitLocation: () => void;
  markerPosition: { lat: number; lng: number } | undefined;
  setMarkerPosition: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
  setTime: Dispatch<SetStateAction<string>>;
  time: string;
  currentTime: boolean;
  setCurrentTime: Dispatch<SetStateAction<boolean>>;
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
};

const LocationSubmitComponent = ({
  submitLocation,
  markerPosition,
  setMarkerPosition,
  time,
  setTime,
  currentTime,
  setCurrentTime,
  token,
  setToken,
  isLoading,
}: PROPS_TYPES) => {
  const handleCoordChange = (type: "lat" | "lng", value: string) => {
    if (!type || !value) return;

    const valueFloat = Number(value);

    if (!isNaN(valueFloat))
      setMarkerPosition((prev) => {
        const newData = { ...prev, [type]: valueFloat };
        return newData;
      });
  };

  return (
    <div className="w-96 p-5 bg-black/60 backdrop-blur-sm rounded-xl">
      <h2 className="text-xl font-bold text-center underline">
        Marker position
      </h2>

      <div className="flex gap-2 text-lg pt-4 justify-between items-baseline">
        <label>Lat: </label>
        <input
          value={markerPosition?.lat}
          className="outline-white outline-1 rounded-lg px-2 py-1 focus:outline-blue-300"
          type="number"
          onChange={(e) => handleCoordChange("lat", e.target.value)}
        />
      </div>

      <div className="flex gap-2 text-lg items-baseline mt-2 justify-between">
        <label>Lng: </label>
        <input
          className="outline-white outline-1 rounded-lg px-2 py-1 focus:outline-blue-300"
          value={markerPosition?.lng}
          type="number"
          onChange={(e) => handleCoordChange("lng", e.target.value)}
        />
      </div>

      <div className="flex gap-2 text-lg items-baseline mt-2 justify-between">
        <label>Token </label>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="outline-white outline-1 rounded-lg px-2 py-1 focus:outline-blue-300"
        />
      </div>

      <div className="flex gap-2 text-lg items-baseline mt-2 justify-between">
        <label>Time stamp</label>
        <input
          disabled={currentTime}
          type="datetime-local"
          className="outline-white outline-1 rounded-lg px-2 py-1 focus:outline-blue-300 disabled:outline-gray-400"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div className="flex gap-6 text-lg items-baseline mt-2">
        <label>Current time</label>
        <input
          className="scale-125"
          type="checkbox"
          onChange={(e) => setCurrentTime(e.target.checked)}
          checked={currentTime}
        />
      </div>

      <div className="flex gap-2 text-lg items-baseline mt-2 justify-between">
        <button
          className="ml-auto bg-blue-400 p-2"
          disabled={
            isLoading || !token || !markerPosition || (!currentTime && !time)
          }
          onClick={submitLocation}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default LocationSubmitComponent;
