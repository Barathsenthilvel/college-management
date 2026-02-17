import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function EventCalendar() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        time: '',
        location: '',
        type: 'other',
        audience: 'all'
    });

    useEffect(() => {
        fetchEvents();
    }, [currentDate]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            // Fetch events for current month (simplified)
            // In a real app, we'd pass start_date and end_date of the visible range
            const res = await axios.get('/api/events');
            setEvents(res.data);
        } catch (error) {
            console.error('Error fetching events');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/events', newEvent);
            setShowModal(false);
            fetchEvents();
            setNewEvent({
                title: '', description: '', start_date: '', end_date: '', time: '', location: '', type: 'other', audience: 'all'
            });
            alert('Event added');
        } catch (error) {
            alert('Error adding event');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            await axios.delete(`/api/events/${id}`);
            fetchEvents();
        } catch (error) {
            alert('Error deleting');
        }
    };

    // Calendar logic helpers
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate); // 0 = Sunday
        const blanks = Array(firstDay === 0 ? 6 : firstDay - 1).fill(null); // Adjust for Monday start if needed, let's assume Sunday start for standard
        // Actually let's assume Sunday start (0)

        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        const totalSlots = [...Array(firstDay).fill(null), ...days];

        const rows = [];
        let cells = [];

        totalSlots.forEach((day, i) => {
            if (i % 7 !== 0) {
                cells.push(day);
            } else {
                rows.push(cells);
                cells = [];
                cells.push(day);
            }
            if (i === totalSlots.length - 1) {
                rows.push(cells);
            }
        });

        return rows.map((row, i) => (
            <tr key={i}>
                {row.map((day, j) => {
                    if (!day) return <td key={j} className="border p-2 bg-gray-50"></td>;

                    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayEvents = events.filter(e => e.start_date === dateStr);

                    return (
                        <td key={j} className="border p-2 h-24 align-top relative hover:bg-gray-50">
                            <div className="font-semibold text-gray-700">{day}</div>
                            <div className="space-y-1 mt-1">
                                {dayEvents.map(ev => (
                                    <div key={ev.id} className={`text-xs p-1 rounded ${ev.type === 'holiday' ? 'bg-red-100 text-red-800' :
                                        ev.type === 'exam' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-blue-100 text-blue-800'
                                        }`}>
                                        {ev.title}
                                        <button onClick={() => handleDelete(ev.id)} className="ml-1 text-gray-500 hover:text-red-600">×</button>
                                    </div>
                                ))}
                            </div>
                        </td>
                    );
                })}
            </tr>
        ));
    };

    const changeMonth = (offset) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Events Calendar</h2>
                <div className="flex space-x-2">
                    <button onClick={() => changeMonth(-1)} className="px-3 py-1 border rounded hover:bg-gray-100">Before</button>
                    <span className="font-bold text-lg px-4">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={() => changeMonth(1)} className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    Add Event
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                                <th key={d} className="border p-2 bg-gray-50">{d}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {renderCalendar()}
                    </tbody>
                </table>
            </div>

            {/* List View Details */}
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
                <div className="bg-white rounded shadow p-4">
                    {events.length === 0 ? <p>No events found.</p> : (
                        <ul className="divide-y">
                            {events.map(ev => (
                                <li key={ev.id} className="py-3 flex justify-between">
                                    <div>
                                        <div className="font-bold">{ev.title} <span className="text-xs text-gray-500">({ev.type})</span></div>
                                        <div className="text-sm text-gray-600">{ev.description}</div>
                                        <div className="text-xs text-gray-500">{ev.start_date} {ev.time && `at ${ev.time}`} | {ev.location}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded w-96">
                        <h3 className="text-lg font-bold mb-4">Add Event</h3>
                        <form onSubmit={handleSubmit}>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Title" value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} required />
                            <textarea className="w-full mb-2 p-2 border rounded" placeholder="Description" value={newEvent.description} onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                            <div className="flex space-x-2 mb-2">
                                <input type="date" className="w-1/2 p-2 border rounded" value={newEvent.start_date} onChange={e => setNewEvent({ ...newEvent, start_date: e.target.value })} required />
                                <input type="time" className="w-1/2 p-2 border rounded" value={newEvent.time} onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                            </div>
                            <input className="w-full mb-2 p-2 border rounded" placeholder="Location" value={newEvent.location} onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                            <select className="w-full mb-2 p-2 border rounded" value={newEvent.type} onChange={e => setNewEvent({ ...newEvent, type: e.target.value })}>
                                <option value="academic">Academic</option>
                                <option value="holiday">Holiday</option>
                                <option value="sports">Sports</option>
                                <option value="cultural">Cultural</option>
                                <option value="other">Other</option>
                            </select>
                            <select className="w-full mb-4 p-2 border rounded" value={newEvent.audience} onChange={e => setNewEvent({ ...newEvent, audience: e.target.value })}>
                                <option value="all">All</option>
                                <option value="students">Students</option>
                                <option value="staff">Staff</option>
                            </select>

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
