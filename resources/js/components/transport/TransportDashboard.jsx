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
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Transport Management</h2>
                <div className="space-x-2">
                    <button onClick={() => setShowRouteModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">
                        Add Route
                    </button>
                    <button onClick={() => setShowVehicleModal(true)} className="bg-green-600 text-white px-4 py-2 rounded">
                        Add Vehicle
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Routes List */}
                <div className="bg-white rounded shadow p-4">
                    <h3 className="font-bold mb-4 text-gray-700">Routes</h3>
                    <div className="space-y-4">
                        {routes.map(r => (
                            <div key={r.id} className="border p-3 rounded hover:shadow-md transition">
                                <div className="flex justify-between">
                                    <h4 className="font-bold">{r.route_name}</h4>
                                    <span className="text-sm font-semibold text-green-600">₹{r.fare}</span>
                                </div>
                                <div className="text-sm text-gray-500 my-1">
                                    {r.start_location} ➝ {r.end_location}
                                </div>
                                <div className="text-xs text-gray-400">
                                    Vehicles: {r.vehicles.length} | Students: {r.allocations.length}
                                </div>
                            </div>
                        ))}
                        {routes.length === 0 && <p className="text-gray-500 text-center">No routes added.</p>}
                    </div>
                </div>

                {/* Vehicles List */}
                <div className="bg-white rounded shadow p-4">
                    <h3 className="font-bold mb-4 text-gray-700">Vehicles</h3>
                    <div className="space-y-4">
                        {vehicles.map(v => (
                            <div key={v.id} className="border p-3 rounded hover:shadow-md transition">
                                <div className="flex justify-between">
                                    <h4 className="font-bold">{v.vehicle_number}</h4>
                                    <span className={`text-xs px-2 py-0.5 rounded ${v.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {v.status.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600 my-1">
                                    Driver: {v.driver_name} ({v.driver_contact})
                                </div>
                                <div className="text-xs text-gray-500">
                                    Route: {v.route ? v.route.route_name : 'Unassigned'} | Cap: {v.capacity}
                                </div>
                            </div>
                        ))}
                        {vehicles.length === 0 && <p className="text-gray-500 text-center">No vehicles added.</p>}
                    </div>
                </div>
            </div>

            {/* Add Route Modal */}
            {showRouteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-lg font-bold mb-4">Add Route</h3>
                        <form onSubmit={handleAddRoute}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Route Name" value={newRoute.route_name} onChange={e => setNewRoute({ ...newRoute, route_name: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Start Location" value={newRoute.start_location} onChange={e => setNewRoute({ ...newRoute, start_location: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="End Location" value={newRoute.end_location} onChange={e => setNewRoute({ ...newRoute, end_location: e.target.value })} required />
                            <input type="number" className="w-full mb-4 p-2 border rounded" placeholder="Fare" value={newRoute.fare} onChange={e => setNewRoute({ ...newRoute, fare: e.target.value })} required />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowRouteModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Vehicle Modal */}
            {showVehicleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-lg font-bold mb-4">Add Vehicle</h3>
                        <form onSubmit={handleAddVehicle}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Vehicle Number" value={newVehicle.vehicle_number} onChange={e => setNewVehicle({ ...newVehicle, vehicle_number: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Driver Name" value={newVehicle.driver_name} onChange={e => setNewVehicle({ ...newVehicle, driver_name: e.target.value })} required />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Driver Contact" value={newVehicle.driver_contact} onChange={e => setNewVehicle({ ...newVehicle, driver_contact: e.target.value })} required />
                            <input type="number" className="w-full mb-2 p-2 border rounded" placeholder="Capacity" value={newVehicle.capacity} onChange={e => setNewVehicle({ ...newVehicle, capacity: e.target.value })} required />
                            <select className="w-full mb-4 p-2 border rounded" value={newVehicle.route_id} onChange={e => setNewVehicle({ ...newVehicle, route_id: e.target.value })}>
                                <option value="">Select Route</option>
                                {routes.map(r => <option key={r.id} value={r.id}>{r.route_name}</option>)}
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowVehicleModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
