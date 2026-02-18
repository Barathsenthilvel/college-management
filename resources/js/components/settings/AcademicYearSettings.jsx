import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AcademicYearSettings() {
    const [years, setYears] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newYear, setNewYear] = useState({ name: '', start_date: '', end_date: '', is_current: false });

    useEffect(() => {
        fetchYears();
    }, []);

    const fetchYears = async () => {
        try {
            const res = await axios.get('/api/academic-years');
            setYears(res.data);
        } catch (error) {
            console.error('Error fetching academic years');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/academic-years', newYear);
            setShowModal(false);
            fetchYears();
            setNewYear({ name: '', start_date: '', end_date: '', is_current: false });
        } catch (error) {
            alert('Error saving academic year');
        }
    };

    const handleSetCurrent = async (id) => {
        try {
            await axios.put(`/api/academic-years/${id}`, { is_current: true });
            fetchYears();
        } catch (error) {
            alert('Error updating current year');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/academic-years/${id}`);
            fetchYears();
        } catch (error) {
            alert('Error deleting academic year');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Academic Year Settings</h2>
                <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded">
                    Add Academic Year
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b">Name</th>
                            <th className="p-3 border-b">Start Date</th>
                            <th className="p-3 border-b">End Date</th>
                            <th className="p-3 border-b">Status</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {years.map(year => (
                            <tr key={year.id} className="hover:bg-gray-50">
                                <td className="p-3 border-b font-semibold">{year.name}</td>
                                <td className="p-3 border-b">{year.start_date}</td>
                                <td className="p-3 border-b">{year.end_date}</td>
                                <td className="p-3 border-b">
                                    {year.is_current ? (
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">Current</span>
                                    ) : (
                                        <button onClick={() => handleSetCurrent(year.id)} className="text-indigo-600 hover:underline text-sm">Set as Current</button>
                                    )}
                                </td>
                                <td className="p-3 border-b">
                                    <button onClick={() => handleDelete(year.id)} className="text-red-600 hover:text-red-800">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-lg font-bold mb-4">Add Academic Year</h3>
                        <form onSubmit={handleSave}>
                            <input className="w-full mb-3 p-2 border rounded" placeholder="Name (e.g. 2025-2026)" value={newYear.name} onChange={e => setNewYear({ ...newYear, name: e.target.value })} required />
                            <div className="mb-3">
                                <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                                <input type="date" className="w-full p-2 border rounded" value={newYear.start_date} onChange={e => setNewYear({ ...newYear, start_date: e.target.value })} required />
                            </div>
                            <div className="mb-4">
                                <label className="block text-xs text-gray-500 mb-1">End Date</label>
                                <input type="date" className="w-full p-2 border rounded" value={newYear.end_date} onChange={e => setNewYear({ ...newYear, end_date: e.target.value })} required />
                            </div>
                            <div className="mb-4 flex items-center">
                                <input type="checkbox" id="is_current" className="mr-2" checked={newYear.is_current} onChange={e => setNewYear({ ...newYear, is_current: e.target.checked })} />
                                <label htmlFor="is_current" className="text-sm">Set as Current Year</label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
