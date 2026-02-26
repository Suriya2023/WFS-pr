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
import CustomerDetailsModal from './CustomerDetailsModal';

function AdminDashboard({ activeTab: parentActiveTab, setActiveRoute, setSelectedOrderId, user }) {
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

    // Image path resolver logic (Unified with ViewOrder)
    const getItemImage = (img) => {
        if (!img) return null;
        if (img.startsWith('data:image')) return img;
        if (img.startsWith('http')) return img;
        let path = img.startsWith('/') ? img.substring(1) : img;
        const baseUrl = import.meta.env.VITE_API_BASE_URL.replace(/\/api$/, '').replace(/\/+$/, '');
        if (path.startsWith('backend/') && baseUrl.endsWith('/backend')) {
            return `${baseUrl.substring(0, baseUrl.length - 8)}/${path}`;
        }
        return `${baseUrl}/${path}`;
    };

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
    const [selectedOrders, setSelectedOrders] = useState([]);

    useEffect(() => {
        setSelectedOrders([]);
    }, [orderSubTab]);

    const handleSelectAll = (currentShipments) => {
        if (selectedOrders.length === currentShipments.length && currentShipments.length > 0) {
            setSelectedOrders([]);
        } else {
            setSelectedOrders(currentShipments.map(s => s.id));
        }
    };

    const toggleOrderSelection = (id) => {
        setSelectedOrders(prev =>
            prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
        );
    };

    const menuRef = useRef(null);
    const [shipmentSearch, setShipmentSearch] = useState('');
    const [customerSearch, setCustomerSearch] = useState('');

    useEffect(() => {
        if (parentActiveTab) setActiveTab(parentActiveTab);
        if (parentActiveTab === 'manifests') setOrderSubTab('Manifested');
        if (parentActiveTab === 'pickups') setOrderSubTab('Picked Up');
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

            const allShipments = shipmentsRes.data || [];

            setUsers(usersRes.data || []);
            setStats({
                totalUsers: usersRes.data?.length || 0,
                totalShipments: allShipments.length,
                pendingKYCs: pendingRes.data?.length || 0,
                csbOrders: allShipments.filter(s => s.destination_country && s.destination_country.toLowerCase() !== 'india').length,
                totalManifests: allShipments.filter(s => s.status === 'manifested').length,
                activePickups: allShipments.filter(s => s.status === 'picked_up').length,
                dispatchedOrders: allShipments.filter(s => s.status === 'dispatched' || s.status === 'in_transit').length,
                disputedOrders: allShipments.filter(s => s.status === 'cancelled' || s.status === 'disputed').length
            });
            setShipments(allShipments);
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

    const handleUpdateStatus = async (id, status, remark = '', location = 'BGL Hub') => {
        if (!window.confirm(`Update shipment status to ${status.toUpperCase()}?`)) return;
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/update_status.php`,
                { shipment_id: id, status, remark, location },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert(`Shipment status updated to ${status}.`);
            fetchInitialData();
        } catch (e) {
            alert(e.response?.data?.message || 'Update failed.');
        }
        setActiveActionMenu(null);
    };

    const handleEmitManifest = async (id) => {
        if (!window.confirm('Emit Manifest and Generate Pickup Request Protocol?')) return;
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 1. Create Manifest records and link shipment
            const manifestRes = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/manifest/create.php`,
                { shipment_ids: [id] },
                config
            );

            const manifestId = manifestRes.data.manifest_id;

            if (manifestId) {
                // 2. Generate Pickup Request for this manifest
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/pickup/request.php`,
                    { manifest_id: manifestId },
                    config
                );

                // 3. Log to history via update_status
                await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/update_status.php`,
                    { shipment_id: id, status: 'manifested', remark: 'Manifest generated and pickup scheduled automatically', location: 'BGL Hub' },
                    config
                );

                alert('Manifest Emitted & Pickup Request Generated Successfully.');
                fetchInitialData();
            }
        } catch (e) {
            console.error('Manifest/Pickup Error:', e);
            alert(e.response?.data?.message || 'Operation failed. Check manifest/pickup APIs.');
        }
        setActiveActionMenu(null);
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

    const handleEditOrder = async (order) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            // Fetch complete details to ensure items and pickup info are present
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/update.php?id=${order.id}`, config);
            setEditingOrder({ ...data, id: order.id }); // Ensure ID is preserved
            setShowEditModal(true);
            setActiveActionMenu(null);
        } catch (error) {
            console.error('Failed to fetch full order details:', error);
            alert('Could not load complete order data.');
        }
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
            {type === 'order' && data.status !== 'ready' && data.status !== 'cancelled' && (data.status === 'paid' || data.status === 'draft') && (
                <button onClick={() => handleVerifyOrder(id)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-green-50 text-slate-700 transition-all group">
                    <div className="p-2 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all"><CheckCircle className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">Verify Order</span>
                </button>
            )}
            {type === 'order' && data.status === 'ready' && (
                <button onClick={() => handleUpdateStatus(id, 'packed', 'Shipment has been securely packed at hub')} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-blue-50 text-slate-700 transition-all group">
                    <div className="p-2 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Package className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">Mark Packed</span>
                </button>
            )}
            {type === 'order' && data.status === 'packed' && (
                <button onClick={() => handleEmitManifest(id)} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-purple-50 text-slate-700 transition-all group">
                    <div className="p-2 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all"><FileText className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">Emit Manifest</span>
                </button>
            )}
            {type === 'order' && data.status === 'manifested' && (
                <button onClick={() => handleUpdateStatus(id, 'picked_up', 'Shipment picked up by field agent')} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-amber-50 text-slate-700 transition-all group">
                    <div className="p-2 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all"><Truck className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">Mark Picked Up</span>
                </button>
            )}
            {type === 'order' && data.status === 'picked_up' && (
                <button onClick={() => handleUpdateStatus(id, 'dispatched', 'Shipment in transit to destination')} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-900 text-slate-700 transition-all group">
                    <div className="p-2 bg-slate-50 rounded-xl text-slate-900 group-hover:bg-slate-900 group-hover:text-white transition-all"><Send className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">Dispatch Node</span>
                </button>
            )}
            {type === 'order' && data.status === 'dispatched' && (
                <button onClick={() => handleUpdateStatus(id, 'received', 'Shipment successfully delivered to receiver')} className="w-full flex items-center gap-4 px-6 py-4 hover:bg-green-50 text-slate-700 transition-all group">
                    <div className="p-2 bg-green-50 rounded-xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all"><CheckCircle className="w-4 h-4" /></div>
                    <span className="text-[13px] font-black">Mark Received</span>
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
            if (orderSubTab === 'Tracking') return !!s.tracking_id;

            const normalizedStatus = s.status?.toLowerCase().replace('_', ' ');
            const normalizedTab = orderSubTab.toLowerCase().replace('s', ''); // Handle Drafts -> Draft

            if (orderSubTab === 'Manifested') return s.status === 'manifested';
            if (orderSubTab === 'Picked Up') return s.status === 'picked_up';

            return normalizedStatus === orderSubTab.toLowerCase() ||
                normalizedStatus === normalizedTab;
        });

        const tabs = [
            { id: 'All Orders', label: 'All Orders' },
            { id: 'Drafts', label: 'Drafts' },
            { id: 'Ready', label: 'Ready' },
            { id: 'Packed', label: 'Packed' },
            { id: 'Manifested', label: 'Manifested' },
            { id: 'Picked Up', label: 'Picked Up' },
            { id: 'Dispatched', label: 'Dispatched' },
            { id: 'Received', label: 'Received' },
            { id: 'RTO', label: 'RTO' },
            { id: 'Cancelled', label: 'Cancelled' },
            { id: 'Disputed', label: 'Disputed' },
            { id: 'Tracking', label: 'Tracking' }
        ];

        return (
            <div className="animate-in fade-in duration-700 bg-[#FFF5F5] min-h-screen -m-4 lg:-m-10 p-6 lg:p-10">
                <div className="max-w-[1500px] mx-auto space-y-6">
                    {/* Horizontal Tabs */}
                    <div className="flex items-center gap-8 border-b border-red-50 mb-8 overflow-x-auto no-scrollbar">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setOrderSubTab(tab.id)}
                                className={`pb-4 text-[11px] font-black uppercase tracking-tight transition-all whitespace-nowrap relative ${orderSubTab === tab.id ? 'text-red-600' : 'text-slate-500 hover:text-red-400'
                                    }`}
                            >
                                {tab.label}
                                {orderSubTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-600 rounded-full" />}
                            </button>
                        ))}
                    </div>

                    {/* Filter Bar */}
                    <div className="bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white flex flex-col md:flex-row items-center gap-4 shadow-sm">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-500 hover:bg-slate-50 transition-all">
                            <Filter className="w-3.5 h-3.5" /> All Filters
                        </button>
                        <div className="flex-1 relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Search by Tracking Id or Customer ..."
                                value={shipmentSearch}
                                onChange={e => setShipmentSearch(e.target.value)}
                                className="w-full bg-white border border-slate-100 rounded-xl pl-12 pr-5 py-3 text-[11px] font-bold outline-none focus:ring-4 focus:ring-red-600/5 transition-all text-slate-700"
                            />
                        </div>
                        <button className="flex items-center gap-2 bg-white border border-slate-100 text-slate-600 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            <ExternalLink className="w-3.5 h-3.5" /> Export
                        </button>
                    </div>

                    {/* Orders Table Container */}
                    <div className="bg-white rounded-[24px] border border-red-50/50 shadow-xl shadow-red-900/5 overflow-hidden">
                        <div className="overflow-x-auto scrollbar-hide">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/30 border-b border-slate-100">
                                        <th className="p-6 w-12 text-center">
                                            <input
                                                type="checkbox"
                                                className="rounded border-slate-200 cursor-pointer"
                                                checked={selectedOrders.length === filteredShipments.length && filteredShipments.length > 0}
                                                onChange={() => handleSelectAll(filteredShipments)}
                                            />
                                        </th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ORDER ID</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">CUSTOMER</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">DATE</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">PACKAGE</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">PAYMENT</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">STATUS</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">BGL TRACKING</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">ORIGINAL AWB</th>
                                        <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredShipments.map(s => {
                                        const orderDate = s.created_at ? new Date(s.created_at) : new Date();
                                        const dFormatted = orderDate.getFullYear() + String(orderDate.getMonth() + 1).padStart(2, '0') + String(orderDate.getDate()).padStart(2, '0');
                                        const randomHex = (s.id * 1234567).toString(16).toUpperCase().substring(0, 4);
                                        const displayOrderId = `ORD-${dFormatted}-${s.id}${randomHex}`;
                                        const isDomestic = s.destination_country?.toLowerCase() === 'india' || !s.destination_country;
                                        const isSelected = selectedOrders.includes(s.id);

                                        return (
                                            <tr key={s.id} className={`hover:bg-red-50/20 transition-colors group ${isSelected ? 'bg-red-50/30' : ''}`}>
                                                <td className="p-6 text-center">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-slate-200 cursor-pointer"
                                                        checked={isSelected}
                                                        onChange={() => toggleOrderSelection(s.id)}
                                                    />
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-[11px] font-black text-slate-700 tracking-tight">{displayOrderId}</p>
                                                </td>
                                                <td className="p-6 min-w-[200px]">
                                                    <div className="space-y-1">
                                                        <p className="text-[12px] font-black text-slate-800 uppercase leading-none">{s.firstname || 'Guest'} {s.lastname || ''}</p>
                                                        <p className="text-[10px] text-slate-400 font-medium lowercase tracking-tight">{s.creator_email || (s.firstname?.toLowerCase() + '@gmail.com')}</p>
                                                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black uppercase ${isDomestic ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-600'}`}>
                                                            {isDomestic ? <Home className="w-2.5 h-2.5" /> : <Monitor className="w-2.5 h-2.5" />}
                                                            {isDomestic ? 'DOMESTIC' : 'INTERNATIONAL'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6 whitespace-nowrap">
                                                    <p className="text-[11px] font-black text-slate-700">{new Date(s.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                                                    <p className="text-[10px] text-slate-300 font-bold mt-1 uppercase">{new Date(s.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex -space-x-3 group-hover:space-x-1 transition-all duration-300">
                                                            {(() => {
                                                                let items = [];
                                                                try { items = Array.isArray(s.items) ? s.items : JSON.parse(s.items || '[]'); } catch (e) { }
                                                                const allImgs = items.reduce((acc, itm) => [...acc, ...(itm.images || [])], []);
                                                                return allImgs.length > 0 ? (
                                                                    allImgs.slice(0, 2).map((img, idx) => (
                                                                        <div key={idx} className="w-8 h-8 rounded-lg bg-white border border-slate-200 overflow-hidden shadow-sm relative z-10 group-hover:z-20 transform hover:scale-125 transition-all">
                                                                            <img src={getItemImage(img)} className="w-full h-full object-cover" onError={e => e.target.src = 'https://via.placeholder.com/50'} />
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-300 border border-dotted border-slate-200"><Package className="w-3.5 h-3.5" /></div>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <p className="text-[11px] font-bold text-slate-900">{s.weight || 0.2} kg</p>
                                                            <p className="text-[10px] text-slate-400 font-medium tracking-tighter uppercase">{s.courierPartner || 'Express'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <p className="text-[12px] font-black text-slate-900">₹{parseFloat(s.shippingCost || 0).toFixed(2)}</p>
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase rounded tracking-widest">Wallet</span>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex justify-center">
                                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${s.status === 'dispatched' || s.status === 'in_transit' ? 'bg-green-50 text-green-600 border-green-100' :
                                                            s.status === 'received' || s.status === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                                                                'bg-slate-50 text-slate-400 border-slate-100'
                                                            }`}>
                                                            {s.status === 'dispatched' ? 'IN TRANSIT' : s.status === 'received' ? 'DELIVERED' : s.status?.toUpperCase() || 'DRAFT'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-6 min-w-[180px]">
                                                    <div className="space-y-1.5">
                                                        {(!s.status || s.status === 'draft' || s.status === 'paid') ? (
                                                            <button
                                                                onClick={() => handleVerifyOrder(s.id)}
                                                                className="w-full flex items-center justify-between px-3 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-red-200 group"
                                                            >
                                                                Verify Intel <Zap className="w-3 h-3 animate-pulse" />
                                                            </button>
                                                        ) : s.status === 'ready' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus(s.id, 'packed', 'Shipment has been securely packed at hub')}
                                                                className="w-full flex items-center justify-between px-3 py-2 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-blue-200"
                                                            >
                                                                Pack Shipment <Package className="w-3 h-3" />
                                                            </button>
                                                        ) : s.status === 'packed' ? (
                                                            <button
                                                                onClick={() => handleEmitManifest(s.id)}
                                                                className="w-full flex items-center justify-between px-3 py-2 bg-pink-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-pink-200"
                                                            >
                                                                Emit Manifest <FileDigit className="w-3 h-3" />
                                                            </button>
                                                        ) : s.status === 'manifested' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus(s.id, 'dispatched', 'Shipment dispatched from hub to destination')}
                                                                className="w-full flex items-center justify-between px-3 py-2 bg-purple-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-purple-200"
                                                            >
                                                                Dispatch Shipment <Truck className="w-3 h-3" />
                                                            </button>
                                                        ) : s.status === 'dispatched' || s.status === 'in_transit' ? (
                                                            <button
                                                                onClick={() => handleUpdateStatus(s.id, 'received', 'Shipment successfully delivered to receiver')}
                                                                className="w-full flex items-center justify-between px-3 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-slate-200"
                                                            >
                                                                Mark Delivery <CheckCircle className="w-3 h-3" />
                                                            </button>
                                                        ) : (
                                                            <div className="space-y-1.5">
                                                                <div className="bg-blue-50/50 px-2 py-1 rounded border border-blue-100 w-fit">
                                                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">{s.tracking_id || 'BGL-LOCAL-SYNC'}</p>
                                                                </div>
                                                                <p className="text-[7px] text-blue-400 font-black uppercase tracking-widest leading-none">BGL GLOBAL NETWORK</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-[10px] text-slate-300 font-bold uppercase italic">{s.original_awb || 'N/A'}</p>
                                                        {s.original_awb && <button className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"><RefreshCw className="w-3 h-3" /></button>}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center relative">
                                                    <button
                                                        onClick={(e) => {
                                                            const rect = e.currentTarget.getBoundingClientRect();
                                                            const spaceBelow = window.innerHeight - rect.bottom;
                                                            const top = spaceBelow < 300 ? rect.top - 300 : rect.bottom + 4;
                                                            setMenuPosition({ top, right: 60 });
                                                            setActiveActionMenu({ id: s.id, type: 'order' });
                                                        }}
                                                        className={`p-2 rounded-full transition-all ${activeActionMenu?.id === s.id && activeActionMenu?.type === 'order' ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'hover:bg-slate-100 text-slate-300'}`}
                                                    >
                                                        <MoreVertical className="w-4 h-4" />
                                                    </button>
                                                    {activeActionMenu?.id === s.id && activeActionMenu?.type === 'order' && <ActionMenu id={s.id} type="order" data={s} />}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-10 py-8 bg-slate-50/30 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                Showing <span className="text-slate-900">1 to {filteredShipments.length}</span> of {filteredShipments.length} results
                            </p>
                            <div className="flex items-center gap-2">
                                <button className="p-2 border border-slate-100 rounded-xl hover:bg-white text-slate-300 group transition-all"><ChevronRight className="w-4 h-4 rotate-180 group-hover:text-red-600" /></button>
                                <button className="w-10 h-10 bg-red-600 text-white rounded-xl text-[11px] font-black shadow-lg shadow-red-200">1</button>
                                <button className="w-10 h-10 bg-white border border-slate-100 text-slate-400 rounded-xl text-[11px] font-black hover:border-red-600 hover:text-red-600 transition-all">2</button>
                                <div className="text-slate-300 font-black">...</div>
                                <button className="w-10 h-10 bg-white border border-slate-100 text-slate-400 rounded-xl text-[11px] font-black hover:border-red-600 hover:text-red-600 transition-all">12</button>
                                <button className="p-2 border border-slate-100 rounded-xl hover:bg-white text-slate-300 group transition-all"><ChevronRight className="w-4 h-4 group-hover:text-red-600" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderUsers = () => {
        const filteredUsers = users.filter(u => u.firstname?.toLowerCase().includes(customerSearch.toLowerCase()) || u.email?.toLowerCase().includes(customerSearch.toLowerCase()));
        return (
            <div className="animate-in fade-in duration-700 m-6">
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 bg-white border border-gray-100 rounded-xl max-w-2xl px-4 py-3 flex items-center shadow-sm">
                        <Search className="w-4 h-4 text-gray-400 mr-3 shrink-0" />
                        <input
                            type="text"
                            placeholder="Search Customer..."
                            value={customerSearch}
                            onChange={e => setCustomerSearch(e.target.value)}
                            className="bg-transparent text-sm font-medium outline-none w-full text-gray-900 placeholder-gray-400"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50 transition shadow-sm">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white font-bold text-sm rounded-xl hover:bg-blue-800 transition shadow-sm">
                        + Add New
                    </button>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto scrollbar-hide min-h-[600px]">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 bg-white">
                                <th className="px-8 py-5">CUSTOMER</th>
                                <th className="px-8 py-5">DETAILS</th>
                                <th className="px-8 py-5">ONBOARDING</th>
                                <th className="px-8 py-5">KYC STATUS</th>
                                <th className="px-8 py-5 text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors group relative bg-white">
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-black text-gray-900">{u.firstname} {u.lastname || ''}</p>
                                        <p className="text-[11px] text-gray-500 font-medium mt-1">{u.email}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-black text-gray-900">{u.phone || 'N/A'}</p>
                                        <p className="text-[11px] text-gray-400 font-semibold mt-1 uppercase">BGL ID: {u.id.toString().padStart(8, '0')}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-sm font-black text-gray-900">{u.created_at ? new Date(u.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</p>
                                        <p className="text-[11px] text-gray-400 font-semibold mt-1 uppercase">{u.created_at ? new Date(u.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : ''}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${u.kyc_status === 'verified' ? 'border-green-200 text-green-600 bg-white' : 'border-gray-200 text-gray-500 bg-white'}`}>
                                            {u.kyc_status || 'NOT_SUBMITTED'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center relative">
                                        <button
                                            onClick={(e) => {
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                const spaceBelow = window.innerHeight - rect.bottom;
                                                const top = spaceBelow < 290 ? rect.top - 290 : rect.bottom + 4;
                                                setMenuPosition({ top, right: 16 });
                                                setActiveActionMenu({ id: u.id, type: 'user' });
                                            }}
                                            className={`p-2 rounded-lg border transition-all ${activeActionMenu?.id === u.id && activeActionMenu?.type === 'user'
                                                ? 'bg-gray-100 border-gray-200 text-gray-900' : 'border-transparent text-gray-300 hover:border-gray-200 hover:bg-gray-50 hover:text-gray-500'
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
                {(activeTab === 'orders' || activeTab === 'manifests' || activeTab === 'pickups') && renderOrders()}
                {activeTab === 'users' && renderUsers()}
                {activeTab === 'kyc' && <AdminKycPage />}
            </main>

            {showUserModal && selectedUser && (
                <CustomerDetailsModal selectedUser={selectedUser} setSelectedUser={(u) => { setSelectedUser(u); if (!u) setShowUserModal(false); }} />
            )}

            {showEditModal && editingOrder && (
                <AddOrderModal
                    user={user}
                    onClose={() => setShowEditModal(false)}
                    editOrder={editingOrder}
                    refreshOrders={fetchInitialData}
                    onSuccess={fetchInitialData}
                />
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
