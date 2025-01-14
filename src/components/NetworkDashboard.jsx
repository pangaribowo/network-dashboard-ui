import React, { useState, useContext, createContext } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Bell, Wifi, AlertTriangle, Moon, Sun, Download, Filter, Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Slider
} from "@/components/ui/slider";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

// Create theme context
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {}
});

// Bandwidth Priority Control Component
const BandwidthPriorityControl = ({ device, onPriorityChange }) => {
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">Bandwidth Priority</span>
        <span className="text-sm text-gray-500">{device.priority}%</span>
      </div>
      <Slider
        defaultValue={[device.priority]}
        max={100}
        step={10}
        onValueChange={(value) => onPriorityChange(device.id, value[0])}
        className="w-full"
      />
    </div>
  );
};

// Device Filter Component
const DeviceFilter = ({ onFilterChange, currentFilter }) => {
  return (
    <Select onValueChange={onFilterChange} defaultValue={currentFilter}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Devices</SelectItem>
        <SelectItem value="online">Online</SelectItem>
        <SelectItem value="warning">Warning</SelectItem>
        <SelectItem value="offline">Offline</SelectItem>
      </SelectContent>
    </Select>
  );
};

// Main Dashboard Component
const NetworkDashboard = () => {
  const [isDark, setIsDark] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('all');
  
  // Enhanced device data with priority
  const [connectedDevices, setConnectedDevices] = useState([
    { id: 1, name: 'Router-Main', status: 'Online', ip: '192.168.1.1', priority: 80 },
    { id: 2, name: 'Switch-Floor1', status: 'Online', ip: '192.168.1.2', priority: 60 },
    { id: 3, name: 'AP-Conference', status: 'Warning', ip: '192.168.1.3', priority: 40 },
    { id: 4, name: 'Server-Main', status: 'Offline', ip: '192.168.1.4', priority: 20 }
  ]);

  const bandwidthData = [
    { time: '12:00', usage: 65 },
    { time: '12:05', usage: 72 },
    { time: '12:10', usage: 85 },
    { time: '12:15', usage: 78 },
    { time: '12:20', usage: 90 },
  ];

  // Handle priority change
  const handlePriorityChange = (deviceId, newPriority) => {
    setConnectedDevices(devices =>
      devices.map(device =>
        device.id === deviceId
          ? { ...device, priority: newPriority }
          : device
      )
    );
  };

  // Filter devices based on status
  const filteredDevices = connectedDevices.filter(device => 
    deviceFilter === 'all' || device.status.toLowerCase() === deviceFilter.toLowerCase()
  );

  // Calculate device distribution for pie chart
  const deviceDistribution = Object.entries(
    connectedDevices.reduce((acc, device) => {
      acc[device.status] = (acc[device.status] || 0) + 1;
      return acc;
    }, {})
  ).map(([status, count]) => ({ status, count }));

  const statusColors = {
    Online: '#22c55e',
    Warning: '#eab308',
    Offline: '#ef4444'
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="p-6">
        {/* Header with Theme Toggle and Filters */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Network Dashboard</h1>
          <div className="flex items-center space-x-4">
            <DeviceFilter onFilterChange={setDeviceFilter} currentFilter={deviceFilter} />
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bandwidth Monitor */}
          <div className={`p-4 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-semibold mb-4">Bandwidth Usage</h2>
            <LineChart width={500} height={300} data={bandwidthData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
              <XAxis 
                dataKey="time" 
                stroke={isDark ? '#9ca3af' : '#4b5563'}
              />
              <YAxis 
                stroke={isDark ? '#9ca3af' : '#4b5563'}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: isDark ? '#1f2937' : 'white',
                  border: 'none',
                  borderRadius: '0.375rem'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="usage" 
                stroke="#2563eb" 
                strokeWidth={2}
              />
            </LineChart>
          </div>

          {/* Device Distribution */}
          <div className={`p-4 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-semibold mb-4">Device Distribution</h2>
            <PieChart width={500} height={300}>
              <Pie
                data={deviceDistribution}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {deviceDistribution.map((entry, index) => (
                  <Cell key={index} fill={statusColors[entry.status]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Connected Devices with Priority Control */}
          <div className={`p-4 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Connected Devices</h2>
              <button
                onClick={() => {/* Export logic */}}
                className="flex items-center space-x-2 px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
            <div className="space-y-4">
              {filteredDevices.map((device) => (
                <div 
                  key={device.id} 
                  className={`p-4 rounded-lg ${
                    isDark ? 'bg-gray-700' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Wifi className={
                        device.status === 'Online' 
                          ? 'text-green-500' 
                          : device.status === 'Warning'
                          ? 'text-yellow-500'
                          : 'text-red-500'
                      } />
                      <div>
                        <p className="font-medium">{device.name}</p>
                        <p className="text-sm text-gray-500">{device.ip}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      device.status === 'Online' 
                        ? 'bg-green-100 text-green-800' 
                        : device.status === 'Warning'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {device.status}
                    </span>
                  </div>
                  <BandwidthPriorityControl 
                    device={device}
                    onPriorityChange={handlePriorityChange}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Section */}
          <div className={`p-4 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className="text-lg font-semibold mb-4">Recent Alerts</h2>
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Unusual Traffic Detected</AlertTitle>
                <AlertDescription>
                  High bandwidth usage from AP-Conference
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkDashboard;