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
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Class Timetable</h2>

            <div className="flex space-x-4 mb-6 bg-white p-4 rounded shadow">
                <select
                    className="border p-2 rounded"
                    value={filters.department_id}
                    onChange={e => setFilters({ ...filters, department_id: e.target.value })}
                >
                    <option value="">Select Department</option>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                </select>
                <select
                    className="border p-2 rounded"
                    value={filters.semester}
                    onChange={e => setFilters({ ...filters, semester: e.target.value })}
                >
                    <option value="">Select Semester</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                </select>
                <button
                    onClick={() => setShowModal(true)}
                    className="ml-auto bg-green-600 text-white px-4 py-2 rounded"
                >
                    Add Class
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded shadow">
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border p-2 bg-gray-50">Day / Time</th>
                            {timeSlots.map(t => <th key={t} className="border p-2 bg-gray-50">{t}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {days.map(day => (
                            <tr key={day}>
                                <td className="border p-2 font-bold bg-gray-50">{day}</td>
                                {timeSlots.map(time => {
                                    const entry = getEntryForSlot(day, time);
                                    return (
                                        <td key={time} className="border p-2 h-20 relative hover:bg-gray-50">
                                            {entry ? (
                                                <div className="text-xs">
                                                    <div className="font-bold text-indigo-600">{entry.subject?.subject_name}</div>
                                                    <div>{entry.staff?.name}</div>
                                                    <div className="text-gray-500">{entry.room_number}</div>
                                                    <button onClick={() => handleDelete(entry.id)} className="text-red-500 absolute top-1 right-1">×</button>
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

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-lg font-bold mb-4">Add Class</h3>
                        <form onSubmit={handleSubmit}>
                            {/* Simple form fields */}
                            <select className="w-full mb-2 p-2 border" value={newItem.department_id} onChange={e => setNewItem({ ...newItem, department_id: e.target.value })} required>
                                <option value="">Select Department</option>
                                {departments.map(d => <option key={d.id} value={d.id}>{d.department_name}</option>)}
                            </select>
                            <select className="w-full mb-2 p-2 border" value={newItem.subject_id} onChange={e => setNewItem({ ...newItem, subject_id: e.target.value })} required>
                                <option value="">Select Subject</option>
                                {subjects.map(s => <option key={s.id} value={s.id}>{s.subject_name}</option>)}
                            </select>
                            <select className="w-full mb-2 p-2 border" value={newItem.staff_id} onChange={e => setNewItem({ ...newItem, staff_id: e.target.value })} required>
                                <option value="">Select Staff</option>
                                {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                            <select className="w-full mb-2 p-2 border" value={newItem.semester} onChange={e => setNewItem({ ...newItem, semester: e.target.value })} required>
                                <option value="">Select Semester</option>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select className="w-full mb-2 p-2 border" value={newItem.day} onChange={e => setNewItem({ ...newItem, day: e.target.value })} required>
                                {days.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input type="time" className="w-full mb-2 p-2 border" value={newItem.start_time} onChange={e => setNewItem({ ...newItem, start_time: e.target.value })} required />
                            <input type="time" className="w-full mb-2 p-2 border" value={newItem.end_time} onChange={e => setNewItem({ ...newItem, end_time: e.target.value })} required />
                            <input className="w-full mb-4 p-2 border" placeholder="Room Number" value={newItem.room_number} onChange={e => setNewItem({ ...newItem, room_number: e.target.value })} />

                            <div className="flex justify-end space-x-2">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
