import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Timetable() {
    const [timetable, setTimetable] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        department_id: '',
        semester: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [newItem, setNewItem] = useState({
        department_id: '',
        subject_id: '',
        staff_id: '',
        semester: '',
        day: 'Monday',
        start_time: '',
        end_time: '',
        room_number: ''
    });

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
    ];

    useEffect(() => {
        fetchDepartments();
        fetchSubjects();
        fetchStaff();
    }, []);

    useEffect(() => {
        if (filters.department_id && filters.semester) {
            fetchTimetable();
        }
    }, [filters]);

    const fetchDepartments = async () => {
        const res = await axios.get('/api/departments');
        setDepartments(res.data);
    };

    const fetchSubjects = async () => {
        const res = await axios.get('/api/subjects'); // Assuming this endpoint exists or similar
        setSubjects(res.data.data);
    };

    const fetchStaff = async () => {
        const res = await axios.get('/api/staff');
        setStaff(res.data.data);
    };

    const fetchTimetable = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/api/timetable', { params: filters });
            setTimetable(res.data);
        } catch (error) {
            console.error('Error fetching timetable');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/timetable', newItem);
            setShowModal(false);
            fetchTimetable();
            alert('Added successfully');
        } catch (error) {
            alert(error.response?.data?.message || 'Error adding timetable entry');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/timetable/${id}`);
            fetchTimetable();
        } catch (error) {
            alert('Error deleting');
        }
    };

    const getEntryForSlot = (day, time) => {
        return timetable.find(t =>
            t.day === day &&
            t.start_time.startsWith(time) // Simplified check
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto block">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-8">Class Timetable</h1>

            {/* Filters and Add Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <select
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 hover:bg-white transition-all outline-none"
                        value={filters.department_id}
                        onChange={e => setFilters({ ...filters, department_id: e.target.value })}
                    >
                        <option value="">Select Department</option>
                        {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                    </select>
                    <select
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 hover:bg-white transition-all outline-none"
                        value={filters.semester}
                        onChange={e => setFilters({ ...filters, semester: e.target.value })}
                    >
                        <option value="">Select Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Class</span>
                </button>
            </div>

            {/* Timetable Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border-collapse table-fixed">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="w-32 sticky left-0 z-10 bg-gray-50 px-4 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb]">
                                    Day / Time
                                </th>
                                {timeSlots.map(t => (
                                    <th key={t} className="px-4 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px] border-r border-gray-200 last:border-r-0">
                                        {t}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {days.map(day => (
                                <tr key={day} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="w-32 sticky left-0 z-10 bg-white px-4 py-4 text-sm font-bold text-gray-900 border-r border-gray-200 shadow-[1px_0_0_0_#e5e7eb] group-hover:bg-gray-50/50">
                                        {day}
                                    </td>
                                    {timeSlots.map(time => {
                                        const entry = getEntryForSlot(day, time);
                                        return (
                                            <td key={time} className="px-2 py-2 h-24 relative border-r border-gray-100 last:border-r-0 hover:bg-indigo-50/30 transition-colors group">
                                                {entry ? (
                                                    <div className="h-full w-full bg-indigo-50 border border-indigo-100 rounded-lg p-2.5 flex flex-col justify-center relative shadow-sm overflow-hidden group">
                                                        <div className="font-bold text-indigo-700 text-xs truncate mb-0.5" title={entry.subject?.subject_name}>
                                                            {entry.subject?.subject_name}
                                                        </div>
                                                        <div className="text-[11px] font-medium text-gray-600 truncate mb-0.5" title={entry.staff?.name}>
                                                            {entry.staff?.name}
                                                        </div>
                                                        <div className="text-[10px] font-semibold text-gray-500 truncate ring-1 ring-gray-200/50 bg-white/50 rounded-sm px-1 w-max">
                                                            Room {entry.room_number}
                                                        </div>

                                                        {/* Delete Button (Visible on hover) */}
                                                        <button
                                                            onClick={() => handleDelete(entry.id)}
                                                            className="absolute top-1 right-1 p-1 bg-red-100 text-red-600 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-all shadow-sm"
                                                            title="Remove Class"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ) : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Class Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Add Class Section</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Department</label>
                                    <select
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 outline-none text-sm"
                                        value={newItem.department_id}
                                        onChange={e => setNewItem({ ...newItem, department_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Select Dept</option>
                                        {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Semester</label>
                                    <select
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 outline-none text-sm"
                                        value={newItem.semester}
                                        onChange={e => setNewItem({ ...newItem, semester: e.target.value })}
                                        required
                                    >
                                        <option value="">Semester</option>
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Subject</label>
                                <select
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 outline-none text-sm"
                                    value={newItem.subject_id}
                                    onChange={e => setNewItem({ ...newItem, subject_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Subject</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Staff Member</label>
                                <select
                                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 outline-none text-sm"
                                    value={newItem.staff_id}
                                    onChange={e => setNewItem({ ...newItem, staff_id: e.target.value })}
                                    required
                                >
                                    <option value="">Select Staff</option>
                                    {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Day</label>
                                    <select
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 outline-none text-sm"
                                        value={newItem.day}
                                        onChange={e => setNewItem({ ...newItem, day: e.target.value })}
                                        required
                                    >
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Room Number</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 outline-none text-sm"
                                        placeholder="e.g. 101"
                                        value={newItem.room_number}
                                        onChange={e => setNewItem({ ...newItem, room_number: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Start Time</label>
                                    <input
                                        type="time"
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 outline-none text-sm"
                                        value={newItem.start_time}
                                        onChange={e => setNewItem({ ...newItem, start_time: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">End Time</label>
                                    <input
                                        type="time"
                                        className="w-full px-3 py-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/50 outline-none text-sm"
                                        value={newItem.end_time}
                                        onChange={e => setNewItem({ ...newItem, end_time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                                >
                                    Save Class
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
