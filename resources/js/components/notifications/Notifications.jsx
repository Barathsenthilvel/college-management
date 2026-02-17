import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Notifications() {
    const [notifications, setNotifications] = useState([]);
    const [formData, setFormData] = useState({
        type: 'all',
        title: '',
        message: '',
        user_id: '',
        department_id: '',
        send_email: false,
    });
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.roles?.some((r) => r.name === 'admin');

    useEffect(() => {
        fetchNotifications();
        if (isAdmin) {
            fetchUsers();
            fetchDepartments();
        }
    }, []);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/notifications', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotifications(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            // You might need to create a users endpoint
            // For now, we'll skip this
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };

    const fetchDepartments = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/departments', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setDepartments(response.data);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/notifications', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowForm(false);
            setFormData({
                type: 'all',
                title: '',
                message: '',
                user_id: '',
                department_id: '',
                send_email: false,
            });
            fetchNotifications();
        } catch (error) {
            alert('Failed to send notification');
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `/api/notifications/${id}/read`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Notifications</h1>
                {isAdmin && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {showForm ? 'Cancel' : 'Send Notification'}
                    </button>
                )}
            </div>

            {showForm && isAdmin && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-4">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="all">All Users</option>
                            <option value="department">Department</option>
                            <option value="individual">Individual</option>
                        </select>
                    </div>
                    {formData.type === 'department' && (
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.department_id}
                                onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                            >
                                <option value="">Select Department</option>
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.department_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                        <textarea
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows="4"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="mr-2"
                                checked={formData.send_email}
                                onChange={(e) => setFormData({ ...formData, send_email: e.target.checked })}
                            />
                            Send Email
                        </label>
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Send
                    </button>
                </form>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {notifications.map((notification) => (
                        <li
                            key={notification.id}
                            className={notification.is_read ? 'bg-gray-50' : 'bg-white'}
                            onClick={() => !notification.is_read && markAsRead(notification.id)}
                        >
                            <div className="px-4 py-4 sm:px-6">
                                <h3 className="text-lg font-medium">{notification.title}</h3>
                                <p className="text-sm text-gray-700 mt-2">{notification.message}</p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {new Date(notification.created_at).toLocaleString()}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

