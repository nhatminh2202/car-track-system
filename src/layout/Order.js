import React, { useState } from 'react';
import Button from '../components/button';
import { PhoneOutlined, UserOutlined } from '@ant-design/icons';
import { ordersData } from '../data/orderData.js';

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState('Ongoing');

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-md">
      
      <div className="flex space-x-4 mb-4">
        <Button
          type={selectedTab === 'Ongoing' ? 'primary' : 'default'}
          onClick={() => handleTabChange('Ongoing')}
        >
          Ongoing
        </Button>
        <Button
          type={selectedTab === 'NextFiveDays' ? 'primary' : 'default'}
          onClick={() => handleTabChange('NextFiveDays')}
        >
          Next 5 Days
        </Button>
      </div>

      <div className="space-y-4">
        {ordersData[selectedTab].map((order) => (
          <div key={order.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-[10px] text-gray-500 italic">ID: {order.id}</p>
              <p className={`text-[12px] font-bold ${order.daysLeft.includes('Past') ? 'text-red-500' : 'text-green-500'}`}>{order.daysLeft}</p>
            </div>
            <p className="text-[20px] font-bold text-blue-700 mb-1">{order.product}</p>
            <p className="text-[14px] font-bold text-gray-500 mb-2">{order.plate}</p>
            <hr className="border-gray-300 border-solid mb-1" />
            <div className="flex items-center mt-2">
              <div className='flex items-center'>
                <UserOutlined />
                <p className="text-[14px] text-black ml-2">{order.driver.name}</p>
              </div>
              <div className='flex items-center ml-auto'>
                <PhoneOutlined />
                <p className="text-[14px] text-gray-500 ml-2">{order.driver.phone}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
