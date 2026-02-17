import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EditDepartment() {
    const { id } = useParams();
    const [name, setName] = useState('');
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
                { department_name: name, status },
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
            <h1 className="text-3xl font-bold mb-4">Edit Department</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Department Name</label>
                    <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Update
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/departments')}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

