import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddDepartment() {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('active');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                '/api/departments',
                {
                    department_name: name,
                    department_code: code,
                    description,
                    status,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            navigate('/departments');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create department');
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Add Department</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {/* Department Name */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Department Name</label>
                    <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Computer Science"
                    />
                </div>

                {/* Department Code */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Department Code</label>
                    <input
                        type="text"
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. CSE, ECE"
                    />
                </div>

                {/* Description (optional) */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Description <span className="text-gray-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short description about this department"
                    />
                </div>

                {/* Status */}
                <div className="mb-6">
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
                        Save
                    </button>
                    <button
                        type="reset"
                        onClick={() => {
                            setName('');
                            setCode('');
                            setDescription('');
                            setStatus('active');
                            setError('');
                        }}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

