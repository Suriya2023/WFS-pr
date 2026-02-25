import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    User, Mail, Phone, MapPin, Save, Loader, Camera, Shield,
    AlertTriangle, X, CreditCard, Building, Globe, Percent,
    Clock, Edit as EditIcon, CheckCircle, Briefcase, Hash,
    FileText, UserCheck, ShieldCheck, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ProfilePage({ userData, refreshUserData }) {
    const [user, setUser] = useState({
        firstname: '', lastname: '', email: '', mobile: '',
        company_name: '', gst_number: '', pan_number: '', aadhaar_number: '',
        shipping_margin: 0, billing_address: '', billing_city: '',
        billing_state: '', billing_pincode: '', billing_country: 'India',
        profileImage: '', kycStatus: 'pending'
    });
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState(null);
    const [activeTab, setActiveTab] = useState('personal'); // 'personal', 'business', 'billing'

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, config);

            let profileData = data;
            if (typeof profileData === 'string') profileData = JSON.parse(profileData);

            setUser(prev => ({ ...prev, ...profileData }));
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, user, config);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            if (refreshUserData) refreshUserData();

            // Auto-hide message after 3 seconds
            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Update failed. Please try again.' });
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader className="w-10 h-10 animate-spin text-red-600" />
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest animate-pulse">Synchronizing Identity...</p>
        </div>
    );

    const tabs = [
        { id: 'personal', label: 'Personal Info', icon: <User className="w-4 h-4" /> },
        { id: 'business', label: 'Business & KYC', icon: <Briefcase className="w-4 h-4" /> },
        { id: 'billing', label: 'Billing Address', icon: <MapPin className="w-4 h-4" /> }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 md:py-12">
            {/* Header Section */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">Account Settings</h1>
                    <p className="text-gray-500 font-bold text-sm">Manage your personal identification and business credentials.</p>
                </div>

                <div className="flex bg-gray-100 p-1.5 rounded-2xl">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${activeTab === tab.id
                                    ? 'bg-white shadow-xl text-red-600'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {tab.icon}
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`mb-8 p-4 rounded-2xl flex items-center justify-between border-2 ${message.type === 'success' ? 'bg-green-50/50 border-green-200 text-green-700' : 'bg-red-50/50 border-red-200 text-red-700'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${message.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                                {message.type === 'success' ? <ShieldCheck className="w-5 h-5 text-white" /> : <AlertTriangle className="w-5 h-5 text-white" />}
                            </div>
                            <span className="font-black uppercase text-xs tracking-widest">{message.text}</span>
                        </div>
                        <button onClick={() => setMessage(null)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Profile Card */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-[40px] p-8 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500" />

                        <div className="relative flex flex-col items-center">
                            <div className="relative mb-6">
                                <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-white shadow-2xl bg-slate-100 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                    {user.profileImage ? (
                                        <img src={`${import.meta.env.VITE_API_BASE_URL}/${user.profileImage}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                            <span className="text-4xl font-black text-white">{(user.firstname || 'U')[0]}</span>
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-gray-900 text-white p-3 rounded-2xl cursor-pointer shadow-xl hover:bg-black transition-all hover:scale-110">
                                    <Camera className="w-4 h-4" />
                                    <input type="file" className="hidden" />
                                </label>
                            </div>

                            <div className="text-center">
                                <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-1">{user.firstname} {user.lastname}</h2>
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4">{user.role || 'Partner'}</p>

                                <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-2xl font-black text-[10px] uppercase border-2 shadow-sm ${user.kycStatus === 'verified'
                                        ? 'bg-green-50/50 text-green-600 border-green-200'
                                        : 'bg-yellow-50/50 text-yellow-600 border-yellow-200'
                                    }`}>
                                    {user.kycStatus === 'verified' ? <ShieldCheck className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                    KYC {user.kycStatus === 'verified' ? 'Verified' : 'Pending'}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 space-y-3 pt-8 border-t border-gray-50">
                            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white shadow-sm rounded-xl text-gray-400 group-hover:text-red-500 transition-colors"><Mail className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Email ID</p>
                                        <p className="text-xs font-bold text-gray-700">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-white shadow-sm rounded-xl text-gray-400 group-hover:text-red-500 transition-colors"><Phone className="w-4 h-4" /></div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Phone</p>
                                        <p className="text-xs font-bold text-gray-700">{user.mobile || 'Not Set'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Widget */}
                    <div className="bg-gray-900 rounded-[32px] p-6 text-white overflow-hidden relative group">
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-4">Wallet Balance</h4>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-black tracking-tighter">₹{user.wallet_balance || '0.00'}</span>
                            <div className="p-3 bg-white/10 rounded-2xl"><CreditCard className="w-6 h-6" /></div>
                        </div>
                    </div>
                </div>

                {/* Form Sections */}
                <div className="lg:col-span-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'personal' && (
                                <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                                        <div className="p-3 bg-red-50 text-red-600 rounded-2xl"><User className="w-6 h-6" /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Identity Details</h3>
                                            <p className="text-xs font-bold text-gray-400">Basic information used for legal correspondence.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <ModernInput label="First Name" name="firstname" value={user.firstname} onChange={handleChange} icon={<User className="w-4 h-4" />} />
                                        <ModernInput label="Last Name" name="lastname" value={user.lastname} onChange={handleChange} icon={<User className="w-4 h-4" />} />
                                        <ModernInput label="Email ID" name="email" value={user.email} disabled icon={<Mail className="w-4 h-4" />} />
                                        <ModernInput label="Mobile Number" name="mobile" value={user.mobile} onChange={handleChange} icon={<Phone className="w-4 h-4" />} />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'business' && (
                                <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Briefcase className="w-6 h-6" /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Tax & Business Info</h3>
                                            <p className="text-xs font-bold text-gray-400">Credentials required for legitimate commercial shipping.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <ModernInput label="Company Name" name="company_name" value={user.company_name} onChange={handleChange} placeholder="Enter Business Legal Name" icon={<Building className="w-4 h-4" />} />
                                        <ModernInput label="GST Number" name="gst_number" value={user.gst_number} onChange={handleChange} placeholder="e.g. 24AUVPI1421D17X" icon={<Hash className="w-4 h-4" />} />
                                        <ModernInput label="PAN Card" name="pan_number" value={user.pan_number} onChange={handleChange} icon={<FileText className="w-4 h-4" />} />
                                        <ModernInput label="Aadhaar ID" name="aadhaar_number" value={user.aadhaar_number} onChange={handleChange} icon={<Shield className="w-4 h-4" />} />
                                        <div className="md:col-span-2">
                                            <ModernInput
                                                label="Service Margin % (0.70 = 70%)"
                                                name="shipping_margin"
                                                value={user.shipping_margin}
                                                onChange={handleChange}
                                                type="number"
                                                step="0.01"
                                                icon={<Percent className="w-4 h-4" />}
                                                helpText="Your profit margin added above live courier rates."
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'billing' && (
                                <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-50">
                                        <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><MapPin className="w-6 h-6" /></div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Billing Location</h3>
                                            <p className="text-xs font-bold text-gray-400">Address used for tax invoices and official records.</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2">
                                            <ModernInput label="Complete Address" name="billing_address" value={user.billing_address} onChange={handleChange} multiline icon={<MapPin className="w-4 h-4" />} />
                                        </div>
                                        <ModernInput label="City" name="billing_city" value={user.billing_city} onChange={handleChange} icon={<Globe className="w-4 h-4" />} />
                                        <ModernInput label="State" name="billing_state" value={user.billing_state} onChange={handleChange} icon={<Layers className="w-4 h-4" />} />
                                        <ModernInput label="Postal Code" name="billing_pincode" value={user.billing_pincode} onChange={handleChange} icon={<Hash className="w-4 h-4" />} />
                                        <ModernInput label="Country" name="billing_country" value={user.billing_country} onChange={handleChange} icon={<Globe className="w-4 h-4" />} />
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={updating}
                                className="flex-1 bg-gray-900 text-white py-5 rounded-[24px] font-black uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {updating ? <Loader className="w-6 h-6 animate-spin text-red-500" /> : <ShieldCheck className="w-6 h-6 text-red-500" />}
                                {updating ? 'Saving Changes...' : 'Synchronize Profile'}
                            </button>

                            {activeTab !== 'billing' && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab(activeTab === 'personal' ? 'business' : 'billing')}
                                    className="p-5 bg-white border border-gray-100 rounded-[24px] text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

const ModernInput = ({ label, icon, helpText, multiline, ...props }) => (
    <div className="space-y-2 group">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 group-focus-within:text-red-500 transition-colors">{label}</label>
        <div className="relative">
            <div className="absolute left-5 top-[18px] text-gray-300 group-focus-within:text-red-500 transition-colors">
                {icon}
            </div>
            {multiline ? (
                <textarea
                    rows="3"
                    className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-transparent rounded-[20px] focus:border-red-500 focus:bg-white outline-none font-bold text-sm text-gray-800 transition-all placeholder:text-gray-300 disabled:opacity-50 resize-none"
                    {...props}
                />
            ) : (
                <input
                    className="w-full pl-12 pr-5 py-4 bg-gray-50/50 border-2 border-transparent rounded-[20px] focus:border-red-500 focus:bg-white outline-none font-bold text-sm text-gray-800 transition-all placeholder:text-gray-300 disabled:opacity-50"
                    {...props}
                />
            )}
        </div>
        {helpText && <p className="text-[9px] font-bold text-gray-400 ml-1 uppercase">{helpText}</p>}
    </div>
);

const Layers = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
    </svg>
);

export default ProfilePage;
