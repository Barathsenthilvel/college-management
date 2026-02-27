import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddStaff() {
    const [formData, setFormData] = useState({
        name: '',
        employee_id: '',
        department_id: '',
        designation: '',
        phone: '',
        email: '',
        gender: '',
        date_of_joining: '',
        address: '',
        status: 'active',
        login_id: '',
        password: '',
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
    }, []);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setPhotoFile(e.target.files?.[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            const payload = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                payload.append(key, value ?? '');
            });
            if (photoFile) {
                payload.append('photo', photoFile);
            }

            await axios.post('/api/staff', payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/staff');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create staff');
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            employee_id: '',
            department_id: '',
            designation: '',
            phone: '',
            email: '',
            gender: '',
            date_of_joining: '',
            address: '',
            status: 'active',
            login_id: '',
            password: '',
        });
        setPhotoFile(null);
        setError('');
    };

    return (
        <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Add Staff</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Staff Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Staff Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
                        <input
                            type="text"
                            name="employee_id"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.employee_id}
                            onChange={handleChange}
                            placeholder="e.g. EMP001"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                        <select
                            name="department_id"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.department_id}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            {Object.entries(
                                departments.reduce((acc, dept) => {
                                    const type = dept.program_type ? dept.program_type.charAt(0).toUpperCase() + dept.program_type.slice(1) : 'Other Programs';
                                    if (!acc[type]) acc[type] = [];
                                    acc[type].push(dept);
                                    return acc;
                                }, {})
                            ).map(([type, depts]) => (
                                <optgroup key={type} label={type}>
                                    {depts.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.department_name}
                                        </option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="e.g. Assistant Professor"
                        />
                    </div>

                    {/* Login ID */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Login ID</label>
                        <input
                            type="text"
                            name="login_id"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.login_id}
                            onChange={handleChange}
                            placeholder="e.g. staff_bca01"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="******"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g. 9876543210"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. john.doe@example.com"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                        <select
                            name="gender"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* Date of Joining */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Joining</label>
                        <input
                            type="date"
                            name="date_of_joining"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.date_of_joining}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Address</label>
                        <textarea
                            name="address"
                            rows="3"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Residential address"
                        />
                    </div>

                    {/* Profile Photo */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-8 flex space-x-4">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Save Staff
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

