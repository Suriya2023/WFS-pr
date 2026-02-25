import React, { useState, useEffect } from 'react';
import {
    X,
    Wallet,
    Package,
    FileText,
    Calculator,
    DollarSign,
    Settings,
    LogOut,
    User,
    TrendingUp,
    FileBarChart,
    Truck,
    Users,
    MessageSquare,
    ChevronLeft,
    Home,
    Mail
} from 'lucide-react';
import axios from 'axios';
import bglLogo from '../../../../assets/bglLogos.png';

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
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/quotes/my-quotes`,
                config
            );
            setUnreadCount(data.filter(q => q.userHasRead === false).length);
        } catch (err) { }
    };

    useEffect(() => {
        fetchUnread();
        const interval = setInterval(fetchUnread, 120000);
        return () => clearInterval(interval);
    }, []);

    const userMenuItems = [
        { icon: <Home size={18} />, label: 'Dashboard', route: 'dashboard' },
        { icon: <Package size={18} />, label: 'Orders', route: 'orders' },
        { icon: <TrendingUp size={18} />, label: 'Track Orders', route: 'track-shipment' },
        { icon: <User size={18} />, label: 'Address Book', route: 'customers' },
        { icon: <Calculator size={18} />, label: 'Rate Calculator', route: 'rate-calculator' },
        { icon: <Wallet size={18} />, label: 'Wallet', route: 'wallet' },
        { icon: <FileBarChart size={18} />, label: 'Download Report', route: 'bulk-report' },
        { icon: <MessageSquare size={18} />, label: 'Request Quote', route: 'request-quote' },
        { icon: <FileText size={18} />, label: 'Invoices', route: 'invoices' },
        { icon: <Settings size={18} />, label: 'Settings', route: 'settings' },
    ];

    const adminMenuItems = [
        { icon: <Home size={18} />, label: 'Dashboard', route: 'dashboard' },
        { icon: <Package size={18} />, label: 'Orders', route: 'orders' },
        { icon: <TrendingUp size={18} />, label: 'Track Shipment', route: 'track-shipment' },
        { icon: <Users size={18} />, label: 'Customers', route: 'customers' },
        { icon: <FileText size={18} />, label: 'Manifests', route: 'manifests' },
        { icon: <Truck size={18} />, label: 'Pickups', route: 'pickups' },
        { icon: <Wallet size={18} />, label: 'Wallet', route: 'wallet' },
        { icon: <DollarSign size={18} />, label: 'Coupons', route: 'coupons' },
        { icon: <Mail size={18} />, label: 'Mail Customer', route: 'mail-customer' },
        {
            icon: <Settings size={18} />,
            label: 'Settings',
            route: 'settings',
            subItems: [
                { label: 'Profile', route: 'profile' },
                { label: 'Password', route: 'password' },
                { label: 'API Settings', route: 'api-settings' }
            ]
        }
    ];

    const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

    const navStyle = (route) =>
        `w-full flex items-center justify-between px-4 py-3 rounded-xl text-[15px] font-medium transition-all ${activeRoute === route
            ? 'bg-[#E8DCB5] border border-black text-[#E31E24]'
            : 'text-[#E31E24] hover:bg-white'
        }`;

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-[#fff] border-r border-gray-300
        transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 flex flex-col h-screen`}
            >
                {/* HEADER */}
                <div className="h-[75px] bg-[#FFD700] flex items-center px-6 border-b border-gray-300">
                    <img
                        src={bglLogo}
                        alt="BGL Express"
                        className="h-10 object-contain cursor-pointer"
                        onClick={() => setActiveRoute('dashboard')}
                    />
                    <button onClick={toggleSidebar} className="ml-auto lg:hidden">
                        <X />
                    </button>
                </div>

                {/* MENU */}
                <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
                    {menuItems.map((item) => (
                        <div key={item.label}>
                            {item.subItems ? (
                                <>
                                    <button
                                        onClick={() => toggleSubMenu(item.label)}
                                        className={navStyle(item.route)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            {item.label}
                                        </div>
                                        <ChevronLeft
                                            className={`transition-transform ${openSubMenus[item.label] ? '-rotate-90' : ''
                                                }`}
                                            size={16}
                                        />
                                    </button>

                                    {openSubMenus[item.label] && (
                                        <div className="ml-8 mt-1 space-y-1">
                                            {item.subItems.map((sub) => (
                                                <button
                                                    key={sub.label}
                                                    onClick={() => {
                                                        setActiveRoute(sub.route);
                                                        if (window.innerWidth < 1024) toggleSidebar();
                                                    }}
                                                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm ${activeRoute === sub.route
                                                        ? 'bg-[#E8DCB5] text-[#E31E24] font-semibold'
                                                        : 'text-gray-600 hover:bg-white'
                                                        }`}
                                                >
                                                    {sub.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={() => {
                                        setActiveRoute(item.route);
                                        if (window.innerWidth < 1024) toggleSidebar();
                                    }}
                                    className={navStyle(item.route)}
                                >
                                    <div className="flex items-center gap-3">
                                        {item.icon}
                                        {item.label}
                                    </div>

                                    {item.route === 'request-quote' && unreadCount > 0 && (
                                        <span className="bg-[#E31E24] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            )}
                        </div>
                    ))}
                </nav>

                {/* LOGOUT STICKY BOTTOM */}
                <div className="border-t border-gray-300 p-4 bg-[#F2F2F2]">
                    <button
                        onClick={() => {
                            localStorage.removeItem('token');
                            window.location.href = '/';
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 
            text-[#E31E24] font-semibold rounded-xl hover:bg-white transition-all"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;