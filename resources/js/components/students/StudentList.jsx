import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');

    useEffect(() => {
        fetchDepartments();
        fetchStudents();
    }, []);

    useEffect(() => {
        fetchStudents();
    }, [search, departmentFilter]);

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

    const fetchStudents = async () => {
        try {
            const token = localStorage.getItem('token');
            const params = {};
            if (search) params.search = search;
            if (departmentFilter) params.department_id = departmentFilter;

            const response = await axios.get('/api/students', {
                params,
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudents(response.data.data || response.data);
        } catch (error) {
            console.error('Failed to fetch students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStudents();
        } catch (error) {
            alert('Failed to delete student');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Students</h1>
                <Link to="/students/add" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Add Student
                </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                        >
                            <option value="">All Departments</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.department_name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                        <li key={student.id}>
                            <div className="px-4 py-4 sm:px-6 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">{student.name}</h3>
                                    <p className="text-sm text-gray-500">{student.email}</p>
                                    <p className="text-sm text-gray-500">
                                        {student.department?.department_name} - Year {student.year}
                                    </p>
                                </div>
                                <div className="space-x-2">
                                    <Link
                                        to={`/students/${student.id}`}
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(student.id)}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

