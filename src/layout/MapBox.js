import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import * as parkDate from "../data/skateboard-parks.json";

const Mapbox = () => {
    const [viewport, setViewport] = useState({
        latitude: 45.4211,
        longitude: -75.6903,
        width: "100%",
        height: "50vh", 
        zoom: 10
    });
    
    const [selectedPark, setSelectedPark] = useState(null);

    useEffect(() => {
        const listener = e => {
          if (e.key === "Escape") {
            setSelectedPark(null);
          }
        };
        window.addEventListener("keydown", listener);

        return () => {
          window.removeEventListener("keydown", listener);
        };
    }, []);

    return (
        <div className="w-full h-full max-h-[calc(100vh-100px)] overflow-hidden rounded-lg">
          <ReactMapGL 
            {...viewport}
            mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            onViewportChange={viewport => {
              setViewport(viewport);
            }}
          >
            {parkDate.features.map(park => (
              <Marker
                key={park.properties.PARK_ID}
                latitude={park.geometry.coordinates[1]}
                longitude={park.geometry.coordinates[0]}
              >
                <button
                  className="bg-none border-none cursor-pointer"
                  onClick={e => {
                    e.preventDefault();
                    setSelectedPark(park);
                  }}
                >
                  <img src="icons8-car-30.png" alt="Car" />
                </button>
              </Marker>
            ))}

            {selectedPark ? (
              <Popup
                latitude={selectedPark.geometry.coordinates[1]}
                longitude={selectedPark.geometry.coordinates[0]}
                onClose={() => {
                  setSelectedPark(null);
                }}
              >
                <div>
                  <h1 className="text-center text-black-100 font-bold mt-2 border-b border-gray-300">VEHICLE INFORMATION ID {selectedPark.properties.CAR_ID}</h1>
                  <div className="text-gray-600">
                    <p>Driver: {selectedPark.driver.name}</p>
                    <p>Time: {selectedPark.properties.TIME}</p>
                    <p>Latitude: {selectedPark.geometry.coordinates[1]}</p>
                    <p>Longitude: {selectedPark.geometry.coordinates[0]}</p>
                    <p>Valid: {selectedPark.properties.VALID}</p>
                    <p>Accuracy: {selectedPark.properties.ACCURACY}km</p>
                    <p>Speed: {selectedPark.properties.SPEED}</p>
                    <p>Address: {selectedPark.properties.ADDRESS}</p>
                    <p>Protocol: {selectedPark.properties.PROTOCOL}</p>
                    <p>Battery Level: {selectedPark.properties.FUEL_LEVEL}</p>
                  </div>
               </div>
              </Popup>
            ) : null}
          </ReactMapGL>
        </div>
    );
}

export default Mapbox;
