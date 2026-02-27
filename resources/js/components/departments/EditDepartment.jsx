import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditDepartment() {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [programType, setProgramType] = useState('engineering');
    const [status, setStatus] = useState('active');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDepartment();
    }, [id]);

    const fetchDepartment = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/departments/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setName(response.data.department_name);
            setProgramType(response.data.program_type || 'engineering');
            setStatus(response.data.status);
        } catch (error) {
            setError('Failed to load department');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.put(
                `/api/departments/${id}`,
                { department_name: name, program_type: programType, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/departments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update department');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Edit Department</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department Name</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Program Type</label>
                    <select
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        value={programType}
                        onChange={(e) => setProgramType(e.target.value)}
                    >
                        <option value="engineering">Engineering</option>
                        <option value="arts">Arts / Science</option>
                        <option value="pg">Post Graduate (PG)</option>
                    </select>
                </div>
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
                    <select
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Update Department
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/departments')}
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

