import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HostelDashboard() {
    const [hostels, setHostels] = useState([]);
    const [selectedHostel, setSelectedHostel] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [showHostelModal, setShowHostelModal] = useState(false);
    const [showRoomModal, setShowRoomModal] = useState(false);

    // Form states
    const [newHostel, setNewHostel] = useState({
        name: '', address: '', type: 'boys', capacity: 100, warden_name: '', contact_number: '', status: 'active'
    });
    const [newRoom, setNewRoom] = useState({
        room_number: '', capacity: 4, type: 'non-ac', fees: 5000, status: 'available'
    });

    useEffect(() => {
        fetchHostels();
    }, []);

    useEffect(() => {
        if (selectedHostel) {
            fetchRooms(selectedHostel.id);
        }
    }, [selectedHostel]);

    const fetchHostels = async () => {
        try {
            const res = await axios.get('/api/hostels');
            setHostels(res.data);
            if (res.data.length > 0 && !selectedHostel) {
                setSelectedHostel(res.data[0]);
            }
        } catch (error) {
            console.error('Error fetching hostels');
        }
    };

    const fetchRooms = async (hostelId) => {
        try {
            const res = await axios.get(`/api/hostels/${hostelId}/rooms`);
            setRooms(res.data);
        } catch (error) {
            console.error('Error fetching rooms');
        }
    };

    const handleAddHostel = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/hostels', newHostel);
            setShowHostelModal(false);
            fetchHostels();
            setNewHostel({ name: '', address: '', type: 'boys', capacity: 100, warden_name: '', contact_number: '', status: 'active' });
            setSelectedHostel(res.data);
            alert('Hostel added');
        } catch (error) {
            alert('Error adding hostel');
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        if (!selectedHostel) return;
        try {
            await axios.post(`/api/hostels/${selectedHostel.id}/rooms`, newRoom);
            setShowRoomModal(false);
            fetchRooms(selectedHostel.id);
            setNewRoom({ room_number: '', capacity: 4, type: 'non-ac', fees: 5000, status: 'available' });
            alert('Room added');
        } catch (error) {
            alert('Error adding room');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Hostel Management</h2>
                <button onClick={() => setShowHostelModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">
                    Add New Hostel
                </button>
            </div>

            <div className="flex space-x-6">
                {/* Hostel List Sidebar */}
                <div className="w-1/4 bg-white rounded shadow p-4">
                    <h3 className="font-bold mb-4 text-gray-700">Hostels</h3>
                    <ul className="space-y-2">
                        {hostels.map(h => (
                            <li
                                key={h.id}
                                onClick={() => setSelectedHostel(h)}
                                className={`p-2 rounded cursor-pointer ${selectedHostel?.id === h.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'hover:bg-gray-50'}`}
                            >
                                {h.name} <span className="text-xs ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-600">{h.type}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Content Area */}
                <div className="w-3/4">
                    {selectedHostel ? (
                        <>
                            <div className="bg-white rounded shadow p-6 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedHostel.name}</h3>
                                        <p className="text-gray-600">{selectedHostel.address}</p>
                                        <p className="text-sm mt-2">Warden: {selectedHostel.warden_name} ({selectedHostel.contact_number})</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm text-gray-500">Capacity: {selectedHostel.capacity}</div>
                                        <div className={`inline-block px-2 py-1 rounded text-xs ${selectedHostel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {selectedHostel.status.toUpperCase()}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded shadow p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-lg font-bold">Rooms</h4>
                                    <button onClick={() => setShowRoomModal(true)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                                        Add Room
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {rooms.map(room => (
                                        <div key={room.id} className="border rounded p-3 text-center hover:shadow-md transition">
                                            <div className="text-lg font-bold text-gray-800">{room.room_number}</div>
                                            <div className="text-xs text-gray-500 mb-2">{room.type.toUpperCase()}</div>
                                            <div className="flex justify-center space-x-1 mb-2">
                                                {/* Status Indicator */}
                                                <span className={`w-2 h-2 rounded-full ${room.status === 'available' ? 'bg-green-500' : room.status === 'full' ? 'bg-red-500' : 'bg-yellow-500'}`}></span>
                                                <span className="text-xs capitalize">{room.status}</span>
                                            </div>
                                            <div className="text-sm font-semibold">₹{room.fees}/yr</div>
                                            <div className="text-xs text-gray-400 mt-1">Cap: {room.capacity}</div>
                                        </div>
                                    ))}
                                    {rooms.length === 0 && <p className="text-gray-500 col-span-4 text-center">No rooms added yet.</p>}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded shadow p-8 text-center text-gray-500">
                            Select a hostel to manage details.
                        </div>
                    )}
                </div>
            </div>

            {/* Add Hostel Modal */}
            {showHostelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-lg font-bold mb-4">Add Hostel</h3>
                        <form onSubmit={handleAddHostel}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Name" value={newHostel.name} onChange={e => setNewHostel({ ...newHostel, name: e.target.value })} required />
                            <textarea className="w-full mb-2 p-2 border rounded" placeholder="Address" value={newHostel.address} onChange={e => setNewHostel({ ...newHostel, address: e.target.value })} required />
                            <select className="w-full mb-2 p-2 border rounded" value={newHostel.type} onChange={e => setNewHostel({ ...newHostel, type: e.target.value })}>
                                <option value="boys">Boys Hostel</option>
                                <option value="girls">Girls Hostel</option>
                                <option value="staff">Staff Quarters</option>
                            </select>
                            <input type="number" className="w-full mb-2 p-2 border rounded" placeholder="Capacity" value={newHostel.capacity} onChange={e => setNewHostel({ ...newHostel, capacity: e.target.value })} />
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Warden Name" value={newHostel.warden_name} onChange={e => setNewHostel({ ...newHostel, warden_name: e.target.value })} />
                            <input className="w-full mb-4 p-2 border rounded" placeholder="Contact Number" value={newHostel.contact_number} onChange={e => setNewHostel({ ...newHostel, contact_number: e.target.value })} />
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowHostelModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showRoomModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-lg font-bold mb-4">Add Room to {selectedHostel?.name}</h3>
                        <form onSubmit={handleAddRoom}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Room Number" value={newRoom.room_number} onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })} required />
                            <div className="flex space-x-2 mb-2">
                                <input type="number" className="w-1/2 p-2 border rounded" placeholder="Capacity" value={newRoom.capacity} onChange={e => setNewRoom({ ...newRoom, capacity: e.target.value })} required />
                                <input type="number" className="w-1/2 p-2 border rounded" placeholder="Fees" value={newRoom.fees} onChange={e => setNewRoom({ ...newRoom, fees: e.target.value })} required />
                            </div>
                            <select className="w-full mb-2 p-2 border rounded" value={newRoom.type} onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}>
                                <option value="non-ac">Non-AC</option>
                                <option value="ac">AC</option>
                            </select>
                            <select className="w-full mb-4 p-2 border rounded" value={newRoom.status} onChange={e => setNewRoom({ ...newRoom, status: e.target.value })}>
                                <option value="available">Available</option>
                                <option value="full">Full</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowRoomModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
