import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function IndividualNotification() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userRole, setUserRole] = useState('student'); // 'student' or 'staff'
    const [searching, setSearching] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        category: 'announcement',
        channels: ['app']
    });
    const [sending, setSending] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery) return;
        setSearching(true);
        try {
            const token = localStorage.getItem('token');
            const endpoint = userRole === 'student' ? '/api/students' : '/api/staff';
            const response = await axios.get(endpoint, {
                params: { search: searchQuery }, // Ideally backend supports search
                headers: { Authorization: `Bearer ${token}` }
            });

            // Client side filtering if backend search not implemented perfectly
            const data = response.data.data || response.data;
            const filtered = data.filter(u =>
                u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (u.email && u.email.toLowerCase().includes(searchQuery.toLowerCase()))
            );

            setSearchResults(filtered);
        } catch (error) {
            console.error('Search failed', error);
        } finally {
            setSearching(false);
        }
    };

    const handleSelectUser = (user) => {
        setSelectedUser(user);
        setSearchResults([]);
        setSearchQuery('');
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
        if (!selectedUser) {
            alert('Please select a user first.');
            return;
        }
        setSending(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/notifications', {
                ...formData,
                // using selectedUser.user_id if available, fallback to id (assuming id might be user_id in some contexts)
                user_id: selectedUser.user_id || selectedUser.id,
                type: 'individual'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Individual notification sent successfully!');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Send to Individual</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Search Section */}
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Select User</h2>

                        <div className="flex space-x-4 mb-4">
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-indigo-600"
                                    name="role"
                                    value="student"
                                    checked={userRole === 'student'}
                                    onChange={() => setUserRole('student')}
                                />
                                <span className="ml-2">Student</span>
                            </label>
                            <label className="inline-flex items-center">
                                <input
                                    type="radio"
                                    className="form-radio text-indigo-600"
                                    name="role"
                                    value="staff"
                                    checked={userRole === 'staff'}
                                    onChange={() => setUserRole('staff')}
                                />
                                <span className="ml-2">Staff</span>
                            </label>
                        </div>

                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Search by Name or Email..."
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={searching}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                            >
                                {searching ? '...' : 'Search'}
                            </button>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200 max-h-48 overflow-y-auto">
                                {searchResults.map(user => (
                                    <li
                                        key={user.id}
                                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                        <span className="text-indigo-600 text-xs font-semibold">Select</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Selected User Display */}
                        {selectedUser && (
                            <div className="mt-4 p-3 bg-indigo-50 border border-indigo-100 rounded-md flex justify-between items-center">
                                <div>
                                    <span className="block text-sm font-semibold text-indigo-900">Selected: {selectedUser.name}</span>
                                    <span className="block text-xs text-indigo-700">{userRole.toUpperCase()}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Notification Details */}
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

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Notification Type</label>
                        <select
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="announcement">Announcement</option>
                            <option value="alert">Alert</option>
                            <option value="reminder">Reminder</option>
                        </select>
                    </div>

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
                            onClick={() => navigate('/notifications')}
                            className="px-6 bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
