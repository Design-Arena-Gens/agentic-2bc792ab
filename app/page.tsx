"use client";

import { useState } from "react";
import {
  Train,
  MapPin,
  Clock,
  Users,
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

interface TrainData {
  id: string;
  number: string;
  name: string;
  route: { from: string; to: string };
  departure: string;
  arrival: string;
  status: "on-time" | "delayed" | "cancelled";
  capacity: number;
  occupied: number;
  coaches: number;
}

export default function TrainManagementApp() {
  const [trains, setTrains] = useState<TrainData[]>([
    {
      id: "1",
      number: "12301",
      name: "Rajdhani Express",
      route: { from: "New Delhi", to: "Mumbai" },
      departure: "16:55",
      arrival: "08:35",
      status: "on-time",
      capacity: 1200,
      occupied: 980,
      coaches: 22,
    },
    {
      id: "2",
      number: "12951",
      name: "Mumbai Rajdhani",
      route: { from: "Mumbai", to: "New Delhi" },
      departure: "17:00",
      arrival: "08:35",
      status: "delayed",
      capacity: 1200,
      occupied: 1150,
      coaches: 22,
    },
    {
      id: "3",
      number: "12259",
      name: "Duronto Express",
      route: { from: "Sealdah", to: "New Delhi" },
      departure: "16:50",
      arrival: "09:55",
      status: "on-time",
      capacity: 1000,
      occupied: 750,
      coaches: 18,
    },
    {
      id: "4",
      number: "12431",
      name: "Trivandrum Rajdhani",
      route: { from: "Trivandrum", to: "New Delhi" },
      departure: "13:00",
      arrival: "11:00",
      status: "on-time",
      capacity: 1100,
      occupied: 890,
      coaches: 20,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrain, setSelectedTrain] = useState<TrainData | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"dashboard" | "trains" | "schedule">("dashboard");

  const [formData, setFormData] = useState({
    number: "",
    name: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
    capacity: "",
    coaches: "",
  });

  const filteredTrains = trains.filter(
    (train) =>
      train.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.number.includes(searchTerm) ||
      train.route.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      train.route.to.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTrain = () => {
    if (formData.number && formData.name && formData.from && formData.to) {
      const newTrain: TrainData = {
        id: Date.now().toString(),
        number: formData.number,
        name: formData.name,
        route: { from: formData.from, to: formData.to },
        departure: formData.departure,
        arrival: formData.arrival,
        status: "on-time",
        capacity: parseInt(formData.capacity) || 1000,
        occupied: 0,
        coaches: parseInt(formData.coaches) || 18,
      };
      setTrains([...trains, newTrain]);
      resetForm();
    }
  };

  const handleEditTrain = () => {
    if (selectedTrain && formData.number && formData.name) {
      setTrains(
        trains.map((train) =>
          train.id === selectedTrain.id
            ? {
                ...train,
                number: formData.number,
                name: formData.name,
                route: { from: formData.from, to: formData.to },
                departure: formData.departure,
                arrival: formData.arrival,
                capacity: parseInt(formData.capacity) || train.capacity,
                coaches: parseInt(formData.coaches) || train.coaches,
              }
            : train
        )
      );
      resetForm();
    }
  };

  const handleDeleteTrain = (id: string) => {
    setTrains(trains.filter((train) => train.id !== id));
  };

  const openEditForm = (train: TrainData) => {
    setSelectedTrain(train);
    setFormData({
      number: train.number,
      name: train.name,
      from: train.route.from,
      to: train.route.to,
      departure: train.departure,
      arrival: train.arrival,
      capacity: train.capacity.toString(),
      coaches: train.coaches.toString(),
    });
    setIsFormOpen(true);
  };

  const resetForm = () => {
    setFormData({
      number: "",
      name: "",
      from: "",
      to: "",
      departure: "",
      arrival: "",
      capacity: "",
      coaches: "",
    });
    setSelectedTrain(null);
    setIsFormOpen(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "on-time":
        return "text-green-600 bg-green-50";
      case "delayed":
        return "text-yellow-600 bg-yellow-50";
      case "cancelled":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const stats = {
    totalTrains: trains.length,
    onTime: trains.filter((t) => t.status === "on-time").length,
    delayed: trains.filter((t) => t.status === "delayed").length,
    totalCapacity: trains.reduce((sum, t) => sum + t.capacity, 0),
    totalOccupied: trains.reduce((sum, t) => sum + t.occupied, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Train className="w-8 h-8" />
              <h1 className="text-xl sm:text-2xl font-bold">Train Management</h1>
            </div>
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-primary-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {["dashboard", "trains", "schedule"].map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium capitalize ${
                  activeTab === tab
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs - Desktop */}
        <div className="hidden lg:flex space-x-4 mb-6">
          {["dashboard", "trains", "schedule"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 rounded-lg font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-primary-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Total Trains</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalTrains}</p>
                  </div>
                  <Train className="w-12 h-12 text-primary-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">On Time</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{stats.onTime}</p>
                  </div>
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Delayed</p>
                    <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.delayed}</p>
                  </div>
                  <AlertCircle className="w-12 h-12 text-yellow-600" />
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-md border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Occupancy</p>
                    <p className="text-3xl font-bold text-primary-600 mt-2">
                      {Math.round((stats.totalOccupied / stats.totalCapacity) * 100)}%
                    </p>
                  </div>
                  <Users className="w-12 h-12 text-primary-600" />
                </div>
              </div>
            </div>

            {/* Recent Trains */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Trains</h2>
              <div className="space-y-3">
                {trains.slice(0, 4).map((train) => (
                  <div
                    key={train.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                      <Train className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {train.number} - {train.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {train.route.from} → {train.route.to}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize w-fit ${getStatusColor(
                        train.status
                      )}`}
                    >
                      {train.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Trains Tab */}
        {activeTab === "trains" && (
          <div className="space-y-6">
            {/* Search and Add */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trains by name, number, or route..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setIsFormOpen(true);
                }}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Add Train</span>
              </button>
            </div>

            {/* Train List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredTrains.map((train) => (
                <div
                  key={train.id}
                  className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{train.name}</h3>
                      <p className="text-sm text-gray-600">Train #{train.number}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                        train.status
                      )}`}
                    >
                      {train.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">
                        {train.route.from} → {train.route.to}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">
                        Dep: {train.departure} | Arr: {train.arrival}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-700">
                        {train.occupied}/{train.capacity} passengers ({train.coaches} coaches)
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Occupancy</span>
                      <span>{Math.round((train.occupied / train.capacity) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all"
                        style={{ width: `${(train.occupied / train.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditForm(train)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeleteTrain(train.id)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-primary-600" />
              <h2 className="text-2xl font-bold text-gray-900">Train Schedule</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Train</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Route</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Departure</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Arrival</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {trains
                    .sort((a, b) => a.departure.localeCompare(b.departure))
                    .map((train) => (
                      <tr key={train.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">{train.name}</p>
                            <p className="text-sm text-gray-600">#{train.number}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {train.route.from} → {train.route.to}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">{train.departure}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{train.arrival}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                              train.status
                            )}`}
                          >
                            {train.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedTrain ? "Edit Train" : "Add New Train"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Train Number
                  </label>
                  <input
                    type="text"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., 12301"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Train Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Rajdhani Express"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <input
                      type="text"
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Origin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="text"
                      value={formData.to}
                      onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Destination"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
                    <input
                      type="time"
                      value={formData.departure}
                      onChange={(e) => setFormData({ ...formData, departure: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Arrival</label>
                    <input
                      type="time"
                      value={formData.arrival}
                      onChange={(e) => setFormData({ ...formData, arrival: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Coaches</label>
                    <input
                      type="number"
                      value={formData.coaches}
                      onChange={(e) => setFormData({ ...formData, coaches: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="18"
                    />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={selectedTrain ? handleEditTrain : handleAddTrain}
                  className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  {selectedTrain ? "Update" : "Add"} Train
                </button>
                <button
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
