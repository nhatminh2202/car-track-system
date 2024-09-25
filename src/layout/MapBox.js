import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import axios from 'axios';
import * as parkData from '../data/skateboard-parks.json';

const MapBox = ({ selectedDriver }) => {
    const mapRef = useRef();
    const [viewport, setViewport] = useState({
        latitude: 45.4211,
        longitude: -75.6903,
        width: "100%",
        height: "80vh",
        zoom: 10
    });
    const [selectedPark, setSelectedPark] = useState(null);
    
    /*  vế 1: Tọa độ của đích
        vế 2: Tọa độ của điểm bắt đầu
    */

    const getRoute = async (destLat, destLng) => {
        const query = await axios.get(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${viewport.longitude},${viewport.latitude};${destLng},${destLat}?steps=true&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
        );
        const route = query.data.routes[0].geometry;

        if (mapRef.current) {
            const map = mapRef.current.getMap();
            if (!map.getSource('route')) {
                map.addSource('route', {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: route
                    }
                });
            } else {
                map.getSource('route').setData({
                    type: 'Feature',
                    properties: {},
                    geometry: route
                });
            }

            if (!map.getLayer('route')) {
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': 'blue',
                        'line-width': 2
                    }
                });
            }
        }
    };

    useEffect(() => {
        const listener = e => {
            if (e.key === "Escape") {
                setSelectedPark(null);
            }
        };

        window.addEventListener("keydown", listener);

        if (selectedDriver) {
            const park = parkData.features.find(park => park.driver.name === selectedDriver);
            if (park) {
                getRoute(park.geometry.coordinates[1], park.geometry.coordinates[0]); 
                setSelectedPark(park); 
                setViewport({
                    ...viewport,
                    latitude: park.geometry.coordinates[1],
                    longitude: park.geometry.coordinates[0],
                    zoom: 14
                });
            }
        }

        return () => {
            window.removeEventListener("keydown", listener);
        };

    }, [selectedDriver]);

    return (
        <div className="w-full h-full max-h-[calc(100vh-100px)] overflow-hidden rounded-lg">
            <ReactMapGL
                {...viewport}
                ref={mapRef}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={nextViewport => setViewport(nextViewport)}
            >
                {parkData.features.map(park => (
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
                            {park.properties.VEHICLE_TYPE === "car" ? (
                                <img src="icons8-car-30.png" alt="Car" />
                            ) : park.properties.VEHICLE_TYPE === "scooter" ? (
                                <img src="icons8-scooter-30.png" alt="Scooter" />
                            ) :  park.properties.VEHICLE_TYPE === "bus" ? (
                                <img src="icons8-bus-30.png" alt="Bus" />
                            ) : null
                            }
                        </button>
                    </Marker>
                ))}

                {selectedPark && (
                    <Popup
                        latitude={selectedPark.geometry.coordinates[1]}
                        longitude={selectedPark.geometry.coordinates[0]}
                        onClose={() => setSelectedPark(null)}
                    >
                        <div>
                            <h1 className="text-center text-black-100 font-bold mt-2 border-b border-gray-300">THÔNG TIN XE ID {selectedPark.properties.CAR_ID}</h1>
                            <div className="text-gray-600">
                                <p>Tài xế: {selectedPark.driver.name}</p>
                                <p>Thời gian: {selectedPark.properties.TIME}</p>
                                <p>Vĩ độ: {selectedPark.geometry.coordinates[1]}</p>
                                <p>Kinh độ: {selectedPark.geometry.coordinates[0]}</p>
                                <p>Tốc độ: {selectedPark.properties.SPEED}</p>
                                <p>Vị trí: {selectedPark.properties.ADDRESS}</p>
                                <p>Giao thức: {selectedPark.properties.PROTOCOL}</p>
                                <p>Xăng: {selectedPark.properties.FUEL_LEVEL}</p>
                            </div>
                        </div>
                    </Popup>
                )}
            </ReactMapGL>
        </div>
    );
};

export default MapBox;
