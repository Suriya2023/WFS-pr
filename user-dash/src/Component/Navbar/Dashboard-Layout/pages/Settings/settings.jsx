import React, { useState, useEffect } from 'react';
import { Bell, Lock, Globe, Key, Shield, Smartphone, Mail, Eye, EyeOff, Save, Moon, Sun, Edit2, X } from 'lucide-react';
import axios from 'axios';

function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobile: ''
    });
    const [notifications, setNotifications] = useState({
        emailOrder: true,
        smsOrder: false,
        promotional: true,
        securityAlerts: true
    });

    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found');
                setLoading(false);
                return;
            }
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, config);
            setUser({
                firstname: data.firstname || '',
                lastname: data.lastname || '',
                email: data.email || '',
                mobile: data.mobile || ''
            });
            setError(null);
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError(error.response?.data?.message || 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, user, config);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <Globe className="w-5 h-5" /> },
        { id: 'security', label: 'Security', icon: <Shield className="w-5 h-5" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
        { id: 'api', label: 'API Keys', icon: <Key className="w-5 h-5" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-6 animate-fade-in text-gray-900 dark:text-gray-100">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <p className="text-red-700 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Profile Information Card */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Profile Information</h3>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        disabled={loading || error}
                                        className="flex items-center gap-2 px-4 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => {
                                                setIsEditing(false);
                                                fetchUserData(); // Reset to original data
                                            }}
                                            className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
                                        >
                                            <Save className="w-4 h-4" />
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">First Name</label>
                                    <input
                                        type="text"
                                        name="firstname"
                                        value={user.firstname}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastname"
                                        value={user.lastname}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Mobile Number</label>
                                    <input
                                        type="tel"
                                        name="mobile"
                                        value={user.mobile}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 dark:disabled:bg-gray-900 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>



                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Language</label>
                                    <select className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>English (US)</option>
                                        <option>Hindi</option>
                                        <option>Spanish</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Time Zone</label>
                                    <select className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                                        <option>(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi</option>
                                        <option>UTC</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                <Lock className="w-5 h-5" />
                                Change Password
                            </h3>
                            <div className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Current Password</label>
                                    <input type="password" className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">New Password</label>
                                    <input type="password" className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Update Password</button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                Two-Factor Authentication
                            </h3>
                            <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">SMS Authentication</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive codes via SMS for login</p>
                                </div>
                                <button className="text-blue-600 font-medium hover:underline">Enable</button>
                            </div>
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">Email Notifications</h3>
                            <div className="space-y-4">
                                {[
                                    { id: 'emailOrder', label: 'Order Updates', desc: 'Get emails about your order status' },
                                    { id: 'promotional', label: 'Promotional Emails', desc: 'Receive offers and updates' },
                                    { id: 'securityAlerts', label: 'Security Alerts', desc: 'Get notified about suspicious activity' }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors">
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={notifications[item.id]}
                                            onChange={() => setNotifications(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'api':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors duration-200">
                            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">API Keys</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your API keys for integrating with external services.</p>

                            <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-gray-200 dark:border-gray-800 flex items-center justify-between mb-4">
                                <div className="font-mono text-sm text-gray-600 dark:text-gray-300">
                                    sk_live_51Mz...Xy9z
                                </div>
                                <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200">
                                    <Eye className="w-5 h-5" />
                                </button>
                            </div>

                            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                                <Key className="w-4 h-4" />
                                Generate New Key
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto dark:text-gray-100">


            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <div className="lg:col-span-1">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;
