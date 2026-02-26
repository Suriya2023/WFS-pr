import React, { useState, useEffect } from 'react';
import { X, User, Package, Wallet, MapPin, FileText, Download, Loader2, Send } from 'lucide-react';

const ProfileTab = ({ customerData, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstname: customerData.firstname || '',
        lastname: customerData.lastname || '',
        email: customerData.email || '',
        phone: customerData.phone || ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setFormData({
            firstname: customerData.firstname || '',
            lastname: customerData.lastname || '',
            email: customerData.email || '',
            phone: customerData.phone || ''
        });
    }, [customerData]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/admin/users.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    action: 'update_user',
                    user_id: customerData.id,
                    ...formData,
                    wallet_balance: customerData.wallet_balance
                })
            });
            const data = await res.json();
            if (data.success) {
                alert('Details updated successfully!');
                setIsEditing(false);
                if (onUpdate) onUpdate(formData);
            } else {
                alert(data.message || 'Update failed.');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update user details.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
    <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-gray-900 text-sm">Basic Information</h3>
                </div>
                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <button onClick={() => setIsEditing(false)} className="px-3 py-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                        <button onClick={handleSave} disabled={isSaving} className="px-3 py-1.5 text-[10px] font-bold text-white uppercase tracking-widest bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1">
                            {isSaving && <Loader2 className="w-3 h-3 animate-spin" />}
                            Save Actions
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditing(true)} className="px-3 py-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:bg-blue-50 rounded-lg transition-colors">Edit</button>
                )}
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <span className="text-xs text-gray-500 font-semibold w-1/3">Full Name</span>
                        {isEditing ? (
                            <div className="flex gap-2 flex-1 justify-end">
                                <input type="text" value={formData.firstname} onChange={e => setFormData({ ...formData, firstname: e.target.value })} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm font-bold text-gray-900 outline-none w-1/2" placeholder="First Name"/>
                                <input type="text" value={formData.lastname} onChange={e => setFormData({ ...formData, lastname: e.target.value })} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm font-bold text-gray-900 outline-none w-1/2" placeholder="Last Name"/>
                            </div>
                        ) : (
                            <span className="text-sm font-bold text-gray-900 text-right">{customerData.firstname} {customerData.lastname}</span>
                        )}
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <span className="text-xs text-gray-500 font-semibold w-1/3">Email Address</span>
                        {isEditing ? (
                            <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm font-medium text-gray-900 outline-none w-2/3 text-right" />
                        ) : (
                            <span className="text-sm font-medium text-gray-900 text-right">{customerData.email}</span>
                        )}
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <span className="text-xs text-gray-500 font-semibold w-1/3">Mobile Number</span>
                        {isEditing ? (
                            <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm font-medium text-gray-900 outline-none w-2/3 text-right" />
                        ) : (
                            <span className="text-sm font-medium text-gray-900 text-right">{customerData.phone || 'N/A'}</span>
                        )}
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <span className="text-xs text-gray-500 font-semibold w-1/3">Customer ID</span>
                        <span className="text-sm font-medium text-gray-900 font-mono text-xs text-right">{customerData.id}</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <span className="text-xs text-gray-500 font-semibold w-1/3">Joined Date</span>
                        <span className="text-sm font-medium text-gray-900 text-right">
                            {customerData.created_at ? new Date(customerData.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}
                        </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-50 pb-4">
                        <span className="text-xs text-gray-500 font-semibold w-1/3">Account Status</span>
                        <span className={`px-3 py-1 text-[10px] uppercase font-bold rounded-full text-right ${customerData.is_blocked ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            {customerData.is_blocked ? 'Suspended' : 'Active'}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-gray-900 text-sm">Wallet Summary</h3>
                </div>
                <button className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:underline">View Full History</button>
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-semibold">Current Balance</span>
                    <span className="text-xl font-black text-green-600 tracking-tight">₹{parseFloat(customerData.wallet_balance || 0).toLocaleString()}</span>
                </div>
            </div>
        </div>
    </div>
    );
};

const OrdersTab = ({ orders }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">Recent Shipments</h3>
            <span className="text-[10px] font-bold text-gray-500 uppercase px-3 py-1 bg-gray-100 rounded-lg">{orders.length} Total</span>
        </div>
        <div className="overflow-x-auto">
            {orders.length === 0 ? (
                <div className="p-10 text-center text-gray-500 text-sm">No shipments found for this user.</div>
            ) : (
                <table className="w-full text-left">
                    <thead className="bg-gray-50/50">
                        <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b border-gray-100">
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Destination</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 text-xs font-bold text-gray-900">ORD-{order.id}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 text-xs font-medium text-gray-900 capitalize">{order.city || order.destination_country || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600 rounded-md">
                                        {order.status || 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs font-black text-gray-900 text-right">₹{parseFloat(order.totalAmount || order.shippingCost || 0).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    </div>
);

const WalletTab = ({ customerData }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center p-10 max-w-lg mx-auto">
        <div className="p-4 bg-green-50 rounded-2xl w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <Wallet className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-5xl font-black text-gray-900 tracking-tighter mb-2">₹{parseFloat(customerData.wallet_balance || 0).toLocaleString()}</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em]">Available Balance</p>
    </div>
);
const AddressesTab = ({ addresses }) => (
    <div className="space-y-4">
        {addresses.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center text-gray-500 text-sm">No addresses saved.</div>
        ) : (
            addresses.map(addr => (
                <div key={addr.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 relative group overflow-hidden">
                    {addr.isDefault === 1 && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-bold text-gray-900 text-sm uppercase">{addr.name}</h4>
                            {addr.isDefault === 1 && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[9px] font-black uppercase tracking-widest rounded">Primary</span>}
                        </div>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed max-w-lg">{addr.address1}</p>
                        <div className="mt-3 flex items-center gap-4 text-[11px] font-semibold text-gray-400">
                            <span>{addr.city}, {addr.state} {addr.pincode}</span>
                            <span>•</span>
                            <span>{addr.phone}</span>
                        </div>
                    </div>
                </div>
            ))
        )}
    </div>
);

const KycTab = ({ customerData }) => <div className="p-10 text-center text-gray-500 font-medium text-sm">KYC Status: <span className="font-bold text-gray-900 uppercase">{customerData.kyc_status || 'Pending'}</span></div>;
const PaymentsTab = () => <div className="p-10 text-center text-gray-500 font-medium text-sm">Payment links will appear here.</div>;

const CustomerDetailsModal = ({ selectedUser, setSelectedUser }) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [customerData, setCustomerData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);

    useEffect(() => {
        if (selectedUser) {
            setCustomerData(selectedUser);
            fetchUserData();
        }
    }, [selectedUser]);

    const fetchUserData = async () => {
        setLoadingDetails(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Wait for both requests
            const [ordersRes, addrRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/list.php?all=false&user_id=${selectedUser.id}`, config).then(r => r.json()).catch(() => ([])),
                fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/addresses.php?user_id=${selectedUser.id}`, config).then(r => r.json()).catch(() => ({ data: [] }))
            ]);

            setOrders(Array.isArray(ordersRes) ? ordersRes : []);
            setAddresses(addrRes.data || []);

        } catch (e) {
            console.error('Error fetching details', e);
        } finally {
            setLoadingDetails(false);
        }
    };

    if (!selectedUser) return null;

    const handleExportPDF = () => {
        alert("Report generation triggered");
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white shadow-sm z-10 relative">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 tracking-tight">Customer Executive Dashboard</h2>
                            <p className="text-xs text-gray-500 font-medium">Managing <span className="text-gray-900 font-bold">{selectedUser.firstname} {selectedUser.lastname}</span></p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-[11px] font-bold uppercase tracking-widest shadow-lg shadow-blue-200"
                        >
                            <Download className="w-4 h-4" />
                            General Report
                        </button>
                        <button
                            onClick={() => setSelectedUser(null)}
                            className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="border-b border-gray-100 bg-gray-50/50">
                    <div className="flex gap-2 px-6 pt-2 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'profile', label: 'Overview', icon: User },
                            { id: 'orders', label: 'Shipments', icon: Package },
                            { id: 'wallet', label: 'Accounts', icon: Wallet },
                            { id: 'addresses', label: 'Addresses', icon: MapPin },
                            { id: 'kyc', label: 'KYC Verification', icon: FileText },
                            { id: 'payments', label: 'Payment Links', icon: Send }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-5 py-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all relative whitespace-nowrap ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50 rounded-t-xl'
                                    }`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
                    {loadingDetails ? (
                        <div className="flex flex-col items-center justify-center h-64 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] animate-pulse">Syncing Customer Data...</p>
                        </div>
                    ) : customerData ? (
                        <div className="animate-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                            {activeTab === 'profile' && <ProfileTab customerData={customerData} onUpdate={(updatedFields) => {
                                if (updatedFields) {
                                    setCustomerData(prev => ({ ...prev, ...updatedFields }));
                                    setSelectedUser(prev => ({ ...prev, ...updatedFields }));
                                }
                                fetchUserData();
                            }} />}
                            {activeTab === 'orders' && <OrdersTab customerData={customerData} orders={orders} />}
                            {activeTab === 'wallet' && <WalletTab customerData={customerData} />}
                            {activeTab === 'addresses' && <AddressesTab customerData={customerData} addresses={addresses} refreshAddresses={fetchUserData} />}
                            {activeTab === 'kyc' && <KycTab customerData={customerData} />}
                            {activeTab === 'payments' && <PaymentsTab customerData={customerData} />}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <p className="text-gray-500">Failed to load customer data.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDetailsModal;
