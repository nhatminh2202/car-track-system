import React, { useState, useRef } from "react";
import Button from "../components/button";
import ScheduleData from "../data/skateboard-parks.json";
import { UserOutlined } from "@ant-design/icons";
import { DatePicker } from 'antd';
import 'antd/dist/reset.css'; 
import moment from 'moment';

const Schedule = ({ onDriverClick }) => {
    const [viewMode, setViewMode] = useState('morning');
    const [selectedDate, setSelectedDate] = useState(moment().startOf('day')); 
    const [selectedDriver, setSelectedDriver] = useState(null);

    const scrollRef = useRef(null); 

    const totalHours = 24;
    const hoursArray = Array.from({ length: totalHours }, (_, index) => `${index.toString().padStart(2, '0')}:00`);

    const handleClick = (driverName, startCoords, endCoords) => {
        setSelectedDriver(driverName); 
        onDriverClick(driverName, startCoords, endCoords); 
    };
    

    const timeToIndex = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours + minutes / 60;
    };

    const formatTime = (time) => {
        const [hours, minutes] = time.split(':');
        return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-sans mb-4">Lịch trình</h1>
                <div className="flex items-center space-x-4">
                    <DatePicker
                        defaultValue={selectedDate}
                        format="YYYY-MM-DD"
                        className="mr-4"
                        style={{ width: '120px' }}
                    />
                    {['sáng', 'chiều', 'tối', 'đêm'].map((mode) => (
                        <Button
                            key={mode}
                            type={viewMode === mode ? 'primary' : 'default'}
                            onClick={() => setViewMode(mode)}
                        >
                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Schedule Table */}
            <div className="flex">
                {/* Fixed Plate and Merk columns */}
                <div className="flex-shrink-0">
                    <div className="flex">
                        {['Biển số xe', 'Hãng xe'].map((header) => (
                            <div key={header} className="font-bold w-[150px] text-blue-700 h-10 border-r border-b border-gray-300 flex items-center justify-center bg-white">
                                {header}
                            </div>
                        ))}
                    </div>
                    {ScheduleData.features.map((feature, index) => (
                        <div key={index} className="flex">
                            <div className="w-[150px] h-10 border-r border-b border-gray-300 flex items-center justify-center">
                                <div className="bg-gray-300 rounded-lg w-[80%] text-center">{feature.driver.plate}</div>
                            </div>
                            <div className="w-[150px] h-10 border-r border-b border-gray-300 flex items-center justify-center">
                                {feature.driver.merk}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex-grow overflow-hidden">
                    <div ref={scrollRef} className="overflow-x-auto" style={{ width: 'calc(110vw - 450px)' }}>
                        <div style={{ width: `${totalHours * 60}px` }}>
                            {/* Time headers */}
                            <div className="flex">
                                {hoursArray.map((hour, index) => (
                                    <div key={index} className="text-blue-700 text-center w-[60px] h-10 border-r border-b border-gray-300 flex items-center justify-center bg-white">
                                        {hour}
                                    </div>
                                ))}
                            </div>

                            {/* Schedule rows */}
                            {ScheduleData.features.map((feature, vehicleIndex) => (
                                <div key={vehicleIndex} className="relative h-10">
                                    {hoursArray.map((_, hourIndex) => (
                                    <div key={hourIndex} className="absolute top-0 w-[60px] h-full border-r border-b border-gray-300" style={{ left: `${hourIndex * 60}px` }} />
                                    ))}
                                    {feature.driver.schedule.map((schedule, scheduleIndex) => {
                                        const startIndex = timeToIndex(schedule.startTime);
                                        const endIndex = timeToIndex(schedule.endTime);
                                        const startPixels = startIndex * 60;
                                        const width = (endIndex - startIndex) * 60;
                                        return (
                                            <button
                                                key={scheduleIndex}
                                                className="absolute text-blue-700 border border-blue-700 bg-gray-200 bg-opacity-50 hover:bg-blue-700 hover:text-white hover:border-transparent h-8 top-1 overflow-hidden whitespace-nowrap flex items-center justify-center cursor-pointer rounded-full transition-all duration-300 ease-in-out"
                                                style={{
                                                    left: `${startPixels}px`,
                                                    width: `${width}px`,
                                                    borderRadius: "20px",
                                                }}
                                                title={`${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}`}
                                                onClick={() => handleClick(feature.driver.name, {longitude: schedule.longitudeStart, latitude: schedule.latitudeStart}, {longitude: schedule.longitudeEnd, latitude: schedule.latitudeEnd})}
                                            >
                                                {width > 30 && (
                                                    <>
                                                        <UserOutlined className="mr-3"/>
                                                        {feature.driver.name}
                                                    </>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Schedule;
