import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ApplyLeave() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [formData, setFormData] = useState({
        leave_type: 'casual',
        from_date: '',
        to_date: '',
        reason: '',
        attachment: null
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        const data = new FormData();
        data.append('leave_type', formData.leave_type);
        data.append('from_date', formData.from_date);
        data.append('to_date', formData.to_date);
        data.append('reason', formData.reason);
        if (formData.attachment) {
            data.append('attachment', formData.attachment);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/leaves', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Leave application submitted successfully!');
            navigate('/leaves/status');
        } catch (error) {
            console.error('Failed to apply for leave', error);
            alert('Failed to submit leave application.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Apply Leave</h1>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* User Info (Read-only) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm text-gray-500 cursor-not-allowed"
                            value={user.name || ''}
                            readOnly
                        />
                    </div>

                    {/* Leave Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Leave Type</label>
                        <select
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.leave_type}
                            onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                        >
                            <option value="casual">Casual Leave</option>
                            <option value="sick">Sick Leave</option>
                            <option value="emergency">Emergency Leave</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">From Date</label>
                            <input
                                type="date"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.from_date}
                                onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">To Date</label>
                            <input
                                type="date"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                value={formData.to_date}
                                min={formData.from_date}
                                onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Reason</label>
                        <textarea
                            rows={4}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            required
                        />
                    </div>

                    {/* Attachment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Attachment (Optional)</label>
                        <input
                            type="file"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={(e) => setFormData({ ...formData, attachment: e.target.files[0] })}
                        />
                        <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG up to 2MB</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-3 pt-4 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
                        >
                            {submitting ? 'Applying...' : 'Apply Leave'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({
                                leave_type: 'casual',
                                from_date: '',
                                to_date: '',
                                reason: '',
                                attachment: null
                            })}
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
