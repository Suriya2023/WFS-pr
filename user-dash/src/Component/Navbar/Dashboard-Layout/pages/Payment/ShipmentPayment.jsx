import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Truck, Search, DollarSign, Wallet, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const ShipmentPayment = () => {
    const [activeTab, setActiveTab] = useState('prepaid');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPendingOrders = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 100 } // Get a good batch
                });
                // Expect data to be an array based on previous research of getOrders
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Error fetching orders for payment:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPendingOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const matchesTab = activeTab === 'prepaid'
            ? order.paymentMode === 'Prepaid'
            : order.paymentMode === 'COD';

        const matchesSearch = (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (order.consignee?.firstName || '').toLowerCase().includes(searchTerm.toLowerCase());

        // Only show orders that are 'ready' or 'payment_pending' or just not delivered/cancelled
        const isPending = order.paymentStatus === 'pending' && order.status !== 'cancelled';

        return matchesTab && matchesSearch && isPending;
    });

    const handlePayNow = (orderId) => {
        // Logic for triggering payment
        alert(`Proceeding to pay for order ${orderId}`);
    };

    const StatusBadge = ({ status }) => {
        const styles = {
            ready: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            payment_pending: 'bg-amber-100 text-amber-700 border-amber-200',
            draft: 'bg-gray-100 text-gray-700 border-gray-200',
            default: 'bg-blue-100 text-blue-700 border-blue-200'
        };
        const currentStyle = styles[status] || styles.default;
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle} capitalize`}>
                {(status || 'unknown').replace('_', ' ')}
            </span>
        );
    };

    return (
        <div className="p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <DollarSign className="w-7 h-7 text-blue-600" />
                        Shipment Payments
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                        Manage your pending payments for active shipments.
                    </p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search Order ID..."
                        className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                            <CreditCard className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Wait for online Payments</p>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {orders.filter(o => o.paymentMode === 'Prepaid' && o.paymentStatus === 'pending').length} Orders
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                            <Truck className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">COD (Collect On Delivery)</p>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {orders.filter(o => o.paymentMode === 'COD' && o.paymentStatus === 'pending').length} Orders
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Pending Value</p>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                ₹{filteredOrders.reduce((sum, o) => sum + (o.shippingCost || 0), 0).toFixed(2)}
                            </h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-8 w-fit">
                <button
                    onClick={() => setActiveTab('prepaid')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'prepaid' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Online Payment
                </button>
                <button
                    onClick={() => setActiveTab('cod')}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'cod' ? 'bg-white dark:bg-gray-700 text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    COD Orders
                </button>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500">Fetching your shipment data...</p>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
                    <Package className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No pending payments found</h3>
                    <p className="text-gray-500">Everything seems to be clear!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map(order => (
                        <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm transition-all hover:shadow-lg group">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                        {order.orderId || 'ORD-NEW'}
                                    </h4>
                                    <p className="text-xs text-gray-500 font-mono mt-0.5">{order._id.substring(18)}</p>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5"><User className="w-4 h-4" /> Consignee</span>
                                    <span className="font-semibold text-gray-800 dark:text-gray-200">{order.consignee?.firstName} {order.consignee?.lastName}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5"><Truck className="w-4 h-4" /> Service</span>
                                    <span className="font-medium px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded text-xs">{order.serviceType || 'Express'}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-1.5"><AlertCircle className="w-4 h-4" /> Weight</span>
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{order.chargeableWeight || 0} Kg</span>
                                </div>
                            </div>

                            <div className="flex items-end justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Total Chargeable Amount</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white tracking-tight">₹{(order.shippingCost || 0).toFixed(2)}</p>
                                </div>
                                {activeTab === 'prepaid' ? (
                                    <button
                                        onClick={() => handlePayNow(order._id)}
                                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
                                    >
                                        Pay Now
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-emerald-600">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="text-sm font-bold">COD Auto-Accept</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShipmentPayment;
