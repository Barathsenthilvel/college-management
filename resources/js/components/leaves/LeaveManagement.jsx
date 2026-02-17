import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function LeaveManagement() {
    const [leaves, setLeaves] = useState([]);
    const [formData, setFormData] = useState({
        from_date: '',
        to_date: '',
        reason: '',
    });
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.roles?.some((r) => r.name === 'admin');

    useEffect(() => {
        fetchLeaves();
    }, []);

    const fetchLeaves = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/leaves', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setLeaves(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/leaves', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setShowForm(false);
            setFormData({ from_date: '', to_date: '', reason: '' });
            fetchLeaves();
        } catch (error) {
            alert('Failed to create leave request');
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `/api/leaves/${id}/approve`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchLeaves();
        } catch (error) {
            alert('Failed to approve leave');
        }
    };

    const handleReject = async (id) => {
        const remarks = prompt('Enter rejection remarks:');
        if (!remarks) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `/api/leaves/${id}/reject`,
                { admin_remarks: remarks },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchLeaves();
        } catch (error) {
            alert('Failed to reject leave');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Leave Management</h1>
                {!isAdmin && (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        {showForm ? 'Cancel' : 'Request Leave'}
                    </button>
                )}
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">From Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.from_date}
                                onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">To Date</label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                value={formData.to_date}
                                onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
                        <textarea
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            rows="4"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Submit
                    </button>
                </form>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {leaves.map((leave) => (
                        <li key={leave.id}>
                            <div className="px-4 py-4 sm:px-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium">{leave.user?.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {new Date(leave.from_date).toLocaleDateString()} -{' '}
                                            {new Date(leave.to_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-2">{leave.reason}</p>
                                        <p className="text-sm font-bold mt-2">
                                            Status: <span className={`${leave.status === 'approved' ? 'text-green-600' : leave.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'}`}>{leave.status}</span>
                                        </p>
                                        {leave.admin_remarks && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                Remarks: {leave.admin_remarks}
                                            </p>
                                        )}
                                    </div>
                                    {isAdmin && leave.status === 'pending' && (
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleApprove(leave.id)}
                                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(leave.id)}
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

