import React from 'react';
import { Popup } from "react-map-gl";
import { CarOutlined, ClockCircleOutlined, EnvironmentOutlined, CheckCircleOutlined, AimOutlined, DashboardOutlined, HomeOutlined, ApiOutlined,  } from "@ant-design/icons";

const VehicleInfoPopup = ({ park, onClose }) => {
  if (!park) return null;

  return (
    <Popup
      latitude={park.geometry.coordinates[1]}
      longitude={park.geometry.coordinates[0]}
      onClose={onClose}
    >
      {/* <div>
        <h1 className="text-center text-black-100 font-bold mt-2 border-b border-gray-300">
          VEHICLE INFORMATION ID {park.properties.CAR_ID}
        </h1>
        <div className="text-gray-600">
          <p>Driver: {park.driver.name}</p>
          <p>Time: {park.properties.TIME}</p>
          <p>Latitude: {park.geometry.coordinates[1]}</p>
          <p>Longitude: {park.geometry.coordinates[0]}</p>
          <p>Valid: {park.properties.VALID}</p>
          <p>Accuracy: {park.properties.ACCURACY}km</p>
          <p>Speed: {park.properties.SPEED}</p>
          <p>Address: {park.properties.ADDRESS}</p>
          <p>Protocol: {park.properties.PROTOCOL}</p>
          <p>Battery Level: {park.properties.FUEL_LEVEL}</p>
        </div>
      </div> */}
      <div>
        <h2 className="text-xl font-bold text-blue-600 mb-4 border-b pb-2">
          VEHICLE INFORMATION
        </h2>
        <div className="space-y-2">
          <p className="flex items-center">
            <CarOutlined className="mr-2 text-blue-500" />
            <span className="font-semibold">ID:</span> {park.driver.name}
          </p>
          <p className="flex items-center">
            <ClockCircleOutlined className="mr-2 text-blue-500" />
            <span className="font-semibold">Time:</span> {park.properties.TIME}
          </p>
          <p className="flex items-center">
            <EnvironmentOutlined className="mr-2 text-blue-500" />
            <span className="font-semibold">Location:</span>
            {park.geometry.coordinates[1]}, {park.geometry.coordinates[0]}
          </p>
          <p className="flex items-center">
            <CheckCircleOutlined className="mr-2 text-blue-500" />
            <span className="font-semibold">Valid:</span> {park.properties.VALID}
          </p>
          <p className="flex items-center">
            <AimOutlined className="mr-2 text-blue-500" />
            <span className="font-semibold">Accuracy:</span> {park.properties.ACCURACY}km
          </p>
          <p className="flex items-center">
            <DashboardOutlined className="mr-2 text-blue-500" />
            <span className="font-semibold">Speed:</span> {park.properties.SPEED}
          </p>
          <p className="flex items-center">
            <HomeOutlined className="mr-2 text-blue-500" />
            <span className="font-semibold">Address:</span> {park.properties.ADDRESS}
          </p>
          <p className="flex items-center">
            <ApiOutlined className="mr-2 text-blue-500" />
            <span className="font-semibold">Protocol:</span> {park.properties.PROTOCOL}
          </p>
          <p className="flex items-center">
            {/* <BatteryOutlined className="mr-2 text-blue-500" /> */}
            <span className="font-semibold">Battery:</span> {park.properties.FUEL_LEVEL}
          </p>
        </div>
      </div>
    </Popup>
  );
};

export default VehicleInfoPopup;