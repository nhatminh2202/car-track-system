import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Schedule from "./Schedule";
import MapBox from "./MapBox"

const MainLayout = () => {


  return ( 
    <div className="flex flex-col p-4 ml-3 mr-3">
        <MapBox/>
        <Schedule/>
    </div>
  );
}

export default MainLayout; 
