import React, { useState, useEffect, useRef } from 'react';
import ReactMapGL, { Marker } from 'react-map-gl';
import axios from 'axios';
import * as parkData from '../data/skateboard-parks.json';
import { SearchOutlined } from "@ant-design/icons";
import VehicleInfoPopup from "./VehicleInfo";

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
    const [searchValue, setSearchValue] = useState("");
    const [filteredParks, setFilteredParks] = useState([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    
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
          zoom: 10
        });
      }
    }

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

  }, [selectedDriver]);

  const handleSearch = () => {
    if(!searchValue.trim()) {
      setFilteredParks([]);
      setIsSearchActive(false);
      setSelectedPark(null);
      setViewport({
        ...viewport,
        latitude: 45.4211, // Giá trị mặc định ban đầu
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
    setIsSearchActive(true); // Kích hoạt chế độ tìm kiếm

    if (filtered.length > 0) {
      const car = filtered[0]; // Lấy xe đầu tiên trong danh sách kết quả tìm kiếm
      setViewport({
        ...viewport,
        latitude: car.geometry.coordinates[1], // Cập nhật vị trí xe
        longitude: car.geometry.coordinates[0],
        zoom: 12 // Zoom vào vị trí xe
      });
      setSelectedPark(car); // Đặt xe được chọn để hiển thị popup thông tin
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
          onChange={(e) => {setSearchValue(e.target.value); handleSearch(); }}
          onKeyPress={handleKeyPress}
          placeholder="Tìm kiếm theo ID xe hoặc tên tài xế..."
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
                  getRoute(park.geometry.coordinates[1], park.geometry.coordinates[0]);
                }}
              >
                {park.properties.VEHICLE_TYPE === "car" ? (
                  <img
                    src="icons8-car-30.png"
                    alt="Car"
                    style={{
                      boxShadow: isSearchedCar ? '0px 0px 15px 5px yellow' : 'none', // Thêm bóng màu vàng nếu là xe được tìm kiếm và đang trong chế độ tìm kiếm
                      borderRadius: '50%'
                    }} />
                ) : park.properties.VEHICLE_TYPE === "scooter" ? (
                  <img
                    src="icons8-scooter-30.png"
                    alt="Scooter" style={{
                      boxShadow: isSearchedCar ? '0px 0px 15px 5px yellow' : 'none', // Thêm bóng màu vàng nếu là xe được tìm kiếm và đang trong chế độ tìm kiếm
                      borderRadius: '50%'
                    }} />
                ) : park.properties.VEHICLE_TYPE === "bus" ? (
                  <img src="icons8-bus-30.png"
                    alt="Bus"
                    style={{
                      boxShadow: isSearchedCar ? '0px 0px 15px 5px yellow' : 'none', // Thêm bóng màu vàng nếu là xe được tìm kiếm và đang trong chế độ tìm kiếm
                      borderRadius: '50%'
                    }} />
                ) : null
                }
              </button>
            </Marker>
          );
        })}

        {/* {selectedPark && (
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
        )} */}
        <VehicleInfoPopup park={selectedPark} onClose={() => setSelectedPark(null)} />

      </ReactMapGL>
    </div>
  );
};

export default MapBox;
