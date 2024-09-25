import MapBox from "./layout/MapBox";
import Schedule from "./layout/Schedule";
import React, { useState } from 'react';

function App() {
    const [selectedDriver, setSelectedDriver] = useState(null);

    const handleDriverClick = (driver) => {
        setSelectedDriver(driver);
    };

    return (
        <div className="flex flex-col p-4 ml-3 mr-3">
            <MapBox selectedDriver={selectedDriver}/>
            <Schedule onDriverClick={handleDriverClick}/>
        </div>
    );
}

export default App;
