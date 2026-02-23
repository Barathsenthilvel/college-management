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
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-6">Add Department</h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {/* Department Name */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department Name</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Computer Science"
                    />
                </div>

                {/* Department Code */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Department Code</label>
                    <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="e.g. CSE, ECE"
                    />
                </div>

                {/* Description (optional) */}
                <div className="mb-5">
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Description <span className="text-gray-400 font-normal text-xs">(optional)</span>
                    </label>
                    <textarea
                        className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Short description about this department"
                    />
                </div>

                {/* Status */}
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
                        Save Department
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
                        className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200"
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

