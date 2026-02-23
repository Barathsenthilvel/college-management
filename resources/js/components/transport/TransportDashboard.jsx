import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TransportDashboard() {
    const [routes, setRoutes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [showRouteModal, setShowRouteModal] = useState(false);
    const [showVehicleModal, setShowVehicleModal] = useState(false);

    // Form states
    const [newRoute, setNewRoute] = useState({
        route_name: '', start_location: '', end_location: '', fare: 0, status: 'active'
    });
    const [newVehicle, setNewVehicle] = useState({
        vehicle_number: '', driver_name: '', driver_contact: '', capacity: 40, route_id: '', status: 'active'
    });

    useEffect(() => {
        fetchRoutes();
        fetchVehicles();
    }, []);

    const fetchRoutes = async () => {
        try {
            const res = await axios.get('/api/transport/routes');
            setRoutes(res.data);
        } catch (error) {
            console.error('Error fetching routes');
        }
    };

    const fetchVehicles = async () => {
        try {
            const res = await axios.get('/api/transport/vehicles');
            setVehicles(res.data);
        } catch (error) {
            console.error('Error fetching vehicles');
        }
    };

    const handleAddRoute = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/transport/routes', newRoute);
            setShowRouteModal(false);
            fetchRoutes();
            setNewRoute({ route_name: '', start_location: '', end_location: '', fare: 0, status: 'active' });
            alert('Route added');
        } catch (error) {
            alert('Error adding route');
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/transport/vehicles', newVehicle);
            setShowVehicleModal(false);
            fetchVehicles();
            setNewVehicle({ vehicle_number: '', driver_name: '', driver_contact: '', capacity: 40, route_id: '', status: 'active' });
            alert('Vehicle added');
        } catch (error) {
            alert('Error adding vehicle');
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Transport Fleet</h1>
                    <p className="mt-1 text-gray-500 font-medium text-sm">Manage college bus routes, vehicle fleet, and capacity.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button onClick={() => setShowRouteModal(true)} className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        <span>New Route</span>
                    </button>
                    <button onClick={() => setShowVehicleModal(true)} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>Add Vehicle</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Routes List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Active Routes</h3>
                        </div>
                        <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-xs font-bold">{routes.length} Total</span>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50/30">
                        {routes.map(r => (
                            <div key={r.id} className="bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-md hover:border-indigo-100 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-50 to-white rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="flex justify-between items-start mb-3 relative z-10">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                                            R{r.id}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{r.route_name}</h4>
                                            <div className="text-xs font-semibold text-gray-500 mt-0.5 tracking-wide">Route ID: #{r.id}</div>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                                        ₹{r.fare}/Term
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm font-medium text-gray-600 bg-gray-50/80 p-3 rounded-xl border border-gray-100 mb-4">
                                    <div className="truncate flex-1" title={r.start_location}>{r.start_location}</div>
                                    <svg className="w-5 h-5 text-gray-400 mx-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                    <div className="truncate flex-1 text-right" title={r.end_location}>{r.end_location}</div>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                            {r.vehicles?.length || 0} Vehicles
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                            {r.allocations?.length || 0} Students
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {routes.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <p className="font-semibold">No routes defined yet.</p>
                                <p className="text-sm mt-1">Click 'New Route' to add one.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Vehicles List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center sticky top-0 z-10">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Fleet Vehicles</h3>
                        </div>
                        <span className="bg-gray-200 text-gray-700 py-1 px-3 rounded-full text-xs font-bold">{vehicles.length} Total</span>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50/30">
                        {vehicles.map(v => (
                            <div key={v.id} className="bg-white border border-gray-100 p-5 rounded-2xl hover:shadow-md hover:border-emerald-100 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-50 to-white rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center space-x-3">
                                        <div className="h-10 w-12 rounded-lg bg-gray-100 flex items-center justify-center font-black text-gray-800 border-2 border-dashed border-gray-300 group-hover:border-emerald-300 transition-colors text-xs tracking-widest">
                                            {v.vehicle_number.split('-').pop() || v.vehicle_number.slice(-4)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 uppercase tracking-widest">{v.vehicle_number}</h4>
                                            <div className="text-xs font-semibold text-gray-500 mt-0.5 tracking-wide flex items-center">
                                                <div className={`w-2 h-2 rounded-full mr-1.5 ${v.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {v.status.toUpperCase()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200">
                                        Cap: <span className="text-gray-900">{v.capacity}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Assigned Route</span>
                                        <span className="text-sm font-semibold text-gray-800 truncate block" title={v.route ? v.route.route_name : 'Unassigned'}>
                                            {v.route ? v.route.route_name : <span className="text-gray-400 italic">Unassigned</span>}
                                        </span>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Driver Details</span>
                                        <span className="text-sm font-semibold text-gray-800 truncate block">
                                            {v.driver_name}
                                        </span>
                                    </div>
                                </div>

                                <div className="text-xs font-medium text-gray-500 flex items-center">
                                    <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Contact: <span className="text-gray-700 ml-1 font-semibold">{v.driver_contact}</span>
                                </div>
                            </div>
                        ))}
                        {vehicles.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                                <p className="font-semibold">No vehicles added yet.</p>
                                <p className="text-sm mt-1">Click 'Add Vehicle' to register one.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Route Modal */}
            {showRouteModal && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Register New Route</h3>
                            <button onClick={() => setShowRouteModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1.5 rounded-lg shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddRoute} className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Route Name</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        placeholder="e.g. Route 1A - City Center"
                                        value={newRoute.route_name}
                                        onChange={e => setNewRoute({ ...newRoute, route_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Start Location</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                            placeholder="From"
                                            value={newRoute.start_location}
                                            onChange={e => setNewRoute({ ...newRoute, start_location: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">End Location</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                            placeholder="To (Usually College)"
                                            value={newRoute.end_location}
                                            onChange={e => setNewRoute({ ...newRoute, end_location: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Term Fare (₹)</label>
                                    <input
                                        type="number"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-bold text-gray-900"
                                        placeholder="Amount"
                                        value={newRoute.fare}
                                        onChange={e => setNewRoute({ ...newRoute, fare: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end space-x-3 pt-5 border-t border-gray-100">
                                <button type="button" onClick={() => setShowRouteModal(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 transition-all">Save Route</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Vehicle Modal */}
            {showVehicleModal && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Register New Vehicle</h3>
                            <button onClick={() => setShowVehicleModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1.5 rounded-lg shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddVehicle} className="p-6">
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Registration Number</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-bold text-gray-900 uppercase tracking-wider"
                                            placeholder="TN 01 AB 1234"
                                            value={newVehicle.vehicle_number}
                                            onChange={e => setNewVehicle({ ...newVehicle, vehicle_number: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Seating Capacity</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                            placeholder="e.g. 50"
                                            value={newVehicle.capacity}
                                            onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Driver Name</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                            placeholder="Driver Name"
                                            value={newVehicle.driver_name}
                                            onChange={e => setNewVehicle({ ...newVehicle, driver_name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Driver Contact Number</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                            placeholder="Phone Number"
                                            value={newVehicle.driver_contact}
                                            onChange={e => setNewVehicle({ ...newVehicle, driver_contact: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Assign Route</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-gray-900 bg-gray-50 hover:bg-white"
                                        value={newVehicle.route_id}
                                        onChange={e => setNewVehicle({ ...newVehicle, route_id: e.target.value })}
                                    >
                                        <option value="">Do not assign (Optional)</option>
                                        {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end space-x-3 pt-5 border-t border-gray-100">
                                <button type="button" onClick={() => setShowVehicleModal(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:bg-emerald-700 transition-all">Register Vehicle</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
