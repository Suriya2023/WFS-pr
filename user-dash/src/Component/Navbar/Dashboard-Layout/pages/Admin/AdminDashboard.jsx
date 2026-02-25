import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
    Shield, CheckCircle, XCircle, Users, FileText, Download, Trash2, Edit, AlertTriangle,
    Search, Filter, Home, ExternalLink, MoreVertical, Package, Truck, Clock,
    ArrowRight, Wallet, History, CreditCard, MapPin, Eye, FileDigit, Plus, Monitor, User, Link, X,
    ChevronRight, Send, HelpCircle, Zap, AlertCircle, RefreshCw, Printer, Ban, Lock
} from 'lucide-react';
import AdminKycPage from './AdminKycPage';
import AddOrderModal from '../OrderTable/AddOrderModal';

function AdminDashboard({ activeTab: parentActiveTab, setActiveRoute, setSelectedOrderId }) {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalShipments: 0,
        pendingKYCs: 0,
        totalManifests: 0,
        activePickups: 0,
        dispatchedOrders: 0,
        csbOrders: 0,
        disputedOrders: 0
    });
    const [activeTab, setActiveTab] = useState(parentActiveTab || 'dashboard');
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [shipments, setShipments] = useState([]);
    const [orderSubTab, setOrderSubTab] = useState('All Orders');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [activeActionMenu, setActiveActionMenu] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, right: 16 });

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    const menuRef = useRef(null);
    const [shipmentSearch, setShipmentSearch] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');

    useEffect(() => {
        if (parentActiveTab) setActiveTab(parentActiveTab);
    }, [parentActiveTab]);

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveActionMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const [pendingRes, usersRes, analyticsRes, shipmentsRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/kyc/pending.php`, config).catch(e => ({ data: [] })),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users.php`, config).catch(e => ({ data: [] })),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/analytics.php`, config).catch(e => ({ data: {} })),
                axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/list.php?all=true`, config).catch(e => ({ data: [] }))
            ]);
            setUsers(usersRes.data || []);
            setStats({
                totalUsers: usersRes.data?.length || 0,
                totalShipments: shipmentsRes.data?.length || 0,
                pendingKYCs: pendingRes.data?.length || 0,
                csbOrders: analyticsRes.data?.csbOrders || 0,
                totalManifests: analyticsRes.data?.totalManifests || 0,
                activePickups: analyticsRes.data?.activePickups || 0,
                dispatchedOrders: analyticsRes.data?.dispatchedOrders || 0,
                disputedOrders: analyticsRes.data?.disputedOrders || 0
            });
            setShipments(shipmentsRes.data || []);
        } catch (error) { console.error('Error:', error); }
        finally { setLoading(false); }
    };

    const handleViewOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setActiveRoute('view-order');
        setActiveActionMenu(null);
    };

    const handleDeleteOrder = async (id) => {
        if (!window.confirm('Permanent Delete Order Protocol? This cannot be undone.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/delete.php?id=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShipments(prev => prev.filter(s => s.id !== id));
        } catch (e) {
            alert(e.response?.data?.message || 'Delete failed. Check admin privileges.');
        }
        setActiveActionMenu(null);
    };

    const handleBlockUser = async (user) => {
        const action = user.is_blocked ? 'unblock' : 'block';
        if (!window.confirm(`Execute ${action} protocol for user ${user.id}?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users.php`,
                { action: 'toggle_block', user_id: user.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchInitialData();
        } catch (e) { alert('Action failed'); }
        setActiveActionMenu(null);
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('PERMANENT WIPE PROTOCOL? This will delete the user node and all associated data.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users.php`,
                { action: 'delete_user', user_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setUsers(prev => prev.filter(u => u.id !== id));
            alert('Node wiped successfully.');
        } catch (e) {
            alert(e.response?.data?.message || 'Delete failed.');
        }
        setActiveActionMenu(null);
    };

    const [showUserEditModal, setShowUserEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users.php`,
                { action: 'update_user', user_id: editingUser.id, ...editingUser },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setShowUserEditModal(false);
            fetchInitialData();
            alert('Intel updated successfully.');
        } catch (e) {
            alert('Update failed');
        }
    };

    const handleVerifyOrder = async (id) => {
        if (!window.confirm('Execute Verify Protocol? A tracking ID will be generated.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/verify.php`,
                { shipment_id: id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Shipment Verified and Tracking ID assigned.');
            fetchInitialData();
        } catch (e) {
            alert(e.response?.data?.message || 'Verification failed.');
        }
        setActiveActionMenu(null);
    };

    const handleEditOrder = (order) => {
        setEditingOrder(order);
        setShowEditModal(true);
        setActiveActionMenu(null);
    };

    const ActionMenu = ({ id, type, data }) => (
        <div ref={menuRef} className="fixed w-64 bg-white rounded-3xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.3)] border border-slate-100 z-[9999] py-4 animate-in fade-in zoom-in duration-200"
            style={{ top: menuPosition.top, right: menuPosition.right }}
        >
            <button onClick={() => type === 'order' ? handleViewOrder(id) : (setSelectedUser(data) || setShowUserModal(true))} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 text-slate-700 transition-all group">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Eye className="w-4 h-4" /></div>
                <span className="text-[13px] font-black">Open Dossier</span>
            </button>
            <button onClick={() => type === 'order' ? handleEditOrder(data) : null} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-50 text-slate-700 transition-all group">
                <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all"><Edit className="w-4 h-4" /></div>
                <div className="flex-1 flex justify-between items-center">
                    <span className="text-[13px] font-black">Modify Intel</span>
                    {type === 'order' && <span className="text-[9px] text-slate-400 font-bold uppercase">ALt+Shift+E</span>}
                </div>
            </button>
            {type === 'user' && (
                <button onClick={() => handleBlockUser(data)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-orange-50 text-slate-700 transition-all group">
                    <div className={`p-2 ${data.is_blocked ? 'bg-green-50 text-green-600 group-hover:bg-green-600' : 'bg-orange-50 text-orange-600 group-hover:bg-orange-600'} rounded-xl group-hover:text-white transition-all`}><Ban className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">{data.is_blocked ? 'Activate Hub' : 'Suspend Node'}</span>
                </button>
            )}
            {type === 'user' && (
                <button onClick={() => { setEditingUser(data); setShowUserEditModal(true); setActiveActionMenu(null); }} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-amber-50 text-slate-700 transition-all group">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all"><Edit className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">Modify Intel</span>
                </button>
            )}
            {type === 'order' && data.status !== 'ready' && data.status !== 'cancelled' && (
                <button onClick={() => handleVerifyOrder(id)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-green-50 text-slate-700 transition-all group">
                    <div className="p-2 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all"><CheckCircle className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">Verify Order</span>
                </button>
            )}
            <div className="my-2 border-t border-slate-50 mx-6" />
            <button onClick={() => type === 'order' ? handleDeleteOrder(id) : null} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-red-50 text-red-600 transition-all group">
                <div className="p-2 bg-red-50 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all"><Trash2 className="w-4 h-4" /></div>
                <span className="text-[11px] font-black uppercase tracking-widest">Wipe Data</span>
            </button>
        </div>
    );

    const renderDashboard = () => (
        <div className="space-y-12 animate-in fade-in duration-700">
            <div>
                <h1 className="text-4xl font-black text-[#E31E24] tracking-tight">Admin Dashboard</h1>
                <p className="text-slate-500 font-bold mt-2 uppercase text-[11px] tracking-widest">Global Logistics Terminal Operating System</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <SimpleStatCard onClick={() => setActiveTab('orders')} icon={<Package className="text-orange-600" />} label="All Orders" count={stats.totalShipments} />
                <SimpleStatCard onClick={() => { setActiveTab('orders'); setOrderSubTab('CSB'); }} icon={<CreditCard className="text-blue-600" />} label="CSB Hub" count={stats.csbOrders} />
                <SimpleStatCard onClick={() => setActiveTab('users')} icon={<Users className="text-red-600" />} label="Nodes" count={stats.totalUsers} />
                <SimpleStatCard onClick={() => setActiveRoute('manifests')} icon={<FileText className="text-green-600" />} label="Manifest History" count={stats.totalManifests} />
                <SimpleStatCard onClick={() => setActiveRoute('pickups')} icon={<Truck className="text-red-600" />} label="Active Pickups" count={stats.activePickups} />
                <SimpleStatCard onClick={() => { setActiveTab('orders'); setOrderSubTab('Dispatched'); }} icon={<Package className="text-purple-600" />} label="In Flight" count={stats.dispatchedOrders} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-3"><AlertTriangle className="text-orange-500 w-5 h-5" /><h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">Systems Alert</h3></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ActionRequiredCard label="KYC Pending" count={stats.pendingKYCs} icon={<FileDigit className="text-blue-600" />} color="blue" onClick={() => setActiveTab('kyc')} />
                        <ActionRequiredCard label="CSB Protocol" count={stats.csbOrders} icon={<AlertCircle className="text-purple-600" />} color="purple" onClick={() => { setActiveTab('orders'); setOrderSubTab('CSB'); }} />
                        <ActionRequiredCard label="Disputed" count={stats.disputedOrders} icon={<XCircle className="text-red-600" />} color="red" onClick={() => { setActiveTab('orders'); setOrderSubTab('Cancelled'); }} />
                    </div>
                </div>

                <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner"><Wallet className="text-slate-900 w-6 h-6" /></div>
                        <h3 className="font-black text-slate-900 text-xl uppercase tracking-tight">Financial Pulse</h3>
                    </div>
                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {users.slice(0, 10).map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-all border border-slate-50/50 shadow-sm">
                                <div><p className="text-[11px] font-black text-slate-900 uppercase">{u.firstname} {u.lastname}</p><p className="text-[10px] text-slate-400 font-bold mt-1">₹ {parseFloat(u.wallet_balance || 0).toFixed(2)}</p></div>
                                <button onClick={() => { setSelectedUser(u); setShowUserModal(true); }} className="text-blue-600 hover:scale-110 transition-transform"><ArrowRight className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderOrders = () => {
        const filteredShipments = shipments.filter(s => {
            const matchesSearch = s.consignee_name?.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
                String(s.id).includes(shipmentSearch) ||
                s.tracking_id?.toLowerCase().includes(shipmentSearch.toLowerCase()) ||
                s.creator_email?.toLowerCase().includes(shipmentSearch.toLowerCase());
            if (shipmentSearch) return matchesSearch;
            if (orderSubTab === 'All Orders') return true;
            if (orderSubTab === 'CSB') return s.destination_country?.toLowerCase() !== 'india';
            if (orderSubTab === 'Tracking') return s.tracking_id;
            return s.status?.toLowerCase() === orderSubTab.toLowerCase();
        });

        const tabs = ['All Orders', 'Drafts', 'Ready', 'Packed', 'Manifested', 'Dispatched', 'Received', 'RTO', 'Cancelled', 'Disputed', 'Tracking'];

        return (
            <div className="animate-in fade-in duration-700 bg-slate-50/20 min-h-screen">
                <div className="flex flex-wrap gap-x-4 gap-y-2 px-6 py-3 border-b border-slate-100 sticky top-0 z-10 bg-white shadow-sm">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setOrderSubTab(tab)} className={`relative pb-3 px-2 text-[10px] font-black uppercase tracking-tight transition-all ${orderSubTab === tab ? 'text-black' : 'text-slate-400 hover:text-red-600'}`}>
                            {tab}{orderSubTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 rounded-full" />}
                        </button>
                    ))}
                </div>

                <div className="p-4 flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                        <input type="text" placeholder="Search Intel (Tracking, Name, Email)..." value={shipmentSearch} onChange={e => setShipmentSearch(e.target.value)} className="w-full bg-white border border-slate-100 rounded-xl pl-11 pr-5 py-2.5 text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-600/5 transition-all" />
                    </div>
                    <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"><Download className="w-3.5 h-3.5" /> Export Data</button>
                </div>

                <div className="mx-4 mb-10 rounded-[32px] border border-slate-100 bg-white shadow-xl shadow-slate-200/20" style={{ overflow: 'visible' }}>
                    <div className="overflow-x-auto rounded-[32px]">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-4 w-10 px-6"><input type="checkbox" className="rounded" /></th>
                                    <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Identity</th>
                                    <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Customer Source</th>
                                    <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Target Hub</th>
                                    <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Vitals</th>
                                    <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Capital</th>
                                    <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">State</th>
                                    <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-left">Unit ID</th>
                                    <th className="p-4 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredShipments.map(s => (
                                    <tr key={s.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="p-4 px-6"><input type="checkbox" className="rounded mt-1" /></td>
                                        <td className="p-4">
                                            <p className="text-[11px] font-black text-slate-900 leading-tight">ORD-{s.id}</p>
                                            <p className="text-[8px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{new Date(s.created_at).toLocaleDateString()}</p>
                                        </td>
                                        <td className="p-4 min-w-[200px]">
                                            <p className="text-[11px] font-black text-slate-900 uppercase">{s.firstname || 'CLIENT'} {s.lastname || ''}</p>
                                            <p className="text-[9px] text-slate-400 font-bold lowercase mt-1 tracking-tight">{s.creator_email || 'node@bgl.exp'}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-[11px] font-black text-slate-900 uppercase">{s.consignee_name || s.receiver_name}</p>
                                            <p className="text-[9px] text-blue-500 font-bold uppercase mt-1 tracking-widest">{s.destination_country || 'INDIA'}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-[11px] font-black text-slate-900 leading-tight">{s.weight || 0.2} kg</p>
                                            <p className="text-[8px] text-slate-300 font-bold mt-1 uppercase tracking-[0.2em]">{s.order_type || 'Standard'}</p>
                                        </td>
                                        <td className="p-4">
                                            <p className="text-[11px] font-black text-[#E31E24] leading-tight">₹{parseFloat(s.shippingCost || 0).toFixed(2)}</p>
                                            <span className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Post-Paid</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-[0.2em] ${s.status === 'dispatched' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {s.status === 'dispatched' ? 'IN TRANSIT' : s.status?.toUpperCase() || 'DRAFT'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {s.status === 'paid' || s.status === 'pending_payment' ? (
                                                <button onClick={() => handleVerifyOrder(s.id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-black transition-all">
                                                    Verify Now
                                                </button>
                                            ) : s.tracking_id ? (
                                                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center justify-between group/awb">
                                                    <p className="text-[10px] font-black text-slate-700">{s.tracking_id}</p>
                                                    <RefreshCw className="w-3 h-3 text-slate-300" />
                                                </div>
                                            ) : (
                                                <span className="text-[9px] font-bold text-slate-200 uppercase italic">Awaiting ID</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center relative">
                                            <button onClick={() => setActiveActionMenu({ id: s.id, type: 'order' })} className={`p-2 rounded-xl transition-all ${activeActionMenu?.id === s.id && activeActionMenu?.type === 'order' ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-300'}`}>
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                            {activeActionMenu?.id === s.id && activeActionMenu?.type === 'order' && <ActionMenu id={s.id} type="order" data={s} />}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderUsers = () => {
        const filteredUsers = users.filter(u => u.firstname?.toLowerCase().includes(customerSearch.toLowerCase()) || u.email?.toLowerCase().includes(customerSearch.toLowerCase()));
        return (
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-700 m-6">
                <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-950 uppercase tracking-tight">Active Nodes</h2>
                    <input type="text" placeholder="Search Node..." value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} className="bg-slate-50 border border-slate-100 rounded-xl px-6 py-3 text-xs font-bold outline-none w-72" />
                </div>
                <div className="overflow-x-auto min-h-[600px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 bg-slate-50/20">
                                <th className="px-12 py-8">Identity</th>
                                <th className="px-12 py-8">Network Auth</th>
                                <th className="px-12 py-8">Capital</th>
                                <th className="px-12 py-8">KYC Status</th>
                                <th className="px-12 py-8 text-center">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group relative">
                                    <td className="px-12 py-8"><p className="text-sm font-black text-slate-900 uppercase">{u.firstname} {u.lastname}</p><p className="text-[10px] text-slate-300 font-bold mt-1">UUID: {u.id}</p></td>
                                    <td className="px-12 py-8"><p className="text-sm font-black text-slate-900">{u.email}</p><p className="text-[10px] text-slate-300 font-bold mt-1">{u.phone || 'N/A'}</p></td>
                                    <td className="px-12 py-8"><p className="text-sm font-black text-slate-900">₹ {parseFloat(u.wallet_balance || 0).toLocaleString()}</p></td>
                                    <td className="px-12 py-8"><span className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest ${u.kyc_status === 'verified' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{u.kyc_status || 'Pending'}</span></td>
                                    <td className="px-12 py-8 text-center relative">
                                        <button
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const spaceBelow = window.innerHeight - rect.bottom;
                                                const top = spaceBelow < 290 ? rect.top - 290 : rect.bottom + 4;
                                                setMenuPosition({ top, right: 16 });
                                                setActiveActionMenu({ id: u.id, type: 'user' });
                                            }}
                                            className={`p-2.5 rounded-full transition-all ${activeActionMenu?.id === u.id && activeActionMenu?.type === 'user'
                                                ? 'bg-slate-900 text-white' : 'text-slate-300'
                                                }`}>
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                        {activeActionMenu?.id === u.id && activeActionMenu?.type === 'user' && <ActionMenu id={u.id} type="user" data={u} />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (loading) return <div className="h-[70vh] flex flex-col items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#E31E24] rounded-full animate-spin mb-6" />
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Syncing Network...</p>
    </div>;

    return (
        <div className="min-h-screen bg-slate-50/20 font-sans">
            <main className="max-w-[1600px] mx-auto p-4 lg:p-10">
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'orders' && renderOrders()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'kyc' && <AdminKycPage />}
            </main>

            {showUserModal && selectedUser && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
                    <div className="bg-white rounded-[48px] p-12 max-w-2xl w-full shadow-2xl relative animate-in zoom-in duration-300">
                        <button onClick={() => setShowUserModal(false)} className="absolute top-10 right-10 p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">Node Profile</h2>
                        <div className="grid grid-cols-2 gap-8">
                            <div className="p-8 bg-slate-50 rounded-[32px]"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Operator</p><p className="text-xl font-black text-slate-900 uppercase">{selectedUser.firstname} {selectedUser.lastname}</p></div>
                            <div className="p-8 bg-slate-50 rounded-[32px]"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Network Auth</p><p className="text-lg font-black text-slate-900">{selectedUser.email}</p></div>
                            <div className="p-8 bg-slate-50 rounded-[32px]"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Contact Hub</p><p className="text-lg font-black text-slate-900">{selectedUser.phone || 'N/A'}</p></div>
                            <div className="p-8 bg-slate-50 rounded-[32px]"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Liquid Balance</p><p className="text-xl font-black text-blue-600 tracking-tight">₹ {parseFloat(selectedUser.wallet_balance || 0).toLocaleString()}</p></div>
                            <div className="p-8 bg-slate-50 rounded-[32px]"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Security Clearance</p><span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${selectedUser.kyc_status === 'verified' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedUser.kyc_status || 'Pending'}</span></div>
                        </div>
                    </div>
                </div>
            )}

            {showEditModal && editingOrder && (
                <AddOrderModal isOpen={showEditModal} onClose={() => setShowEditModal(false)} editOrder={editingOrder} refreshOrders={fetchInitialData} />
            )}

            {showUserEditModal && editingUser && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 backdrop-blur-md bg-black/40">
                    <div className="bg-white rounded-[48px] p-12 max-w-2xl w-full shadow-2xl relative animate-in zoom-in duration-300">
                        <button onClick={() => setShowUserEditModal(false)} className="absolute top-10 right-10 p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all"><X className="w-6 h-6" /></button>
                        <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-8">Modify Node Intel</h2>
                        <form onSubmit={handleUpdateUser} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">First Name</label>
                                    <input type="text" value={editingUser.firstname} onChange={e => setEditingUser({ ...editingUser, firstname: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Last Name</label>
                                    <input type="text" value={editingUser.lastname} onChange={e => setEditingUser({ ...editingUser, lastname: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</label>
                                <input type="email" value={editingUser.email} onChange={e => setEditingUser({ ...editingUser, email: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Wallet Balance (₹)</label>
                                <input type="number" step="0.01" value={editingUser.wallet_balance} onChange={e => setEditingUser({ ...editingUser, wallet_balance: e.target.value })} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-xs font-bold outline-none" />
                            </div>
                            <button type="submit" className="w-full bg-slate-900 text-white rounded-[24px] py-6 font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200">Commit Changes</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

const SimpleStatCard = ({ icon, label, count, onClick }) => (
    <div onClick={onClick} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm flex flex-col items-start group hover:shadow-2xl transition-all duration-500 cursor-pointer">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-all duration-500">{icon}</div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</p>
        <p className="text-4xl font-black text-slate-950 tracking-tighter leading-none">{count}</p>
    </div>
);

const ActionRequiredCard = ({ label, count, icon, color, onClick }) => {
    const variants = { blue: 'bg-blue-50 text-blue-600 border-blue-100', purple: 'bg-purple-50 text-purple-600 border-purple-100', red: 'bg-red-50 text-red-600 border-red-100' };
    return (
        <div onClick={onClick} className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-sm flex items-center gap-8 group hover:shadow-xl transition-all cursor-pointer">
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner group-hover:rotate-6 transition-all duration-500 ${variants[color]}`}>{icon}</div>
            <div><p className="text-4xl font-black text-slate-950 tracking-tighter mb-1 leading-none">{count}</p><p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p></div>
        </div>
    );
};

export default AdminDashboard;
