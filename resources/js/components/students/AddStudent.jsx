import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddStudent() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department_id: '',
        year: 1,
        status: 'active',
        batch: '',
        password: '',
        password_confirmation: '',
        photo: null,
    });
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [courseDuration, setCourseDuration] = useState(4); // default 4 years for engineering
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isStaff = user?.role === 'staff';

    useEffect(() => {
        if (isStaff && user.department_id) {
            // Staff: auto-set their department
            setFormData(prev => ({ ...prev, department_id: user.department_id }));
            // Fetch only their department for display
            const token = localStorage.getItem('token');
            axios.get(`/api/departments/${user.department_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            }).then(res => {
                setDepartments([res.data]);
            }).catch(err => console.error('Failed to fetch department:', err));
        } else {
            fetchDepartments();
        }
    }, []);

    // Calculate batch whenever start year or duration changes
    useEffect(() => {
        const endYear = parseInt(startYear) + parseInt(courseDuration);
        setFormData(prev => ({ ...prev, batch: `${startYear}-${endYear}` }));
    }, [startYear, courseDuration]);

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
        setError('');

        try {
            if (formData.password && formData.password !== formData.password_confirmation) {
                setError("Passwords do not match");
                return;
            }

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== '') {
                    data.append(key, formData[key]);
                }
            });

            const token = localStorage.getItem('token');
            await axios.post('/api/students', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            navigate('/students');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create student');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Add Student</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
                        <select
                            name="department_id"
                            required
                            disabled={isStaff}
                            className={`mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors ${isStaff ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50/50 hover:bg-white'}`}
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
                        {isStaff && (
                            <p className="mt-1 text-xs text-indigo-600 font-medium">Auto-assigned to your department</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                        <select
                            name="year"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.year}
                            onChange={handleChange}
                        >
                            <option value="1">Year 1</option>
                            <option value="2">Year 2</option>
                            <option value="3">Year 3</option>
                            <option value="4">Year 4</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Program Start Year</label>
                        <select
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={startYear}
                            onChange={(e) => setStartYear(e.target.value)}
                        >
                            {[...Array(10)].map((_, i) => {
                                const year = new Date().getFullYear() - 2 + i;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Course Duration</label>
                        <select
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={courseDuration}
                            onChange={(e) => setCourseDuration(e.target.value)}
                        >
                            <option value={2}>2 Years (e.g., Masters)</option>
                            <option value={3}>3 Years (e.g., Arts/Science)</option>
                            <option value={4}>4 Years (e.g., Engineering)</option>
                            <option value={5}>5 Years (e.g., Architecture/Law)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Calculated Batch</label>
                        <input
                            type="text"
                            readOnly
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-500 bg-gray-100 cursor-not-allowed focus:outline-none"
                            value={formData.batch}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Student Photo</label>
                        <input
                            type="file"
                            accept="image/*"
                            name="photo"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={handleFileChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave blank for default 'student123'"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password_confirmation"
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            placeholder="Confirm above password if provided"
                        />
                    </div>
                </div>
                <div className="mt-8 flex space-x-4">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Create Student
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/students')}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

