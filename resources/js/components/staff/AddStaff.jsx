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
        });
        setPhotoFile(null);
        setError('');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Add Staff</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Staff Name */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Staff Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                        />
                    </div>

                    {/* Employee ID */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Employee ID</label>
                        <input
                            type="text"
                            name="employee_id"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.employee_id}
                            onChange={handleChange}
                            placeholder="e.g. EMP001"
                        />
                    </div>

                    {/* Department */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                        <select
                            name="department_id"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.department_id}
                            onChange={handleChange}
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Designation */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Designation</label>
                        <input
                            type="text"
                            name="designation"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.designation}
                            onChange={handleChange}
                            placeholder="e.g. Assistant Professor"
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Phone Number</label>
                        <input
                            type="text"
                            name="phone"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="e.g. 9876543210"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="e.g. john.doe@example.com"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                        <select
                            name="gender"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        <label className="block text-gray-700 text-sm font-bold mb-2">Date of Joining</label>
                        <input
                            type="date"
                            name="date_of_joining"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.date_of_joining}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                        <textarea
                            name="address"
                            rows="3"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Residential address"
                        />
                    </div>

                    {/* Profile Photo */}
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Profile Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                        <select
                            name="status"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Buttons */}
                <div className="mt-6 flex space-x-4">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200 py-2 px-6 rounded-md"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

