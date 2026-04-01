import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, Users, Database, Clock } from 'lucide-react';

const AdminDashboard = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllHistory = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('userInfo')).token;
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('http://localhost:5000/api/images/admin/history', config);
                setHistory(data);
            } catch (error) {
                toast.error('Failed to load admin history');
            } finally {
                setLoading(false);
            }
        };

        fetchAllHistory();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        );
    }

    const uniqueUsers = new Set(history.map(item => item.userId?._id)).size;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-8">
                Admin Center
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
                    <div className="p-4 bg-blue-500/10 rounded-xl">
                        <Database className="w-8 h-8 text-blue-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Total Images Generated</p>
                        <p className="text-3xl font-bold text-white mt-1">{history.length}</p>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
                    <div className="p-4 bg-purple-500/10 rounded-xl">
                        <Users className="w-8 h-8 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Active Creators</p>
                        <p className="text-3xl font-bold text-white mt-1">{uniqueUsers}</p>
                    </div>
                </div>
                <div className="glass p-6 rounded-2xl border border-gray-800 flex items-center gap-4">
                    <div className="p-4 bg-pink-500/10 rounded-xl">
                        <Clock className="w-8 h-8 text-pink-400" />
                    </div>
                    <div>
                        <p className="text-gray-400 text-sm">Latest Activity</p>
                        <p className="text-lg font-semibold text-white mt-1">
                            {history.length > 0 ? new Date(history[0].createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="glass rounded-2xl overflow-hidden border border-gray-800">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-900/50 border-b border-gray-800">
                                <th className="p-4 text-sm font-semibold text-gray-300">User</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Email</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Prompt</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Image Preview</th>
                                <th className="p-4 text-sm font-semibold text-gray-300">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {history.map((record) => (
                                <tr key={record._id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="p-4 text-sm text-gray-300">{record.userId?.name || 'Unknown'}</td>
                                    <td className="p-4 text-sm text-gray-400">{record.userId?.email || 'N/A'}</td>
                                    <td className="p-4 text-sm text-gray-300 max-w-xs truncate" title={record.prompt}>
                                        {record.prompt}
                                    </td>
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded overflow-hidden bg-gray-900 border border-gray-700">
                                            <a href={record.imageUrl} target="_blank" rel="noopener noreferrer">
                                                <img 
                                                    src={record.imageUrl} 
                                                    alt="Preview" 
                                                    className="w-full h-full object-cover hover:scale-110 transition-transform"
                                                    referrerPolicy="no-referrer"
                                                />
                                            </a>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-gray-400">
                                        {new Date(record.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {history.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-500">
                                        No images have been generated yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
