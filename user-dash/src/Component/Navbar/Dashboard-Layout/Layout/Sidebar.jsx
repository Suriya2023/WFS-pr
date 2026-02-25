import React, { useState, useEffect } from 'react';
import {
    Menu, X, Wallet, Package, FileText, Calculator, DollarSign, File, Link, Settings,
    LogOut, User, HelpCircle, Monitor, ChevronLeft, Home, Layers, ClipboardList,
    TrendingUp, FileBarChart, Truck, Database, Plug, MessageSquare, ShoppingBag,
    Send, Users, Bell, ShieldCheck, Info, Box, RefreshCw, Printer, FileEdit, Mail, Smartphone
} from 'lucide-react';
import axios from 'axios';
import bglLogo from '../../../../assets/bglLogo.png';

const Sidebar = ({ isOpen, toggleSidebar, activeRoute, setActiveRoute }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [openSubMenus, setOpenSubMenus] = useState({});
    const userRole = localStorage.getItem('role');

    const toggleSubMenu = (menu) => {
        setOpenSubMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const fetchUnread = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quotes/my-quotes`, config);
            setUnreadCount(data.filter(q => q.userHasRead === false).length);
        } catch (err) { }
    };

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 120000);
        return () => clearInterval(interval);
    }, []);

    const userMenuItems = [
        { icon: <Home className="w-5 h-5" />, label: 'Dashboard', route: 'dashboard' },
        { icon: <Package className="w-5 h-5" />, label: 'Orders', route: 'orders' },
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Track Orders', route: 'track-shipment' },
        { icon: <User className="w-5 h-5" />, label: 'Address Book', route: 'customers' },
        { icon: <Calculator className="w-5 h-5" />, label: 'Rate Calculator', route: 'rate-calculator' },
        { icon: <Wallet className="w-5 h-5" />, label: 'Wallet', route: 'wallet' },
        { icon: <FileBarChart className="w-5 h-5" />, label: 'Download Report', route: 'bulk-report' },
        { icon: <MessageSquare className="w-5 h-5" />, label: 'Request Quote', route: 'request-quote' },
        { icon: <FileText className="w-5 h-5" />, label: 'Invoices', route: 'invoices' },
        { icon: <Settings className="w-5 h-5" />, label: 'Settings', route: 'settings' },
    ];

    const adminMenuItems = [
        { icon: <Home className="w-5 h-5" />, label: 'Dashboard', route: 'dashboard' },
        { icon: <Package className="w-5 h-5" />, label: 'Orders', route: 'orders' },
        { icon: <TrendingUp className="w-5 h-5" />, label: 'Track Shipment', route: 'track-shipment' },
        { icon: <Users className="w-5 h-5" />, label: 'Customers', route: 'customers' },
        { icon: <FileText className="w-5 h-5" />, label: 'Manifests', route: 'manifests' },
        { icon: <Truck className="w-5 h-5" />, label: 'Pickups', route: 'pickups' },
        { icon: <Wallet className="w-5 h-5" />, label: 'Wallet', route: 'wallet' },
        { icon: <DollarSign className="w-5 h-5" />, label: 'Coupons', route: 'coupons' },
        { icon: <Mail className="w-5 h-5" />, label: 'Mail Customer', route: 'mail-customer' },

        {
            icon: <Settings className="w-5 h-5" />,
            label: 'Settings',
            route: 'settings',
            subItems: [
                { label: 'Profile', route: 'profile' },
                { label: 'Password', route: 'password' },
                { label: 'API Settings', route: 'api-settings' }
            ]
        },
    ];

    const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

    const navItemStyle = (item) => `w-full flex items-center gap-3.5 px-6 py-3.5 rounded-xl mb-1 transition-all duration-300 group ${activeRoute === item.route
        ? 'bg-[#FFF7E1] text-[#E31E24] font-bold'
        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 font-medium'
        }`;

    return (
        <div>
            {isOpen && (
                <div
                    className="fixed inset-0 backdrop-blur-md bg-black/20 z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 overflow-hidden flex flex-col font-sans`}
            >
                <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-[#FFD700]">
                    <img
                        src={bglLogo}
                        alt="BGL Express"
                        className="h-10 w-auto cursor-pointer"
                        onClick={() => setActiveRoute('dashboard')}
                    />
                    <button onClick={toggleSidebar} className="lg:hidden p-1 hover:bg-black/5 rounded-lg transition-all">
                        <X className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                {userRole !== 'admin' && (
                    <div className="px-5 py-6">
                        <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-center gap-4">
                            <div className="w-8 h-8 bg-white shadow-sm flex items-center justify-center rounded-xl text-blue-600">
                                <Info className="w-4 h-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Access Level</p>
                                <p className="text-[11px] font-black text-slate-900 uppercase">User Terminal</p>
                            </div>
                        </div>
                    </div>
                )}

                <nav className="flex-1 overflow-y-auto px-4 pb-6 pt-2 scrollbar-hide space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.label}>
                            {item.subItems ? (
                                <div>
                                    <button
                                        onClick={() => toggleSubMenu(item.label)}
                                        className={navItemStyle(item)}
                                    >
                                        <div className="flex items-center gap-3.5 flex-1">
                                            <div className={`${activeRoute === item.route ? 'text-[#E31E24]' : 'text-gray-400'} group-hover:text-gray-900 transition-colors`}>
                                                {item.icon}
                                            </div>
                                            <span className="text-[14px]">{item.label}</span>
                                        </div>
                                        <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${openSubMenus[item.label] ? '-rotate-90' : ''}`} />
                                    </button>
                                    {openSubMenus[item.label] && (
                                        <div className="ml-10 mt-1 space-y-1">
                                            {item.subItems.map(subItem => (
                                                <button
                                                    key={subItem.label}
                                                    onClick={() => {
                                                        setActiveRoute(subItem.route);
                                                        if (window.innerWidth < 1024) toggleSidebar();
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-[12px] font-medium rounded-lg transition-all ${activeRoute === subItem.route
                                                        ? 'text-[#E31E24] bg-[#FFF7E1]'
                                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    • {subItem.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setActiveRoute(item.route);
                                        if (window.innerWidth < 1024) toggleSidebar();
                                    }}
                                    className={navItemStyle(item)}
                                >
                                    <div className="flex items-center gap-3.5 flex-1">
                                        <div className={`${activeRoute === item.route ? 'text-[#E31E24]' : 'text-gray-400'} group-hover:text-gray-900 transition-colors`}>
                                            {item.icon}
                                        </div>
                                        <span className="text-[14px]">{item.label}</span>
                                    </div>
                                    {item.route === 'request-quote' && unreadCount > 0 && (
                                        <span className="w-5 h-5 bg-[#E31E24] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-50 bg-white">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/';
                        }}
                        className="w-full flex items-center gap-3 px-6 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-[#E31E24] transition-all font-bold text-[14px]"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default Sidebar;
