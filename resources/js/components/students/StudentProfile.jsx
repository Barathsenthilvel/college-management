import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function StudentProfile() {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const fetchStudent = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`/api/students/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setStudent(response.data);
        } catch (error) {
            console.error('Failed to fetch student:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!student) return <div>Student not found</div>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-4">Student Profile</h1>
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-500">Name</p>
                        <p className="text-xl font-bold">{student.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Email</p>
                        <p className="text-xl font-bold">{student.email}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Phone</p>
                        <p className="text-xl font-bold">{student.phone || 'N/A'}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Department</p>
                        <p className="text-xl font-bold">{student.department?.department_name}</p>
                    </div>
                    <div>
                        <p className="text-gray-500">Year</p>
                        <p className="text-xl font-bold">{student.year}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

