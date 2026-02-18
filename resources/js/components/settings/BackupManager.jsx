import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function BackupManager() {
    const [backups, setBackups] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        try {
            const res = await axios.get('/api/backups');
            setBackups(res.data);
        } catch (error) {
            console.error('Error fetching backups');
        }
    };

    const handleCreateBackup = async () => {
        setLoading(true);
        try {
            await axios.post('/api/backups');
            alert('Backup created successfully');
            fetchBackups();
        } catch (error) {
            alert('Error creating backup');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (filename) => {
        try {
            const response = await axios.get(`/api/backups/${filename}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            alert('Error downloading backup');
        }
    };

    const handleDelete = async (filename) => {
        if (!confirm('Are you sure you want to delete this backup?')) return;
        try {
            await axios.delete(`/api/backups/${filename}`);
            fetchBackups();
        } catch (error) {
            alert('Error deleting backup');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Backup Management</h2>
                <button
                    onClick={handleCreateBackup}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create New Backup'}
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-3 border-b">Filename</th>
                            <th className="p-3 border-b">Size</th>
                            <th className="p-3 border-b">Created At</th>
                            <th className="p-3 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {backups.map((backup, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="p-3 border-b font-mono text-sm">{backup.name}</td>
                                <td className="p-3 border-b">{(backup.size / 1024).toFixed(2)} KB</td>
                                <td className="p-3 border-b">{backup.created_at}</td>
                                <td className="p-3 border-b space-x-2">
                                    <button
                                        onClick={() => handleDownload(backup.name)}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Download
                                    </button>
                                    <button
                                        onClick={() => handleDelete(backup.name)}
                                        className="text-red-600 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {backups.length === 0 && (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">No backups found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <strong>Note:</strong> This backup includes database tables only. Uploaded files (like profile pictures) are not included in the SQL dump.
            </div>
        </div>
    );
}
