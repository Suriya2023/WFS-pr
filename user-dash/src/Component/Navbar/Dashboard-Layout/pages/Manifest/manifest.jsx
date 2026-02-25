import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, FileText, Eye, MoreHorizontal, Calendar, MapPin, Package } from 'lucide-react';
import axios from 'axios';

function ManifestPage({ setActiveRoute, setSelectedManifestId }) {
    const [manifests, setManifests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    // Fetch manifests
    useEffect(() => {
        fetchManifests();
    }, []);

    const fetchManifests = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/manifests`, config);
            setManifests(data);
        } catch (error) {
            console.error('Error fetching manifests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (id) => {
        setSelectedManifestId(id);
        setActiveRoute('view-manifest');
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedItems(manifests.map(m => m.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    return (
        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-950 min-h-full">
            {/* Controls */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm mb-6 p-4">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Enter Manifest Code ..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium">
                            <Filter className="w-4 h-4" />
                            More Filters
                        </button>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                        <button className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 font-medium">
                            <Plus className="w-5 h-5" />
                            <span>Add New Manifest</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 font-medium border-b border-gray-200 dark:border-gray-800">
                            <tr>
                                <th className="px-6 py-4 w-12">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        onChange={handleSelectAll}
                                        checked={manifests.length > 0 && selectedItems.length === manifests.length}
                                    />
                                </th>
                                <th className="px-6 py-4">Manifest Code</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Pickup Address</th>
                                <th className="px-6 py-4 text-center">Packet Count</th>
                                <th className="px-6 py-4 text-right">Manifest Value</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">View Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                        Loading manifests...
                                    </td>
                                </tr>
                            ) : manifests.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">No Records Found</h3>
                                            <p className="text-gray-500 max-w-sm mx-auto">
                                                You haven't generated any manifests yet. Create a new manifest to get started.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                manifests.map((manifest) => (
                                    <tr key={manifest.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                checked={selectedItems.includes(manifest.id)}
                                                onChange={() => handleSelectItem(manifest.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {manifest.manifestCode}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                                            {new Date(manifest.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                            {manifest.pickupAddress?.city || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                                                {manifest.packetCount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-white">
                                            ₹{(manifest.manifestValue || 0).toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${manifest.status === 'Completed'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                }`}>
                                                {manifest.status?.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleViewDetail(manifest._id)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-blue-600 dark:text-blue-400"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Optional/Static for now) */}
                {manifests.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing <span className="font-medium">1</span> to <span className="font-medium">{manifests.length}</span> of <span className="font-medium">{manifests.length}</span> results
                        </div>
                        <div className="flex gap-2">
                            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50" disabled>Previous</button>
                            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50" disabled>Next</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManifestPage;
