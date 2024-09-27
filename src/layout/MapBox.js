import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import axios from 'axios';
import * as parkData from '../data/skateboard-parks.json';
import { SearchOutlined } from "@ant-design/icons";
import VehicleInfoPopup from "./VehicleInfo";

const MapBox = ({ selectedDriver, routeCoords }) => {
    const mapRef = useRef();
    const [viewport, setViewport] = useState({
        latitude: 45.4211,
        longitude: -75.6903,
        width: "100%",
        height: "80vh",
        zoom: 10
    });
    const [selectedPark, setSelectedPark] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [filteredParks, setFilteredParks] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [imageMarker, setImageMarker] = useState(null);
    const [vehicleType, setVehicleType] = useState(''); 

    const getRoute = async (startCoords, endCoords) => {
        if (startCoords && endCoords) {
            const query = await axios.get(
                `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords.longitude},${startCoords.latitude};${endCoords.longitude},${endCoords.latitude}?steps=true&geometries=geojson&access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
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
        }
    };

    useEffect(() => {
        if (routeCoords.start && routeCoords.end && selectedDriver) {
            getRoute(routeCoords.start, routeCoords.end); 
            setViewport({
                ...viewport,
                latitude: routeCoords.start.latitude,
                longitude: routeCoords.start.longitude,
                zoom: 12
            });
            setImageMarker(routeCoords.start); 
      
            const selectedVehicle = parkData.features.find(
                (feature) => feature.driver.name === selectedDriver
            );
            setVehicleType(selectedVehicle.properties.VEHICLE_TYPE || '');
        }
    }, [routeCoords, selectedDriver]);

    const getVehicleIcon = (vehicleType) => {
        switch (vehicleType) {
            case "car":
                return "icons8-car-30.png";
            case "scooter":
                return "icons8-scooter-30.png";
            case "bus":
                return "icons8-bus-30.png";
            default:
                return "icons8-vehicle-30.png"; 
        }
    };

    const handleSearch = () => {
        if (!searchValue.trim()) {
            setFilteredParks([]);
            setIsSearchActive(false);
            setSelectedPark(null);
            setViewport({
                ...viewport,
                latitude: 45.4211,
                longitude: -75.6903,
                zoom: 10
            });
            return;
        }

        const filtered = parkData.features.filter(park =>
            park.properties.CAR_ID.toString().includes(searchValue) ||
            park.driver.name.toLowerCase().includes(searchValue.toLowerCase())
        );
        setFilteredParks(filtered);
        setIsSearchActive(true);

        if (filtered.length > 0) {
            const car = filtered[0]; 
            setViewport({
                ...viewport,
                latitude: car.geometry.coordinates[1], 
                longitude: car.geometry.coordinates[0],
                zoom: 12
            });
            setSelectedPark(car); 
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="w-full h-full max-h-[calc(100vh-100px)] overflow-hidden rounded-lg relative">
            <div className="absolute top-4 right-4 flex z-10">
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => { setSearchValue(e.target.value); handleSearch(); }}
                    onKeyPress={handleKeyPress}
                    placeholder="Tìm kiếm theo ID và tên tài xế"
                    className="p-2 w-[350px] rounded-l-lg shadow-md border border-gray-300"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-r-lg shadow-md flex items-center justify-center"
                >
                    <SearchOutlined style={{ fontSize: '20px' }} />
                </button>
            </div>

            <ReactMapGL
                {...viewport}
                ref={mapRef}
                mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                onViewportChange={nextViewport => setViewport(nextViewport)}
            >
                {imageMarker && (
                    <Marker latitude={imageMarker.latitude} longitude={imageMarker.longitude}>
                        <img
                            src={getVehicleIcon(vehicleType)} 
                            alt={`${vehicleType} icon`}
                        />
                    </Marker>
                )}

                {parkData.features.map(park => {
                    const isSearchedCar = isSearchActive && filteredParks.some(filteredPark => filteredPark.properties.CAR_ID === park.properties.CAR_ID);

                    return (
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
                                <img
                                    src={getVehicleIcon(park.properties.VEHICLE_TYPE)}
                                    alt={park.properties.VEHICLE_TYPE}
                                    style={{
                                        boxShadow: isSearchedCar ? '0px 0px 15px 5px yellow' : 'none',
                                        borderRadius: '50%'
                                    }} />
                            </button>
                        </Marker>
                    );
                })}

                <VehicleInfoPopup park={selectedPark} onClose={() => setSelectedPark(null)} />
            </ReactMapGL>
        </div>
    );
};

export default MapBox;
