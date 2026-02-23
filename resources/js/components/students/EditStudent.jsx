import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditStudent() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        department_id: '',
        year: 1,
        status: 'active',
        batch: '',
        photo: null,
    });
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState('');
    const [startYear, setStartYear] = useState(new Date().getFullYear());
    const [courseDuration, setCourseDuration] = useState(4);
    const [loading, setLoading] = useState(true);
    const [currentPhoto, setCurrentPhoto] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartments();
        fetchStudentDetails();
    }, [id]);

    useEffect(() => {
        if (!loading) {
            const endYear = parseInt(startYear) + parseInt(courseDuration);
            setFormData(prev => ({ ...prev, batch: `${startYear}-${endYear}` }));
        }
    }, [startYear, courseDuration, loading]);

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

    const fetchStudentDetails = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const student = response.data;

            setFormData({
                name: student.name || '',
                email: student.email || '',
                phone: student.phone || '',
                department_id: student.department_id || '',
                year: student.year || 1,
                status: student.status || 'active',
                batch: student.batch || '',
                photo: null, // Keep null for new uploads
            });

            if (student.batch) {
                const parts = student.batch.split('-');
                if (parts.length === 2) {
                    setStartYear(parseInt(parts[0]));
                    setCourseDuration(parseInt(parts[1]) - parseInt(parts[0]));
                }
            }

            if (student.photo) {
                setCurrentPhoto(student.photo);
            }

        } catch (error) {
            console.error('Failed to fetch student details:', error);
            setError('Failed to load student details.');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'photo' && formData[key] === null) return; // Don't append empty photo
                if (formData[key] !== null && formData[key] !== '') {
                    data.append(key, formData[key]);
                }
            });
            // Method spoofing for PUT request with FormData
            data.append('_method', 'PUT');

            const token = localStorage.getItem('token');
            await axios.post(`/api/students/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            navigate('/students');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update student');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photo: e.target.files[0] });
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Edit Student</h1>
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
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
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
                                const year = new Date().getFullYear() - 5 + i;
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
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Update Photo (Optional)</label>
                        {currentPhoto && (
                            <div className="mb-2">
                                <span className="text-xs text-gray-500">Current Photo:</span>
                                <img src={`/storage/${currentPhoto}`} alt="Current" className="h-16 w-16 rounded-full object-cover border mt-1" />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            name="photo"
                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="mt-8 flex space-x-4">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Update Student
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
