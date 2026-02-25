import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, MapPin, Phone, User, Trash2, Edit2, CheckCircle, X, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

function AddressBook() {
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address1: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        isDefault: false
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/addresses.php`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                setAddresses(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
            // Non-ideal: toast.error('Failed to load addresses'); 
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (address = null) => {
        if (address) {
            setEditingAddress(address);
            setFormData({
                id: address.id,
                name: address.name,
                phone: address.phone,
                address1: address.address1,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                country: address.country || 'India',
                isDefault: address.isDefault == 1
            });
        } else {
            setEditingAddress(null);
            setFormData({
                name: '',
                phone: '',
                address1: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India',
                isDefault: false
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/addresses.php`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (data.success) {
                toast.success(editingAddress ? 'Address updated' : 'Address added');
                setShowModal(false);
                fetchAddresses();
            } else {
                toast.error(data.message || 'Operation failed');
            }
        } catch (error) {
            console.error('Error saving address:', error);
            toast.error('Failed to save address');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/user/addresses.php`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { id }
            });
            if (data.success) {
                toast.success('Address deleted');
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('☢️ CRITICAL ACTION: Are you sure you want to PERMANENTLY CLEAR your entire address book? This cannot be undone.')) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            // Assuming the backend handles a 'clear_all' flag or similar
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/addresses.php`,
                { action: 'clear_all' },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success('Address book cleared successfully');
                fetchAddresses();
            } else {
                // If special endpoint doesn't exist, we fallback to manual loop or informative error
                toast.error(data.message || 'Bulk clear failed');
                fetchAddresses();
            }
        } catch (error) {
            toast.error('Could not execute bulk clear');
        } finally {
            setLoading(false);
        }
    };

    const handleSetDefault = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/user/addresses.php`,
                { id, action: 'set_default', isDefault: true },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (data.success) {
                toast.success('Primary dispatch location updated');
                fetchAddresses();
            }
        } catch (error) {
            toast.error('Failed to update default address');
        }
    };

    const filteredAddresses = addresses.filter(addr =>
        (addr.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (addr.city || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (addr.address1 || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 lg:p-12 min-h-screen bg-[#FCF8F8]">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight">Address Book</h1>
                        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.2em]">Manage your shipment dispatch matrix</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {addresses.length > 0 && (
                            <button
                                onClick={handleClearAll}
                                className="px-6 py-4 bg-white border-2 border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                            >
                                Clear All
                            </button>
                        )}
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-[#E31E24] hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-red-200"
                        >
                            <Plus className="w-5 h-5 stroke-[3px]" />
                            Add New Address
                        </button>
                    </div>
                </div>

                <div className="relative mb-10">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name, city or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-gray-100 rounded-[20px] shadow-sm outline-none focus:ring-2 focus:ring-red-500/20 transition-all font-medium text-gray-600"
                    />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="w-12 h-12 border-4 border-red-50 border-t-red-600 rounded-full animate-spin mb-4" />
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Accessing Records...</p>
                    </div>
                ) : filteredAddresses.length === 0 ? (
                    <div className="bg-white rounded-[32px] p-20 text-center border border-dashed border-gray-200 shadow-sm">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <MapPin className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No addresses found</h3>
                        <p className="text-gray-500 mb-8 max-w-sm mx-auto">It looks like your address book is empty. Add a new address to get started.</p>
                        <button onClick={() => handleOpenModal()} className="text-[#E31E24] font-black uppercase tracking-widest text-xs hover:underline">
                            Add your first address
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredAddresses.map((addr) => (
                            <div key={addr.id} className="bg-white rounded-[24px] p-8 shadow-sm border border-gray-50 hover:shadow-xl transition-all duration-500 group relative flex flex-col justify-between">
                                {addr.isDefault == 1 && (
                                    <div className="absolute top-6 right-6 bg-green-50 text-green-600 text-[9px] font-black px-3 py-1 rounded-lg border border-green-100 flex items-center gap-1.5 uppercase tracking-widest">
                                        <CheckCircle className="w-3 h-3" /> Default
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-red-50 flex items-center justify-center rounded-2xl shrink-0 group-hover:scale-110 transition-transform duration-500">
                                            <User className="w-6 h-6 text-[#E31E24]" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-gray-900 tracking-tight">{addr.name}</p>
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-400 mt-1">
                                                <Phone className="w-4 h-4" /> {addr.phone}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center rounded-2xl shrink-0">
                                            <MapPin className="w-6 h-6 text-gray-400" />
                                        </div>
                                        <div className="text-sm font-medium text-gray-500 leading-relaxed">
                                            <p className="line-clamp-2">{addr.address1}</p>
                                            <p className="font-bold text-gray-700 mt-1">{addr.city}, {addr.state} - {addr.pincode}</p>
                                            <p className="mt-1 opacity-60 uppercase text-[10px] tracking-widest font-black">{addr.country}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                                    <button
                                        onClick={() => handleSetDefault(addr.id)}
                                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${addr.isDefault == 1 ? 'bg-green-50 text-green-600 cursor-default' : 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white shadow-sm'}`}
                                    >
                                        {addr.isDefault == 1 ? 'START ADDR' : 'SET START'}
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleOpenModal(addr)}
                                            className="p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                        >
                                            <Edit2 className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(addr.id)}
                                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)} />
                        <div className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{editingAddress ? 'Update Location' : 'Register Address'}</h2>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Operational Logistics Details</p>
                                </div>
                                <button onClick={() => setShowModal(false)} className="w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Identity Name</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Suraj Singh Rajput"
                                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500 focus:bg-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Contact</label>
                                        <input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                            placeholder="08160607802"
                                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500 focus:bg-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Detailed Address Line</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.address1}
                                        onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                                        placeholder="Flat/House No, Street, Landmark"
                                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500 focus:bg-white outline-none transition-all font-medium resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Zip Code</label>
                                        <input
                                            required
                                            type="text"
                                            maxLength="6"
                                            value={formData.pincode}
                                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '') })}
                                            placeholder="395004"
                                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500 focus:bg-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Metropolitan City</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.city}
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            placeholder="Surat"
                                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500 focus:bg-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">State/Province</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.state}
                                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            placeholder="Gujarat"
                                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500 focus:bg-white outline-none transition-all font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Dispatch Nation</label>
                                        <select
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:border-red-500 focus:bg-white outline-none transition-all font-medium appearance-none"
                                        >
                                            <option value="India">India</option>
                                            <option value="USA">USA</option>
                                            <option value="UK">UK</option>
                                            <option value="UAE">UAE</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-2">
                                    <div
                                        onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
                                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${formData.isDefault ? 'bg-[#E31E24] border-[#E31E24]' : 'border-gray-200 bg-white'}`}
                                    >
                                        {formData.isDefault && <CheckCircle className="w-4 h-4 text-white" />}
                                    </div>
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest cursor-pointer" onClick={() => setFormData({ ...formData, isDefault: !formData.isDefault })}>
                                        Designate as default dispatch address
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-5 bg-[#E31E24] hover:bg-red-700 text-white rounded-[20px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all mt-4 disabled:bg-gray-300 shadow-xl shadow-red-200"
                                >
                                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingAddress ? 'Update Deployment' : 'Confirm Registration')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AddressBook;
