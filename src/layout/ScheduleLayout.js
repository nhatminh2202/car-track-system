import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Schedule from "./Schedule";

const ScheduleLayout = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex">
      <Sidebar onToggle={handleSidebarToggle} />
      <div
        className={`flex-grow p-6 bg-gray-100 transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-10" : "ml-64"
        }`}
      >
        <Schedule/>
      </div>
    </div>
  );
}

export default ScheduleLayout; 
