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
        <header className="sticky top-0 z-30 backdrop-blur-md bg-gradient-to-r from-[#FFD700] via-[#FFC107] to-[#FFB300] border-b border-yellow-300 shadow-md">

            <div className="max-w-[1600px] mx-auto w-full flex items-center justify-between px-4 sm:px-8 h-[75px]">

                {/* LEFT SECTION */}
                <div className="flex items-center gap-6">

                    {shouldShowBack && (
                        <button
                            onClick={handleBack}
                            className="p-2 rounded-full bg-white/40 hover:bg-white transition-all text-[#E31E24] shadow-sm"
                        >
                            <ChevronLeft className="w-5 h-5 stroke-[3px]" />
                        </button>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#C21807] tracking-tight uppercase">
                        {activeRoute === 'dashboard'
                            ? 'Dashboard'
                            : getPageTitle(activeRoute)}
                    </h1>

                </div>

                {/* RIGHT SECTION */}
                <div className="flex items-center gap-4">

                    {/* Quick Actions */}
                    <button
                        onClick={() => navigate('/quick-actions')}
                        className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white/40 hover:bg-white rounded-xl text-[#C21807] font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                        <Sparkles className="w-4 h-4" />
                        Quick Actions
                    </button>

                    {/* Order History */}
                    <button
                        onClick={toggleHistoryDrawer}
                        className="p-2 bg-white/40 hover:bg-white rounded-xl text-[#C21807] transition-all shadow-sm"
                    >
                        <Clock className="w-5 h-5" />
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotiMenu(!showNotiMenu)}
                            className="relative p-2 bg-white/40 hover:bg-white rounded-xl text-[#C21807] transition-all shadow-sm"
                        >
                            <Bell className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#E31E24] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotiMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowNotiMenu(false)} />
                                <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20 animate-in fade-in zoom-in duration-200">

                                    <div className="px-5 py-3 bg-yellow-50 font-bold text-gray-900 border-b">
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
                                                    className={`px-5 py-3 hover:bg-yellow-50 cursor-pointer border-b transition-all ${!noti.isRead ? 'bg-yellow-50/50' : ''
                                                        }`}
                                                >
                                                    <div className="flex gap-3">
                                                        <div className="mt-1">{getNotiIcon(noti.type)}</div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                                {noti.title}
                                                            </p>
                                                            <p className="text-xs text-gray-600 line-clamp-2">
                                                                {noti.message}
                                                            </p>
                                                            <p className="text-[10px] text-gray-400 mt-1 italic">
                                                                {new Date(noti.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                </div>
                            </>
                        )}
                    </div>

                    {/* Wallet */}
                    <div
                        onClick={openRechargeModal}
                        className="flex items-center gap-3 px-4 py-2 bg-white rounded-xl shadow-md border border-yellow-200 hover:shadow-lg transition-all cursor-pointer"
                    >
                        <Wallet className="w-4 h-4 text-[#E31E24]" />
                        <span className="text-sm font-bold text-gray-900">
                            ₹{user?.walletBalance
                                ? Math.round(Number(user.walletBalance)).toLocaleString('en-IN')
                                : '0'}
                        </span>
                        <span className="bg-[#FFD700] text-[#C21807] text-[10px] font-bold px-2 py-0.5 rounded-md">
                            + Add
                        </span>
                    </div>

                    {/* User Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="w-11 h-11 bg-white rounded-full flex items-center justify-center border-2 border-[#E31E24] shadow-md hover:shadow-lg transition-all overflow-hidden"
                        >
                            {user.profileImage ? (
                                <img
                                    src={`${import.meta.env.VITE_API_BASE_URL}/${user.profileImage}`}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="font-bold text-[#E31E24] uppercase">
                                    {user.firstname?.slice(0, 1)}
                                    {user.lastname?.slice(0, 1)}
                                </span>
                            )}
                        </button>

                        {showUserMenu && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                                <div className="absolute right-0 mt-4 w-72 bg-white rounded-2xl shadow-2xl border overflow-hidden z-20 animate-in fade-in zoom-in duration-200">

                                    <div className="px-5 py-5 bg-gradient-to-r from-yellow-300 to-yellow-400">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-red-700">{user.name}</span>
                                            <span className="text-xs text-red-700/70">{user.email}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-2">

                                        <button
                                            onClick={() => {
                                                setActiveRoute('profile');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-yellow-50 text-red-700 font-semibold"
                                        >
                                            My Profile
                                        </button>

                                        <button
                                            onClick={() => {
                                                setActiveRoute('settings');
                                                setShowUserMenu(false);
                                            }}
                                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-yellow-50 text-red-700 font-semibold"
                                        >
                                            Settings
                                        </button>

                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('token');
                                                navigate('/');
                                            }}
                                            className="w-full text-left px-4 py-2 rounded-lg hover:bg-red-50 text-red-600 font-bold"
                                        >
                                            Sign Out
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
