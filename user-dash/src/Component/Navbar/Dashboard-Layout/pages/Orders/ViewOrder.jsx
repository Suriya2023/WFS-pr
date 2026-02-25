import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft, Package, MapPin, Truck, Calendar, CreditCard, User,
    AlertCircle, CheckCircle2, Clock, FileText, ShieldCheck,
    Image as ImageIcon, X, Building2, Wallet, Info, ChevronRight,
    TrendingUp, TrendingDown, Monitor, Download, RefreshCw, Box
} from 'lucide-react';

const ViewOrder = ({ orderId, onBack }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders.php?id=${orderId}`, config);
                setOrder(data);
            } catch (err) {
                console.error('Error fetching order details:', err);
                setError('Failed to load order details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading Order Intel...</p>
        </div>
    );

    if (error || !order) return (
        <div className="p-10 text-center bg-white rounded-[40px] border border-slate-100 m-10">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <div className="text-slate-900 font-bold mb-4">{error || 'Order not found'}</div>
            <button onClick={onBack} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Go Back</button>
        </div>
    );

    const formatOrderId = (order) => {
        if (!order.created_at) return `#ORD-${order.id}`;
        const date = new Date(order.created_at);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `#ORD-${yyyy}${mm}${dd}-${order.id}`;
    };

    const formatOrderDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }) + ' at ' + date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).toLowerCase();
    };

    const items = Array.isArray(order.items) ? order.items : [];
    const deadWeight = parseFloat(order.weight || 0);
    const volumetricWeight = items.reduce((sum, item) => {
        const l = parseFloat(item.length || 0);
        const b = parseFloat(item.breadth || 0);
        const h = parseFloat(item.height || 0);
        return sum + ((l * b * h) / 5000);
    }, 0);
    const chargeableWeight = Math.max(deadWeight, volumetricWeight);

    return (
        <div className="bg-slate-50/20 min-h-screen p-4 lg:p-8 font-sans animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="max-w-[1400px] mx-auto mb-10">
                <div className="flex items-start gap-4 mb-2">
                    <button onClick={onBack} className="mt-1 text-slate-400 hover:text-slate-900 transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                                Order {formatOrderId(order)}
                            </h1>
                            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
                                {order.status?.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-slate-400 mt-1">
                            Placed on {formatOrderDate(order.created_at)}
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Tracking Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Truck className="w-5 h-5 text-slate-400" />
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Tracking Info</h2>
                        </div>

                        {/* AWB Card */}
                        <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-10">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">TRACKING ID / AWB</p>
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-black text-blue-700 tracking-tight">
                                    {order.tracking_id || 'BGL-PENDING'}
                                </h3>
                                <button className="px-4 py-1.5 bg-white border border-blue-200 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                    Track
                                </button>
                            </div>
                            <p className="text-[9px] font-bold text-blue-400 mt-2 uppercase">Courier: BGL-EXPRESS</p>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-12 pl-1 relative">
                            {Array.isArray(order.history) && order.history.length > 0 ? (
                                order.history.map((item, idx) => (
                                    <div key={idx} className="relative flex gap-6 group">
                                        {idx !== order.history.length - 1 && (
                                            <div className="absolute left-[15px] top-8 bottom-[-3rem] w-[2px] bg-slate-100" />
                                        )}
                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 shadow-sm ${idx === 0
                                            ? 'bg-blue-600 text-white border-2 border-white ring-4 ring-blue-50'
                                            : 'bg-white border-2 border-slate-100 text-slate-300'
                                            }`}>
                                            {idx === 0 ? <TrendingUp className="w-4 h-4 animate-pulse" /> : <CheckCircle2 className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h4 className={`text-[13px] font-black uppercase tracking-tight ${idx === 0 ? 'text-blue-600' : 'text-slate-900'}`}>
                                                    {item.status?.replace('_', ' ') || 'Process Update'}
                                                </h4>
                                                <span className="text-[9px] font-black text-slate-300 uppercase shrink-0">
                                                    {new Date(item.created_at || item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">
                                                {item.remark || 'Shipment status updated in BGL network.'}
                                            </p>
                                            {(item.location || (idx === 0 && order.current_location)) && (
                                                <div className="mt-2 flex items-center gap-1.5">
                                                    <div className="w-1 h-1 rounded-full bg-blue-500" />
                                                    <p className="text-[9px] text-blue-500 font-black uppercase tracking-widest">
                                                        {item.location || order.current_location || 'BGL HUB'}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="py-10 text-center">
                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic">Awaiting Terminal Signal...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Informatics */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Route Card */}
                    <div className="bg-white rounded-3xl border-t-4 border-t-blue-500 border-x border-b border-slate-100 shadow-sm p-10">
                        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-8">
                            {/* ORIGIN */}
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">ORIGIN</span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                    {order.pa_name || order.pickup_name || 'BGL Hub Node'}
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold mt-2 leading-relaxed uppercase opacity-70">
                                    {order.pa_address || order.pickup_address || 'Pickup Point Terminal'}<br />
                                    {order.pa_city || order.pickup_city || 'Surat'}, {order.pa_state || order.pickup_state || 'Gujarat'} - {order.pa_pincode || order.pickup_pincode || ''}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Phone: {order.pa_phone || order.pickup_phone || 'N/A'}</p>
                            </div>

                            {/* Connection */}
                            <div className="flex flex-col items-center">
                                <div className="w-32 border-t-2 border-dotted border-slate-100 relative">
                                    <Truck className="w-5 h-5 text-slate-200 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1" />
                                </div>
                            </div>

                            {/* DESTINATION */}
                            <div className="text-right">
                                <div className="flex items-center justify-end gap-3 mb-6">
                                    <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">DESTINATION</span>
                                    <div className="w-8 h-8 bg-green-50 text-green-600 rounded-lg flex items-center justify-center"><MapPin className="w-4 h-4" /></div>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                    {order.consignee_name || 'Receiver Node'}
                                </h3>
                                <p className="text-[10px] text-slate-500 font-bold mt-2 leading-relaxed uppercase opacity-70">
                                    {order.consignee_address || 'Delivery Terminal'}<br />
                                    {order.consignee_city || 'Destination hub'}, {order.destination_country || ''} - {order.consignee_pincode || ''}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">Phone: {order.consignee_phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Shipment Content Ledger */}
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 pb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-slate-400" />
                                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Shipment Content</h3>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg border border-blue-100">SINGLE BOX</span>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{items.length} Items</span>
                        </div>

                        <div className="px-8 pb-8">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="py-6 font-black">Product</th>
                                        <th className="py-6 font-black text-center">Qty</th>
                                        <th className="py-6 font-black text-center">Unit Price</th>
                                        <th className="py-6 font-black text-center">Tax Origin</th>
                                        <th className="py-6 font-black text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {items.map((item, idx) => (
                                        <tr key={idx} className="group transition-colors">
                                            <td className="py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-200 group-hover:bg-blue-50 group-hover:text-blue-500 transition-all duration-500 overflow-hidden border border-slate-100/50">
                                                        {(item.images && item.images.length > 0) ? (
                                                            <img
                                                                src={`${import.meta.env.VITE_API_BASE_URL.replace('/api', '').replace('/backend', '')}${item.images[0]}`}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.onerror = null;
                                                                    e.target.src = ''; // Fallback to icon if image fails
                                                                    e.target.parentElement.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
                                                                }}
                                                            />
                                                        ) : (
                                                            <Box className="w-5 h-5" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name || 'Shipment Unit'}</p>
                                                        <p className="text-[9px] text-slate-300 font-bold mt-1 uppercase">SKU: {item.sku || 'N/A'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 text-center text-[11px] font-bold text-slate-600">{item.quantity || 1}</td>
                                            <td className="py-6 text-center text-[11px] font-bold text-slate-600">₹{item.value || 0}</td>
                                            <td className="py-6 text-center text-[10px] font-black text-slate-300 uppercase italic">Incl.</td>
                                            <td className="py-6 text-right text-[11px] font-black text-slate-900">₹{(item.quantity || 1) * (item.value || 0)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="4" className="py-6 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Subtotal</td>
                                        <td className="py-6 text-right text-[12px] font-black text-slate-900 tracking-tight">₹{items.reduce((sum, i) => sum + (i.quantity || 1) * (i.value || 0), 0)}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            {/* Package Vitals Footer */}
                            <div className="mt-12 pt-12 border-t border-slate-50 grid grid-cols-4 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">DEAD WEIGHT</p>
                                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{deadWeight.toFixed(2)} kg</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">VOLUMETRIC</p>
                                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{volumetricWeight.toFixed(2)} kg</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest">CHARGEABLE</p>
                                    <p className="text-[14px] font-black text-blue-600 uppercase tracking-tight">{chargeableWeight.toFixed(2)} kg</p>
                                </div>
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">DIMENSIONS</p>
                                    <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">
                                        {items[0]?.length || '0'} × {items[0]?.breadth || '0'} × {items[0]?.height || '0'} cm
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewOrder;
