import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ArrowLeft, Package, MapPin, Truck, Calendar, CreditCard, User,
    AlertCircle, CheckCircle2, Clock, FileText, ShieldCheck,
    Image as ImageIcon, X, Building2, Wallet, Info, ChevronRight,
    TrendingUp, TrendingDown, Monitor, Download, RefreshCw
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
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Synchronizing Dossier...</p>
        </div>
    );

    if (error || !order) return (
        <div className="p-10 text-center bg-white rounded-[40px] border border-slate-100 m-10">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
            <div className="text-slate-900 font-bold mb-4">{error || 'Order not found'}</div>
            <button onClick={onBack} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Go Back</button>
        </div>
    );

    // Dynamic Steps mapping based on order.status
    const steps = [
        {
            id: 'processing',
            title: 'Processing Terminal',
            desc: 'Order identified and awaiting verification.',
            subItems: ['Manifest Recorded', 'Quality Check', 'Label Registered'],
            icon: <Clock className="w-4 h-4" />,
            completed: ['packed', 'manifested', 'dispatched', 'received'].includes(order.status),
            active: ['draft', 'ready', 'paid'].includes(order.status)
        },
        {
            id: 'pickup',
            title: 'Logistics Handoff',
            desc: 'Parcel transferred to courier network.',
            subItems: ['Carrier Assigned', 'Pickup Dispatched'],
            icon: <Truck className="w-4 h-4" />,
            completed: ['dispatched', 'received'].includes(order.status),
            active: order.status === 'manifested'
        },
        {
            id: 'transit',
            title: 'Global Transit',
            desc: 'In motion to destination hub.',
            subItems: ['In Transit', 'Destination Arrival'],
            icon: <Package className="w-4 h-4" />,
            completed: order.status === 'received',
            active: order.status === 'dispatched'
        },
        {
            id: 'delivered',
            title: 'Success Delivered',
            desc: 'Consignee signaled receipt.',
            subItems: ['Final Delivery', 'Seal Confirmed'],
            icon: <CheckCircle2 className="w-4 h-4" />,
            completed: order.status === 'received',
            active: order.status === 'received'
        }
    ];

    const customerPaid = parseFloat(order.shippingCost || 0);
    const actualCost = order.actualCost ? parseFloat(order.actualCost) : customerPaid * 0.85;
    const netProfit = customerPaid - actualCost;
    const items = Array.isArray(order.items) ? order.items : [];

    return (
        <div className="bg-slate-50/20 min-h-screen p-6 lg:p-10 font-sans animate-in fade-in duration-700">
            <div className="max-w-[1400px] mx-auto mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Order Details</h1>
                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">Tracking Reference: {order.tracking_id || order.id}</p>
                </div>
                <button onClick={onBack} className="p-2.5 bg-white hover:bg-slate-900 hover:text-white rounded-xl transition-all text-slate-400 shadow-sm border border-slate-100"><X className="w-4 h-4" /></button>
            </div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Status Column */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8">
                        <div className="flex items-center gap-2 mb-8">
                            <Truck className="w-4 h-4 text-red-500" />
                            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Logistics Timeline</h2>
                        </div>

                        {order.tracking_id ? (
                            <div className="mb-8 bg-blue-50/30 p-6 rounded-2xl border border-blue-100/50 flex items-center justify-between">
                                <div>
                                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">Active Tracking ID</p>
                                    <p className="text-xl font-black text-blue-900 tracking-tighter">{order.tracking_id}</p>
                                </div>
                                <div className="p-2 bg-white rounded-lg shadow-sm"><RefreshCw className="w-4 h-4 text-blue-600" /></div>
                            </div>
                        ) : (
                            <div className="mb-8 p-6 bg-slate-50 rounded-2xl border border-dotted border-slate-200 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Awaiting Last Mile ID</p>
                            </div>
                        )}

                        <div className="relative space-y-10 pl-1">
                            {steps.map((step, idx) => (
                                <div key={step.id} className="relative flex gap-6">
                                    {idx !== steps.length - 1 && (
                                        <div className={`absolute left-4 top-10 bottom-[-2.5rem] w-[1px] ${step.completed ? 'bg-green-500' : 'bg-slate-100'}`} />
                                    )}
                                    <div className={`relative z-10 w-8 h-8 rounded-full border-2 border-white flex items-center justify-center transition-all ${step.completed ? 'bg-green-500 text-white' : step.active ? 'bg-amber-100 text-amber-600 scale-110 shadow-lg shadow-amber-200/50' : 'bg-slate-50 text-slate-300'}`}>
                                        {step.completed ? <CheckCircle2 className="w-4 h-4" /> : step.icon}
                                    </div>
                                    <div className="pt-0.5">
                                        <h3 className={`text-[11px] font-black uppercase tracking-tight ${step.active || step.completed ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</h3>
                                        <p className="text-[9px] text-slate-500 font-bold mt-0.5 leading-relaxed">{step.desc}</p>
                                        <div className="mt-3 flex gap-2">
                                            {step.subItems.map((item, sid) => (
                                                <span key={sid} className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${step.completed ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-300'}`}>{item}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Informatics Column */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Route Card */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-10 overflow-hidden relative">
                        <div className="grid grid-cols-2 gap-12 relative z-10">
                            <div className="absolute left-1/2 top-8 -translate-x-1/2 w-32 border-t border-dashed border-slate-100" />
                            {/* ORIGIN */}
                            <div>
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-6"><Building2 className="w-5 h-5 text-slate-400" /></div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                    {order.pickup?.city || order.pickup_city || 'ORIGIN'}
                                </h2>
                                <p className="text-[9px] font-black text-slate-400 tracking-widest mt-1 uppercase">
                                    Pincode: {order.pickup?.pincode || order.pickup_pincode || 'N/A'}
                                </p>
                                <p className="text-[10px] text-slate-500 font-bold mt-4 leading-relaxed line-clamp-2 uppercase">
                                    {order.pickup?.address || order.pickup_address || order.pickup?.name || 'Pickup Point Address'}
                                </p>
                                {order.pickup?.name && (
                                    <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">
                                        {order.pickup.name} {order.pickup.phone ? `• ${order.pickup.phone}` : ''}
                                    </p>
                                )}
                            </div>
                            {/* DESTINATION */}
                            <div className="text-right">
                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center ml-auto mb-6"><MapPin className="w-5 h-5 text-slate-400" /></div>
                                <h2 className="text-lg font-black text-slate-900 uppercase tracking-tighter">
                                    {order.consignee_city || order.receiver_city || 'DESTINATION'}
                                </h2>
                                <p className="text-[9px] font-black text-slate-400 tracking-widest mt-1 uppercase">
                                    Pincode: {order.consignee_pincode || order.receiver_pincode || 'N/A'}
                                </p>
                                <p className="text-[10px] text-slate-500 font-bold mt-4 leading-relaxed line-clamp-2 uppercase">
                                    {order.consignee_address || order.receiver_address || 'Delivery Point'}
                                </p>
                                <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase">
                                    {order.consignee_name || order.receiver_name || ''}
                                    {(order.consignee_phone || order.receiver_mobile) ? ` • ${order.consignee_phone || order.receiver_mobile}` : ''}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Informatics */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-10 text-center">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Customer Wallet Debit</p>
                            <p className="text-4xl font-black text-slate-900 tracking-tighter">₹ {customerPaid.toFixed(2)}</p>
                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Paid via Wallet</span>
                            </div>
                        </div>
                        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-10 text-center relative overflow-hidden group">
                            <div className="absolute -right-4 -top-4 w-12 h-12 bg-green-50 rounded-full blur-xl group-hover:scale-150 transition-all" />
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Net Profit Strategy</p>
                            <p className="text-4xl font-black text-green-600 tracking-tighter">+ ₹ {netProfit.toFixed(2)}</p>
                            <p className="text-[9px] font-bold text-slate-300 uppercase mt-4 tracking-tighter">Actual Org Cost: ₹ {actualCost.toFixed(2)}</p>
                        </div>
                    </div>

                    {/* Vitals */}
                    <div className="grid grid-cols-3 gap-6">
                        {[
                            { label: 'Dead Mass', value: `${order.weight || 0}kg` },
                            { label: 'Package Type', value: order.order_type || 'SHIPMENT' },
                            { label: 'Client Email', value: order.creator_email || 'N/A' }
                        ].map((v, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-slate-50 p-6 flex flex-col items-center justify-center">
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">{v.label}</p>
                                <p className="text-[11px] font-black text-slate-700 uppercase tracking-tighter text-center truncate w-full">{v.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Item Ledger */}
                    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="px-10 py-6 bg-slate-50/20 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Package Inventory</h3>
                            <button className="text-[9px] font-black text-blue-600 uppercase tracking-tighter flex items-center gap-2 hover:bg-blue-50 px-3 py-1 rounded-lg transition-all">Download Label <Download className="w-3 h-3" /></button>
                        </div>
                        <div className="p-6 space-y-3">
                            {items.map((item, idx) => (
                                <div key={idx} className="bg-slate-50/30 border border-transparent hover:border-slate-100 p-6 rounded-2xl flex items-center justify-between transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-slate-300 group-hover:text-red-500 transition-colors">
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black text-slate-900 uppercase leading-none">{item.name || 'Shipment Unit'}</h4>
                                            <p className="text-[9px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">Qty: {item.quantity || 1} • Value: ₹{item.value || 0}</p>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-black text-slate-900">{item.weight || order.weight}kg</span>
                                </div>
                            ))}
                            {items.length === 0 && (
                                <div className="py-12 text-center border border-dashed border-slate-100 rounded-2xl m-4">
                                    <Package className="w-8 h-8 text-slate-100 mx-auto mb-3" />
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.4em]">Inventory Empty</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewOrder;
