import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function StudentList() {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('');
    const [viewMode, setViewMode] = useState('active'); // active or deleted

    useEffect(() => {
        fetchDepartments();
        fetchStudents();
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchStudents();
    }, [search, departmentFilter, viewMode]);

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
            if (viewMode === 'deleted') params.deleted = 'true';

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

    const handleRestore = async (id) => {
        if (!confirm('Are you sure you want to restore this student?')) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post(`/api/students/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchStudents();
        } catch (error) {
            alert('Failed to restore student');
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">Students</h1>
                <Link to="/students/add" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition-all duration-200">
                    Add Student
                </Link>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-4 md:space-y-0">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`px-5 py-2.5 font-semibold rounded-lg shadow-sm transition-all duration-200 ${viewMode === 'active' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'}`}
                        >
                            Active Students
                        </button>
                        <button
                            onClick={() => setViewMode('deleted')}
                            className={`px-5 py-2.5 font-semibold rounded-lg shadow-sm transition-all duration-200 ${viewMode === 'deleted' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'}`}
                        >
                            Deleted Students
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div>
                        <select
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors bg-gray-50/50 hover:bg-white"
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

            <div className="bg-white shadow-sm border border-gray-100 rounded-2xl overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50/80 border-b border-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">S.No</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Department</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Batch & Year</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-50">
                        {students.length > 0 ? students.map((student, index) => (
                            <tr key={student.id} className="hover:bg-blue-50 transition-colors duration-300">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{index + 1}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            {student.photo ? (
                                                <img className="h-10 w-10 rounded-full object-cover border-2 border-indigo-200 shadow-sm" src={`/storage/${student.photo}`} alt={student.name} />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-blue-200 flex items-center justify-center text-indigo-600 font-bold border-2 border-indigo-200 shadow-sm">
                                                    {student.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-sm font-bold text-gray-800">{student.name}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.department?.department_name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.batch || 'N/A'} <br />
                                    <span className="text-xs text-gray-400">Year {student.year}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${student.status === 'active'
                                            ? 'bg-green-50 text-green-700 border-green-200'
                                            : 'bg-red-50 text-red-700 border-red-200'
                                        }`}>
                                        {student.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {student.email}<br />
                                    {student.phone && <span className="text-xs text-gray-400">{student.phone}</span>}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <div className="flex justify-center items-center space-x-3">
                                        {viewMode === 'active' ? (
                                            <>
                                                <Link to={`/students/${student.id}`} className="text-gray-400 hover:text-blue-600 hover:scale-110 transition-all duration-200" title="View">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                                </Link>
                                                <Link to={`/students/edit/${student.id}`} className="text-gray-400 hover:text-indigo-600 hover:scale-110 transition-all duration-200" title="Edit">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Link>
                                                <button onClick={() => handleDelete(student.id)} className="text-gray-400 hover:text-red-600 hover:scale-110 transition-all duration-200" title="Delete">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleRestore(student.id)} className="text-green-500 hover:text-green-700 font-bold border border-green-500 rounded px-2 py-1 hover:bg-green-50 transition-colors duration-200">Restore</button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">No students found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

