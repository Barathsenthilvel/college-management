import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function DepartmentNotification() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [formData, setFormData] = useState({
        department_id: '',
        title: '',
        message: '',
        category: 'announcement',
        channels: ['app'] // Default
    });
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/departments', { headers: { Authorization: `Bearer ${token}` } });
            setDepartments(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch departments', error);
        }
    };

    const handleChannelChange = (channel) => {
        setFormData(prev => {
            const channels = prev.channels.includes(channel)
                ? prev.channels.filter(c => c !== channel)
                : [...prev.channels, channel];
            return { ...prev, channels };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            // Assuming the department_id is sufficient for backend to filter users
            await axios.post('/api/notifications', {
                ...formData,
                type: 'department'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Department notification sent successfully!');
            navigate('/notifications');
        } catch (error) {
            console.error('Failed to send notification', error);
            alert('Failed to send notification.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Send to Department</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Department Select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Select Department</label>
                        <select
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.department_id}
                            onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map(d => (
                                <option key={d.id} value={d.id}>{d.department_name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Title</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notification Type</label>
                        <select
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.category} // Changed from type to category based on schema
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="announcement">Announcement</option>
                            <option value="alert">Alert</option>
                            <option value="reminder">Reminder</option>
                        </select>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                        />
                    </div>

                    {/* Send Via */}
                    <div>
                        <span className="block text-sm font-medium text-gray-700 mb-2">Send Via</span>
                        <div className="flex space-x-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    checked={formData.channels.includes('app')}
                                    onChange={() => handleChannelChange('app')}
                                />
                                <span className="ml-2 text-gray-700">App Notification</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    checked={formData.channels.includes('sms')}
                                    onChange={() => handleChannelChange('sms')}
                                />
                                <span className="ml-2 text-gray-700">SMS</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                    checked={formData.channels.includes('email')}
                                    onChange={() => handleChannelChange('email')}
                                />
                                <span className="ml-2 text-gray-700">Email</span>
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={sending}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            {sending ? 'Sending...' : 'Send Notification'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFormData({
                                    department_id: '',
                                    title: '',
                                    message: '',
                                    category: 'announcement',
                                    channels: ['app']
                                });
                            }}
                            className="px-6 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
