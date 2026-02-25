import React, { useState, useEffect } from 'react';
import { ChevronLeft, Package, MapPin, Calendar, FileText, Truck, Eye } from 'lucide-react';
import axios from 'axios';

function ViewManifest({ manifestId, onBack, onViewPickup }) {
    const [manifest, setManifest] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchManifestDetail = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/manifests/${manifestId}`, config);
                setManifest(data);
            } catch (error) {
                console.error('Error fetching manifest details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (manifestId) fetchManifestDetail();
    }, [manifestId]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading manifest details...</div>;
    if (!manifest) return <div className="p-8 text-center text-red-500">Manifest not found.</div>;

    return (
        <div className="p-4 lg:p-6 bg-gray-50 dark:bg-gray-950 min-h-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2 transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Manifests
                    </button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manifest ID: {manifest.manifestCode}</h1>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${manifest.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {manifest.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Packets</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{manifest.packetCount}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <span className="text-xl font-bold text-green-600">₹</span>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Manifest Value</p>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹{manifest.manifestValue?.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Pickup Services</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white truncate">ShipGlobal Pickup</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Manifest Date</p>
                        <p className="text-base font-bold text-gray-900 dark:text-white">{new Date(manifest.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Manifested Orders Table */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Manifested Orders</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer Details</th>
                                    <th className="px-6 py-4">Package Details</th>
                                    <th className="px-6 py-4">AWB Number</th>
                                    <th className="px-6 py-4">Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {manifest.orders?.map((order) => {
                                    const shipment = manifest.shipments?.find(s => s.orderId === order._id || s.orderId === order.id);
                                    return (
                                        <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-blue-600">{order.orderId}</p>
                                                <p className="text-[10px] text-gray-400 uppercase">Inv: {order.invoiceNo || 'N/A'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900 dark:text-white">{order.consignee?.name}</p>
                                                <p className="text-xs text-gray-500">{order.consignee?.city}, {order.consignee?.country}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-gray-900 dark:text-gray-300">{shipment?.weight?.charged || 0} kg</p>
                                                <p className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1 rounded inline-block">{order.orderType}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-mono text-gray-600 dark:text-gray-400">{shipment?.courierAWB || 'PENDING'}</p>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                                ₹{order.declaredValue?.toLocaleString('en-IN')}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Summary & Actions */}
                <div className="space-y-6">
                    {/* Pickup Address */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-red-600" />
                            <h3 className="font-bold text-gray-900 dark:text-white">Pickup Location</h3>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                            <p className="font-bold text-gray-900 dark:text-white">{manifest.pickupAddress?.name || 'Main Warehouse'}</p>
                            <p>{manifest.pickupAddress?.address1}</p>
                            <p>{manifest.pickupAddress?.city}, {manifest.pickupAddress?.state} - {manifest.pickupAddress?.pincode}</p>
                            <p className="pt-2">Contact: {manifest.pickupAddress?.phone}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">Manifest Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={onViewPickup}
                                className="w-full bg-blue-600 text-white flex items-center justify-center gap-2 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                            >
                                <Truck className="w-5 h-5" />
                                View Pickup Request
                            </button>
                            <button className="w-full border-2 border-blue-600 text-blue-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                                <FileText className="w-5 h-5" />
                                Download Manifest PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewManifest;
