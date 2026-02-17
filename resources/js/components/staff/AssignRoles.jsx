import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AssignRoles() {
    const [staff, setStaff] = useState([]);
    const [selectedStaffId, setSelectedStaffId] = useState('');
    const [role, setRole] = useState('');
    const [permissions, setPermissions] = useState({
        'view students': false,
        'manage fees': false,
        attendance: false,
        reports: false,
        settings: false,
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('/api/staff', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data.data || response.data;
            setStaff(data);
        } catch (err) {
            console.error('Failed to load staff', err);
        }
    };

    const handlePermissionChange = (key) => {
        setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!selectedStaffId || !role) {
            setError('Please select staff and role.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const selectedPermissions = Object.entries(permissions)
                .filter(([, value]) => value)
                .map(([key]) => key);

            await axios.post(
                `/api/staff/${selectedStaffId}/assign-roles`,
                {
                    role,
                    permissions: selectedPermissions,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setMessage('Roles and permissions updated successfully.');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to assign role');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Assign Roles</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
                {message && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                    </div>
                )}

                {/* Select Staff */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Staff</label>
                    <select
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={selectedStaffId}
                        onChange={(e) => setSelectedStaffId(e.target.value)}
                    >
                        <option value="">Select Staff</option>
                        {staff.map((s) => (
                            <option key={s.id} value={s.id}>
                                {s.name} ({s.employee_id || s.email})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Role */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Select Role</label>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {['admin', 'teacher', 'accountant', 'hr'].map((r) => (
                            <label key={r} className="inline-flex items-center">
                                <input
                                    type="radio"
                                    name="role"
                                    value={r}
                                    checked={role === r}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="form-radio text-indigo-600"
                                />
                                <span className="ml-2 capitalize">{r}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Permissions */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Permissions</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {Object.keys(permissions).map((key) => (
                            <label key={key} className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    checked={permissions[key]}
                                    onChange={() => handlePermissionChange(key)}
                                    className="form-checkbox text-indigo-600"
                                />
                                <span className="ml-2 capitalize">{key}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
}


