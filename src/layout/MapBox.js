import React, { useState, useEffect } from "react";
import ReactMapGL, { Marker, } from "react-map-gl";
import * as parkDate from "../data/skateboard-parks.json";
import { SearchOutlined } from "@ant-design/icons";
import VehicleInfoPopup from "./VehicleInfo";


const Mapbox = () => {
  const [viewport, setViewport] = useState({
    latitude: 45.4211,
    longitude: -75.6903,
    width: "100%",
    height: "120vw",
    zoom: 10
  });

  const [selectedPark, setSelectedPark] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredParks, setFilteredParks] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);


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

  const handleSearch = () => {
    const filtered = parkDate.features.filter(park =>
      park.properties.CAR_ID.toString().includes(searchValue) ||
      park.driver.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredParks(filtered);
    setIsSearchActive(true); // Kích hoạt chế độ tìm kiếm
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
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Tìm kiếm theo ID xe hoặc tên tài xế..."
          className="p-2 w-[250px] rounded-l-lg shadow-md border border-gray-300"
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
        mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        onViewportChange={viewport => {
          setViewport(viewport);
        }}
      >
        {parkDate.features.map(park => {
          // Kiểm tra xem có phải là xe được tìm kiếm không khi tìm kiếm đang kích hoạt
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
                  src="icons8-car-30.png"
                  alt="Car"
                  style={{
                    boxShadow: isSearchedCar ? '0px 0px 15px 5px yellow' : 'none', // Thêm bóng màu vàng nếu là xe được tìm kiếm và đang trong chế độ tìm kiếm
                    borderRadius: '50%'
                  }}
                />
              </button>
            </Marker>
          );
        })}

        {/* Sử dụng component VehicleInfoPopup */}
        <VehicleInfoPopup park={selectedPark} onClose={() => setSelectedPark(null)} />
      </ReactMapGL>
    </div>
  );
}

export default Mapbox;
