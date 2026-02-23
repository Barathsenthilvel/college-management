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
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Hostel Management</h1>
                    <p className="mt-1 text-gray-500 font-medium text-sm">Manage student accommodations, wardens, and room allocations.</p>
                </div>
                <div className="flex">
                    <button onClick={() => setShowHostelModal(true)} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 transition-all flex items-center justify-center space-x-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Add Hostel</span>
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Hostel List Sidebar */}
                <div className="w-full lg:w-1/3 xl:w-1/4">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[700px]">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center sticky top-0 z-10">
                            <div className="flex items-center space-x-3">
                                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-gray-900">Locations</h3>
                            </div>
                            <span className="bg-gray-200 text-gray-700 py-1 px-2.5 rounded-full text-xs font-bold">{hostels.length}</span>
                        </div>
                        <ul className="overflow-y-auto flex-1 p-3 space-y-2 bg-gray-50/30">
                            {hostels.map(h => (
                                <li
                                    key={h.id}
                                    onClick={() => setSelectedHostel(h)}
                                    className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedHostel?.id === h.id
                                        ? 'bg-indigo-50 border-indigo-200 shadow-sm relative overflow-hidden'
                                        : 'bg-white border-transparent hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    {selectedHostel?.id === h.id && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-xl"></div>
                                    )}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className={`font-bold ${selectedHostel?.id === h.id ? 'text-indigo-900' : 'text-gray-900'}`}>{h.name}</div>
                                            <div className="text-xs font-medium text-gray-500 mt-1 flex items-center">
                                                <svg className="w-3.5 h-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {h.capacity} Beds
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${h.type === 'boys' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                            h.type === 'girls' ? 'bg-pink-50 text-pink-700 border-pink-100' :
                                                'bg-purple-50 text-purple-700 border-purple-100'
                                            }`}>
                                            {h.type}
                                        </span>
                                    </div>
                                </li>
                            ))}
                            {hostels.length === 0 && (
                                <div className="text-center py-10 text-gray-400">
                                    <p className="font-medium text-sm">No hostels available.</p>
                                </div>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full lg:w-2/3 xl:w-3/4">
                    {selectedHostel ? (
                        <div className="space-y-6 h-[700px] flex flex-col">
                            {/* Hostel Details Card */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden flex-shrink-0">
                                <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-white rounded-bl-full opacity-60 pointer-events-none"></div>
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative z-10">
                                    <div>
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-2xl font-black text-gray-900">{selectedHostel.name}</h3>
                                            <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedHostel.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${selectedHostel.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                                {selectedHostel.status.toUpperCase()}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 font-medium flex items-center text-sm">
                                            <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {selectedHostel.address}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 text-sm w-full sm:w-auto">
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-0.5">Warden</span>
                                            <span className="font-semibold text-gray-900 block truncate">{selectedHostel.warden_name || 'Not Assigned'}</span>
                                            <span className="text-indigo-600 font-medium text-xs block mt-0.5">{selectedHostel.contact_number}</span>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col justify-center items-center">
                                            <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-0.5">Total Cap</span>
                                            <span className="text-xl font-black text-indigo-700">{selectedHostel.capacity}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rooms Grid */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col flex-1 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div className="flex items-center space-x-2">
                                        <h4 className="text-lg font-bold text-gray-900">Room Allocations</h4>
                                        <span className="bg-gray-200 text-gray-700 py-0.5 px-2 rounded-md text-xs font-bold ml-2">{rooms.length}</span>
                                    </div>
                                    <button onClick={() => setShowRoomModal(true)} className="px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded-lg shadow-sm hover:bg-emerald-100 transition-colors flex items-center space-x-1 text-sm">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                        </svg>
                                        <span>Add Room</span>
                                    </button>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {rooms.map(room => (
                                            <div key={room.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-indigo-200 transition-all group relative overflow-hidden">
                                                <div className="absolute right-0 top-0 w-12 h-12 bg-gray-50 rounded-bl-full -mr-2 -mt-2 transition-colors group-hover:bg-indigo-50"></div>
                                                <div className="flex items-start justify-between mb-3 relative z-10">
                                                    <div>
                                                        <div className="text-2xl font-black text-gray-900 group-hover:text-indigo-600 transition-colors">{room.room_number}</div>
                                                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{room.type}</div>
                                                    </div>
                                                    <span className={`w-3 h-3 rounded-full shadow-sm border border-white ${room.status === 'available' ? 'bg-emerald-500' :
                                                        room.status === 'full' ? 'bg-rose-500' : 'bg-amber-500'
                                                        }`} title={room.status}></span>
                                                </div>

                                                <div className="flex justify-between items-end mt-4">
                                                    <div>
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Capacity</div>
                                                        <div className="font-semibold text-gray-700 flex items-center">
                                                            <svg className="w-3.5 h-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                                            </svg>
                                                            {room.capacity}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Yearly Fee</div>
                                                        <div className="text-sm font-black text-emerald-600">₹{room.fees}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {rooms.length === 0 && (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            <p className="font-semibold text-gray-500">No rooms generated for this block.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-[700px] flex flex-col items-center justify-center text-gray-400 p-8">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No Location Selected</h3>
                            <p className="text-center max-w-sm">Select a hostel visually from the left sidebar to view details, rooms, and allocate students.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Hostel Modal */}
            {showHostelModal && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Register New Hostel</h3>
                            <button onClick={() => setShowHostelModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1.5 rounded-lg shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddHostel} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Hostel Name</label>
                                    <input
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                        placeholder="e.g. Block A - Diamond"
                                        value={newHostel.name}
                                        onChange={e => setNewHostel({ ...newHostel, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Accommodation Type</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900 bg-gray-50 hover:bg-white"
                                            value={newHostel.type}
                                            onChange={e => setNewHostel({ ...newHostel, type: e.target.value })}
                                        >
                                            <option value="boys">Boys Hostel</option>
                                            <option value="girls">Girls Hostel</option>
                                            <option value="staff">Staff Quarters</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Total Capacity</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                            placeholder="e.g. 500"
                                            value={newHostel.capacity}
                                            onChange={e => setNewHostel({ ...newHostel, capacity: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address Details</label>
                                    <textarea
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900 resize-none"
                                        placeholder="Full building address..."
                                        rows="2"
                                        value={newHostel.address}
                                        onChange={e => setNewHostel({ ...newHostel, address: e.target.value })}
                                        required
                                    ></textarea>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Warden Name</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                            placeholder="Name"
                                            value={newHostel.warden_name}
                                            onChange={e => setNewHostel({ ...newHostel, warden_name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-900"
                                            placeholder="Phone"
                                            value={newHostel.contact_number}
                                            onChange={e => setNewHostel({ ...newHostel, contact_number: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end space-x-3 pt-5 border-t border-gray-100">
                                <button type="button" onClick={() => setShowHostelModal(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:bg-indigo-700 transition-all">Save Location</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Room Modal */}
            {showRoomModal && (
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                                Add Room to <span className="text-indigo-600">{selectedHostel?.name}</span>
                            </h3>
                            <button onClick={() => setShowRoomModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors bg-white hover:bg-gray-100 p-1.5 rounded-lg shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <form onSubmit={handleAddRoom} className="p-6">
                            <div className="space-y-5">
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Room Identifier</label>
                                        <input
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-black text-gray-900 text-lg uppercase tracking-wider"
                                            placeholder="e.g. A-101"
                                            value={newRoom.room_number}
                                            onChange={e => setNewRoom({ ...newRoom, room_number: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Facility Type</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-gray-900 bg-gray-50 hover:bg-white"
                                            value={newRoom.type}
                                            onChange={e => setNewRoom({ ...newRoom, type: e.target.value })}
                                        >
                                            <option value="non-ac">Non-AC</option>
                                            <option value="ac">Air Conditioned (AC)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Current Status</label>
                                        <select
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-gray-900 bg-gray-50 hover:bg-white"
                                            value={newRoom.status}
                                            onChange={e => setNewRoom({ ...newRoom, status: e.target.value })}
                                        >
                                            <option value="available">Available</option>
                                            <option value="full">Occupied / Full</option>
                                            <option value="maintenance">Under Maintenance</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bed Capacity</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-medium text-gray-900"
                                            placeholder="Beds"
                                            value={newRoom.capacity}
                                            onChange={e => setNewRoom({ ...newRoom, capacity: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1">Annual Fee (₹)</label>
                                        <input
                                            type="number"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-bold text-gray-900"
                                            placeholder="Amount"
                                            value={newRoom.fees}
                                            onChange={e => setNewRoom({ ...newRoom, fees: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8 flex justify-end space-x-3 pt-5 border-t border-gray-100">
                                <button type="button" onClick={() => setShowRoomModal(false)} className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl shadow-sm hover:bg-gray-50 transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgb(16,185,129,0.39)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)] hover:bg-emerald-700 transition-all">Generate Room</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
