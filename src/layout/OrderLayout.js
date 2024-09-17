import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Orders from "./Order";

const OrderLayout = () => {
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
        <h1 className="font-bold text-3xl font-mono mb-4">Orders</h1>
        <Orders/>
      </div>
    </div>
  );
}

export default OrderLayout; 
