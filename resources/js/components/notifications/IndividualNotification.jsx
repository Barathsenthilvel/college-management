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
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-8">Send to Individual</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Search Section */}
                    <div className="border-b border-gray-100 pb-8 mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Select User</h2>

                        <div className="flex space-x-6 mb-6">
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    className="form-radio text-indigo-600 h-5 w-5 focus:ring-indigo-500 border-gray-300"
                                    name="role"
                                    value="student"
                                    checked={userRole === 'student'}
                                    onChange={() => setUserRole('student')}
                                />
                                <span className="ml-3 text-sm font-semibold text-gray-700">Student</span>
                            </label>
                            <label className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    className="form-radio text-indigo-600 h-5 w-5 focus:ring-indigo-500 border-gray-300"
                                    name="role"
                                    value="staff"
                                    checked={userRole === 'staff'}
                                    onChange={() => setUserRole('staff')}
                                />
                                <span className="ml-3 text-sm font-semibold text-gray-700">Staff</span>
                            </label>
                        </div>

                        <div className="flex space-x-3">
                            <input
                                type="text"
                                placeholder="Search by Name or Email..."
                                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={searching}
                                className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-sm hover:bg-indigo-700 disabled:bg-gray-400 transition-all duration-200"
                            >
                                {searching ? '...' : 'Search'}
                            </button>
                        </div>

                        {/* Search Results */}
                        {searchResults.length > 0 && (
                            <ul className="mt-4 border border-gray-100 rounded-xl divide-y divide-gray-100 max-h-48 overflow-y-auto bg-white shadow-sm">
                                {searchResults.map(user => (
                                    <li
                                        key={user.id}
                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-colors"
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500 font-medium">{user.email}</div>
                                        </div>
                                        <span className="text-indigo-600 text-sm font-bold bg-indigo-50 px-3 py-1 rounded-lg">Select</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Selected User Display */}
                        {selectedUser && (
                            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex justify-between items-center shadow-sm">
                                <div>
                                    <span className="block text-sm font-bold text-indigo-900">Selected: {selectedUser.name}</span>
                                    <span className="block text-xs font-semibold text-indigo-700 mt-1">{userRole.toUpperCase()}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setSelectedUser(null)}
                                    className="text-red-500 hover:text-red-700 text-sm font-bold bg-white px-3 py-1.5 rounded-lg shadow-sm border border-red-100 hover:border-red-200 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Notification Details */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Enter notification title"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Notification Type</label>
                        <select
                            className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white appearance-none"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            <option value="announcement">📢 Announcement</option>
                            <option value="alert">⚠️ Alert</option>
                            <option value="reminder">⏰ Reminder</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                        <textarea
                            rows={5}
                            className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 hover:bg-white resize-none"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            required
                            placeholder="Write your message here..."
                        />
                    </div>

                    {/* Send Via */}
                    <div>
                        <span className="block text-sm font-semibold text-gray-700 mb-3">Send Via Channels</span>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <label className={`flex items-center p-4 border rounded-xl transition-all duration-200 cursor-pointer ${formData.channels.includes('app') ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-gray-200 bg-gray-50/50 hover:bg-white'}`}>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                    checked={formData.channels.includes('app')}
                                    onChange={() => handleChannelChange('app')}
                                />
                                <span className="ml-3 text-sm font-bold text-gray-700">App Notification</span>
                            </label>
                            <label className={`flex items-center p-4 border rounded-xl transition-all duration-200 cursor-pointer ${formData.channels.includes('sms') ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-gray-200 bg-gray-50/50 hover:bg-white'}`}>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                    checked={formData.channels.includes('sms')}
                                    onChange={() => handleChannelChange('sms')}
                                />
                                <span className="ml-3 text-sm font-bold text-gray-700">SMS</span>
                            </label>
                            <label className={`flex items-center p-4 border rounded-xl transition-all duration-200 cursor-pointer ${formData.channels.includes('email') ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-gray-200 bg-gray-50/50 hover:bg-white'}`}>
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                                    checked={formData.channels.includes('email')}
                                    onChange={() => handleChannelChange('email')}
                                />
                                <span className="ml-3 text-sm font-bold text-gray-700">Email</span>
                            </label>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 pt-8 border-t border-gray-100 mt-8">
                        <button
                            type="button"
                            onClick={() => navigate('/notifications')}
                            className="px-8 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={sending}
                            className="flex-1 bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            {sending ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <span>Send to Individual</span>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
