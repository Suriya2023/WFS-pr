import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, ChevronDown, ChevronRight, Package, Truck, Download, Calendar, CheckCircle2, Clock, MapPin } from 'lucide-react';

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Add interceptor for token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

function Multiboxes({ setActiveRoute }) {
    const [groupedOrders, setGroupedOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        fetchMultiboxCandidates();
    }, []);

    const fetchMultiboxCandidates = async () => {
        try {
            const { data } = await api.get('/multibox/candidates');
            // Ensure data is always an array
            if (Array.isArray(data)) {
                setGroupedOrders(data);
            } else if (data && Array.isArray(data.orders)) {
                setGroupedOrders(data.orders);
            } else if (data && Array.isArray(data.data)) {
                setGroupedOrders(data.data);
            } else {
                console.warn('Unexpected data format from API:', data);
                setGroupedOrders([]);
            }
        } catch (error) {
            console.error('Error fetching multibox candidates:', error);
            setGroupedOrders([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const toggleGroup = (key) => {
        setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
    };

    // Helper to generate timeline steps for a group (using 1st order as reference)
    const getTimelineSteps = (firstOrder) => [
        {
            title: 'Order Placed',
            date: firstOrder.createdAt,
            completed: true,
            icon: <Calendar className="w-4 h-4" />
        },
        {
            title: 'Processing',
            date: null,
            completed: ['packed', 'ready', 'manifested', 'dispatched', 'delivered'].includes(firstOrder.status),
            icon: <Package className="w-4 h-4" />
        },
        {
            title: 'In Transit',
            date: null,
            completed: ['dispatched', 'delivered'].includes(firstOrder.status),
            icon: <Truck className="w-4 h-4" />
        },
        {
            title: 'Delivered',
            date: null,
            completed: firstOrder.status === 'delivered',
            icon: <CheckCircle2 className="w-4 h-4" />
        }
    ];

    return (
        <div>
            {/* Content */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden dark:bg-gray-900 dark:border-gray-800">
                {/* Search & Actions Bar */}
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
                    <div className="flex flex-col sm:flex-row gap-3 flex-1 w-full max-w-2xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter Tracking ID..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <button className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                            <Filter className="w-4 h-4" /> More Filters
                        </button>
                    </div>

                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-[#1a4ca3] text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition shadow-sm">
                        + Add Multibox
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-200 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Master Order ID</th>
                                <th className="px-6 py-4">Customer Details</th>
                                <th className="px-6 py-4">Master Order Date</th>
                                <th className="px-6 py-4">Package Details</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-center">View Order</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : !Array.isArray(groupedOrders) || groupedOrders.length === 0 ? (
                                <tr><td colSpan="6" className="p-24 text-center text-gray-500">No multibox orders found.</td></tr>
                            ) : (
                                groupedOrders.map((order) => {
                                    const timelineSteps = getTimelineSteps(order);

                                    return (
                                        <React.Fragment key={order._id}>
                                            <tr className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                    {order.orderId || order._id?.substring(0, 12).toUpperCase()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-gray-900">{order.userId?.firstname} {order.userId?.lastname}</span>
                                                        <span className="text-xs text-gray-500">{order.userId?.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-600">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Package className="w-4 h-4 text-blue-500" />
                                                            <span>{order.items?.length || 0} Items</span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {order.consignee?.city}, {order.consignee?.pincode}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                        order.status === 'dispatched' ? 'bg-blue-100 text-blue-700' :
                                                            order.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                                                                'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => toggleGroup(order._id)}
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        {expandedGroups[order._id] ? 'Hide' : 'View'}
                                                        {expandedGroups[order._id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                                    </button>
                                                </td>
                                            </tr>
                                            {/* Expanded Content */}
                                            {expandedGroups[order._id] && (
                                                <tr className="bg-gray-50/30">
                                                    <td colSpan="6" className="p-4 border-t border-b border-gray-100">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2">

                                                            {/* LEFT: Items List */}
                                                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                    <Package className="w-4 h-4" /> Items in this Order
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {order.items?.map((item, idx) => (
                                                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100 hover:border-blue-200 transition">
                                                                            <div className="flex items-center gap-3">
                                                                                <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                                                                                    {item.weight || '?'}kg
                                                                                </div>
                                                                                <div>
                                                                                    <div className="text-sm font-medium text-gray-900">{item.name || 'Item'}</div>
                                                                                    <div className="text-xs text-gray-500">Qty: {item.qty || 1}</div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="text-sm font-medium text-gray-900">
                                                                                ₹{item.value || 0}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                                                    <span className="text-sm font-semibold text-gray-700">Total Value:</span>
                                                                    <span className="text-lg font-bold text-gray-900">₹{order.declaredValue || 0}</span>
                                                                </div>
                                                            </div>

                                                            {/* RIGHT: Tracking Timeline */}
                                                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                                    <Truck className="w-4 h-4" /> Tracking & Journey
                                                                </h4>

                                                                <div className="pl-4">
                                                                    {/* Tracking Number */}
                                                                    {order.trackingId ? (
                                                                        <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                                                            <div className="text-xs text-blue-600 uppercase font-semibold mb-1">Tracking ID</div>
                                                                            <div className="text-lg font-bold text-blue-800">{order.trackingId}</div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200 text-center">
                                                                            <Clock className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                                                                            <div className="text-sm font-medium text-gray-600">Tracking Not Available Yet</div>
                                                                        </div>
                                                                    )}

                                                                    {/* Vertical Timeline */}
                                                                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-6">
                                                                        {timelineSteps.map((step, idx) => (
                                                                            <div key={idx} className="relative">
                                                                                <div className={`absolute -left-[21px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center transition-colors ${step.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                                                                    {step.icon}
                                                                                </div>
                                                                                <div className="pl-6">
                                                                                    <div className={`font-medium text-sm ${step.completed ? 'text-gray-900' : 'text-gray-400'}`}>{step.title}</div>
                                                                                    {step.date && <div className="text-xs text-gray-500">{new Date(step.date).toLocaleDateString()}</div>}
                                                                                </div>
                                                                            </div>
                                                                        ))}

                                                                        {/* Destination */}
                                                                        <div className="relative">
                                                                            <div className="absolute -left-[21px] top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center bg-blue-100 text-blue-600">
                                                                                <MapPin className="w-3 h-3" />
                                                                            </div>
                                                                            <div className="pl-6">
                                                                                <div className="font-semibold text-gray-900 text-sm mb-1">Destination</div>
                                                                                <div className="text-gray-700 text-sm">{order.consignee?.address1}</div>
                                                                                <div className="text-gray-700 text-sm">{order.consignee?.city}, {order.consignee?.state} - {order.consignee?.pincode}</div>
                                                                                <div className="text-xs text-gray-500">{order.consignee?.firstName} {order.consignee?.lastName}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                </div>
                                                            </div>

                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Multiboxes;
