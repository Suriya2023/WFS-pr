// Header.jsx

import React, { useState } from 'react';
import { Menu, ChevronLeft, Wallet, FileText, HelpCircle, User, Settings, Monitor, LogOut, X, Sun, Moon, Sparkles, Bell, MessageSquare, Clock, XCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';

function Header({ toggleSidebar, user, openRechargeModal, activeRoute, setActiveRoute, toggleHistoryDrawer }) {
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotiMenu, setShowNotiMenu] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/notifications`, config);
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/notifications/${id}/read`, {}, config);
            fetchNotifications();
        } catch (error) { console.error(error); }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // 1 min sync
        return () => clearInterval(interval);
    }, []);

    const getNotiIcon = (type) => {
        switch (type) {
            case 'refund_credited': return <Wallet className="w-4 h-4 text-green-500" />;
            case 'order_cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'payment_success': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'new_query': return <MessageSquare className="w-4 h-4 text-blue-500" />;
            default: return <Bell className="w-4 h-4 text-red-400" />;
        }
    };

    // Dynamic Title based on route
    const getPageTitle = (route) => {
        const titles = {
            'dashboard': 'Dashboard',
            'orders': 'Orders',
            'multibox': 'Multibox',
            'manifests': 'Manifests',
            'pickups': 'Pickups',
            'customers': 'Customers',
            'wallet': 'Wallet',
            'coupons': 'Coupons',
            'bulk-report': 'Bulk Report',
            'quotations': 'Quotations',
            'website-leads': 'Website Leads',
            'notifications': 'Notifications',
            'audit-logs': 'Audit Logs',
            'documents': 'Documents',
            'rate-calculator': 'Rate Calculator',
            'settings': 'Settings',
            'profile': 'Profile',
            'password': 'Change Password',
            'api-settings': 'API Settings',
            'carrier-list': 'Carrier List',
            'service-list': 'Service List',
            'view-order': 'Order Details',
            'bulk-orders': 'Bulk Orders',
            'track-shipment': 'Track Shipment',
            'invoices': 'Invoices'
        };
        return titles[route] || 'BGL Express';
    };

    // Back button click handler
    const handleBack = () => {
        setActiveRoute('dashboard');
    };

    const shouldShowBack = activeRoute !== 'dashboard' && activeRoute !== 'orders';

    return (
        <header className="bg-[#FFD700] border-b border-yellow-200 dark:bg-gray-900 dark:border-gray-800 sticky top-0 z-30 transition-colors duration-200 shadow-sm">
            <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between px-3 sm:px-6 py-[10px] sm:py-[12px]">
                <div className="flex items-center gap-4 lg:gap-8">
                    <div className="flex items-center gap-3">
                        {shouldShowBack && (
                            <button
                                onClick={handleBack}
                                className="p-1 hover:bg-yellow-100/50 rounded-full transition-all text-[#E31E24]"
                                title="Back to Dashboard"
                            >
                                <ChevronLeft className="w-5 h-5 stroke-[4px]" />
                            </button>
                        )}
                        <h1 className="text-xl sm:text-3xl font-[1000] text-[#E31E24] dark:text-white tracking-[-0.03em] truncate max-w-[150px] sm:max-w-none uppercase">
                            {activeRoute === 'dashboard' ? 'DASHBOARD' : getPageTitle(activeRoute)}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-5">
                    {/* Quick Actions */}
                    <button
                        onClick={() => navigate('/quick-actions')}
                        className="hidden lg:flex items-center gap-2 text-[#E31E24] hover:text-red-800 font-black text-xs transition-colors uppercase tracking-widest"
                    >
                        <Sparkles className="w-4 h-4 text-[#E31E24]" />
                        Quick Actions
                    </button>

                    {/* Order History */}
                    <button
                        onClick={toggleHistoryDrawer}
                        className="p-1.5 sm:p-2 text-[#E31E24] hover:bg-white/20 rounded-xl transition-all"
                        title="Order History"
                    >
                        <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Notifications Bell */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotiMenu(!showNotiMenu)}
                            className={`relative p-1.5 sm:p-2 rounded-xl transition-all ${showNotiMenu ? 'bg-white/30 text-red-900' : 'text-[#E31E24] hover:bg-white/20'}`}
                        >
                            <Bell className="w-5 h-5 sm:w-7 sm:h-7 stroke-[2.5px]" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#E31E24] text-white text-[8px] sm:text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-[#FFD700] shadow-sm">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotiMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowNotiMenu(false)} />
                                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 py-3 z-20 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
                                    <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700 font-bold text-gray-900 dark:text-white">
                                        Notifications
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="px-5 py-8 text-center text-gray-500">
                                                No new updates
                                            </div>
                                        ) : (
                                            notifications.map((noti) => (
                                                <div
                                                    key={noti._id}
                                                    onClick={() => {
                                                        markAsRead(noti._id);
                                                        if (noti.type === 'refund_credited') setActiveRoute('wallet');
                                                        if (noti.type === 'order_cancelled') setActiveRoute('orders');
                                                        setShowNotiMenu(false);
                                                    }}
                                                    className={`px-5 py-3 hover:bg-yellow-50 dark:hover:bg-gray-700/50 cursor-pointer border-b border-gray-50 dark:border-gray-700/30 transition-colors ${!noti.isRead ? 'bg-yellow-50/50 dark:bg-yellow-900/10' : ''}`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="mt-1">{getNotiIcon(noti.type)}</div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{noti.title}</p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{noti.message}</p>
                                                            <p className="text-[10px] text-gray-400 mt-1 font-medium italic">
                                                                {new Date(noti.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        {!noti.isRead && <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Wallet Section */}
                    <div
                        onClick={openRechargeModal}
                        className="flex items-center gap-1.5 sm:gap-3 px-2 sm:px-3 py-1 bg-white border-2 border-[#E31E24] rounded-xl shadow-sm hover:shadow-md transition-all group overflow-hidden cursor-pointer h-10"
                    >
                        <div className="bg-red-50 rounded-lg shrink-0 group-hover:scale-110 transition-transform">
                            <Wallet className="w-4 h-4 text-[#E31E24]" />
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xs sm:text-sm font-black text-gray-900 whitespace-nowrap">
                                ₹{user?.walletBalance ? Math.round(Number(user.walletBalance)).toLocaleString('en-IN') : '0'}
                            </span>
                            <button
                                className="bg-[#FFD700] text-[#E31E24] px-3 py-0.5 rounded-lg text-[10px] font-black hover:bg-yellow-400 transition-colors shadow-sm"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-9 h-9 sm:w-11 sm:h-11 bg-white rounded-full flex items-center justify-center text-[#E31E24] border-[2.5px] border-[#E31E24] shadow-md hover:shadow-lg transition-all overflow-hidden shrink-0 outline-none"
                        >
                            {user.profileImage ? (
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}/${user.profileImage}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-xs sm:text-sm font-black uppercase">
                                    {user.firstname?.slice(0, 1)}{user.lastname?.slice(0, 1)}
                                </span>
                            )}
                        </button>

                        {showUserMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                                <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-20 overflow-hidden ring-1 ring-black/5 animate-in fade-in zoom-in duration-200">
                                    <div className="px-5 py-5 border-b border-yellow-100 bg-yellow-300">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-inner">
                                                {user.profileImage ? (
                                                    <img
                                                        src={`${import.meta.env.VITE_API_BASE_URL}/${user.profileImage}`}
                                                        alt={user.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    user.firstname?.charAt(0).toUpperCase()
                                                )}
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="font-extrabold text-red-700 truncate text-base">{user.name}</span>
                                                <span className="text-xs text-red-600/70 truncate font-medium">{user.email}</span>
                                                {user?._id && (
                                                    <span className="text-[10px] text-red-600/50 mt-1 font-bold">CUST ID: {String(user._id).slice(-8).toUpperCase()}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4.5 bg-white dark:bg-gray-800">
                                        <button
                                            onClick={() => {
                                                setActiveRoute('profile');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-xl text-red-700 transition-all group"
                                        >
                                            <div className="p-2 bg-yellow-100 group-hover:bg-yellow-200 rounded-lg text-red-600 transition-colors">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold">My Profile</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveRoute('settings');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-xl text-red-700 transition-all group"
                                        >
                                            <div className="p-2 bg-yellow-100 group-hover:bg-yellow-200 rounded-lg text-red-600 transition-colors">
                                                <Settings className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold">Settings</span>
                                        </button>

                                        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-xl text-red-700 transition-all group text-left">
                                            <div className="p-2 bg-yellow-100 group-hover:bg-yellow-200 rounded-lg text-red-600 transition-colors">
                                                <HelpCircle className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold">Support & FAQs</span>
                                        </button>

                                        <div className="my-2 border-t border-gray-50 dark:border-gray-700" />

                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('token');
                                                navigate('/');
                                            }}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-red-600 transition-colors"
                                        >
                                            <div className="p-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
                                                <LogOut className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold">Sign Out</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
