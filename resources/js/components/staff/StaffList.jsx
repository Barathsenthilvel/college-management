import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function StaffList() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [departments, setDepartments] = useState([]);
    const [departmentId, setDepartmentId] = useState('');
    const [designation, setDesignation] = useState('');

    useEffect(() => {
        fetchDepartments();
        fetchStaff();
    }, []);

    useEffect(() => {
        fetchStaff();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, departmentId, designation]);

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

    const fetchStaff = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = {};
            if (search) params.search = search;
            if (departmentId) params.department_id = departmentId;
            if (designation) params.designation = designation;

            const response = await axios.get('/api/staff', {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = response.data.data || response.data;
            setStaff(data);
        } catch (error) {
            console.error('Failed to fetch staff:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this staff member?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/staff/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStaff();
        } catch (error) {
            alert('Failed to delete staff member');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Staff</h1>
                <Link
                    to="/staff/add"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Add Staff
                </Link>
            </div>

            {/* Filters & search */}
            <div className="bg-white p-4 mb-4 rounded-lg shadow space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Search by name or employee ID"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                        >
                            <option value="">All</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Filter by designation"
                            value={designation}
                            onChange={(e) => setDesignation(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Screen 2 — Staff List table */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                S.No
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Photo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employee ID
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Designation
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Phone
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {staff.map((member, index) => (
                            <tr key={member.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>
                                <td className="px-4 py-3">
                                    {member.photo_path ? (
                                        <img
                                            src={`/storage/${member.photo_path}`}
                                            alt={member.name}
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                                            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                    {member.name}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{member.employee_id}</td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {member.department?.department_name || '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">
                                    {member.designation || '-'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-700">{member.phone || '-'}</td>
                                <td className="px-4 py-3 text-sm">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            member.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {member.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                    <div className="inline-flex items-center gap-3">
                                        {/* View (placeholder, can link to a StaffProfile page) */}
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900"
                                            title="View"
                                            disabled
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                                />
                                            </svg>
                                        </button>
                                        {/* Edit placeholder (wire later if needed) */}
                                        <button
                                            className="text-indigo-600 hover:text-indigo-900"
                                            title="Edit"
                                            disabled
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5h2m-1-1v2m4 6v5H8v-5m9-9l-5 5-3 1 1-3 5-5 2 2z"
                                                />
                                            </svg>
                                        </button>
                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(member.id)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Delete"
                                        >
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a1 1 0 01-.894-.553L6.382 4.276A1 1 0 017.236 3h9.528a1 1 0 01.894.553L18 7H8z"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

