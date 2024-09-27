import MapBox from "./layout/MapBox";
import Schedule from "./layout/Schedule";
import React, { useState } from 'react';

function App() {
    const [selectedDriver, setSelectedDriver] = useState(null);
    const [routeCoords, setRouteCoords] = useState({ start: null, end: null });

    const handleDriverClick = (driver, startCoords, endCoords) => {
        setSelectedDriver(driver);
        setRouteCoords({ start: startCoords, end: endCoords });
    };

    return (
        <div className="flex flex-col p-4 ml-3 mr-3">
            <MapBox selectedDriver={selectedDriver} routeCoords={routeCoords} />
            <Schedule onDriverClick={handleDriverClick} />
        </div>
    );
}

export default App;

