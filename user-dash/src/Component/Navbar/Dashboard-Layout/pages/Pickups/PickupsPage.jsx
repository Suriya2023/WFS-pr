import React, { useState, useEffect } from 'react';
import { Truck, Search, Calendar, Plus, X, AlertCircle, CheckCircle2, MoreVertical, Eye, Download, Filter, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';

function PickupsPage({ setActiveRoute }) {
    const [pickups, setPickups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        pickupDate: '',
        estimatedOrders: '',
        estimatedWeight: ''
    });

    // Fetch Pickups
    const fetchPickups = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/pickups`, config);
            setPickups(data);
        } catch (error) {
            console.error('Error fetching pickups:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPickups();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/pickups`, formData, config);
            setIsModalOpen(false);
            setFormData({ pickupDate: '', estimatedOrders: '', estimatedWeight: '' });
            fetchPickups();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create pickup request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this pickup request?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/pickups/${id}/cancel`, {}, config);
            fetchPickups();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to cancel pickup');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'created': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'picked': return 'bg-green-100 text-green-700 border-green-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            case 'closed': return 'bg-gray-100 text-gray-700 border-gray-200';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-950 min-h-full">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Pickup Requests</h1>
                    <p className="text-sm text-gray-500">Manage and track your schedule pickups</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-yellow-400 text-red-700 px-5 py-2.5 rounded-xl font-black hover:bg-yellow-500 transition-all shadow-md active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    Create Pickup Request
                </button>
            </div>

            {/* Table Area */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4">Pickup Code</th>
                                <th className="px-6 py-4">Pickup Date</th>
                                <th className="px-6 py-4">Date Added</th>
                                <th className="px-6 py-4">No. of Packets</th>
                                <th className="px-6 py-4">Created By</th>
                                <th className="px-6 py-4">Order WT</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="8" className="px-6 py-4"><div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : pickups.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                <Truck className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="font-bold text-gray-400 italic">No pickup requests found</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                pickups.map((pickup) => (
                                    <tr key={pickup._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <p className="font-black text-blue-600 cursor-pointer hover:underline">{pickup.pickupCode}</p>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">
                                            {new Date(pickup.pickupDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(pickup.createdAt).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">
                                            {pickup.estimatedOrders}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-gray-500">
                                                {pickup.sourceType}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300">
                                            {pickup.estimatedWeight} kg
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(pickup.status)}`}>
                                                {pickup.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                {pickup.status === 'created' && (
                                                    <button
                                                        onClick={() => handleCancel(pickup._id)}
                                                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                        title="Cancel Request"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all">
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-white dark:bg-gray-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-black text-gray-900 dark:text-white">Create Pickup Request</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Select a Pickup Date <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.pickupDate}
                                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Estimated Numbers of Orders <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    required
                                    placeholder="Enter Estimated Numbers of Orders . . ."
                                    value={formData.estimatedOrders}
                                    onChange={(e) => setFormData({ ...formData, estimatedOrders: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-bold"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-gray-400 uppercase mb-1.5 ml-1">Estimated Weight (in KG) <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    step="0.1"
                                    required
                                    placeholder="Enter Estimated Weight (In KG) . . ."
                                    value={formData.estimatedWeight}
                                    onChange={(e) => setFormData({ ...formData, estimatedWeight: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-bold"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 mt-4"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PickupsPage;
