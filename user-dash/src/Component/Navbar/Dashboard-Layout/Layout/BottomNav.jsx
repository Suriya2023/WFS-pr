import React from 'react';
import { Home, Package, Wallet, User, Menu } from 'lucide-react';

const BottomNav = ({ activeRoute, setActiveRoute, toggleSidebar }) => {
    const navItems = [
        { id: 'orders', icon: Package, label: 'Orders' },
        { id: 'wallet', icon: Wallet, label: 'Wallet' },
        { id: 'dashboard', icon: Home, label: 'Home', isFloating: true },
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'menu', icon: Menu, label: 'Menu', isToggle: true },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-4 pointer-events-none">
            <div className="max-w-lg mx-auto relative pointer-events-auto">
                <div className="bg-yellow-300/80 dark:bg-gray-900/80 backdrop-blur-xl border border-yellow-200 dark:border-gray-800/50 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center justify-between px-2 py-2">
                    {navItems.map((item, index) => {
                        const isActive = activeRoute === item.id;

                        if (item.isFloating) {
                            return (
                                <div key={item.id} className="relative flex-1 flex justify-center -mt-8">
                                    <button
                                        onClick={() => setActiveRoute(item.id)}
                                        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transform transition-all duration-300 ring-4 ring-white dark:ring-gray-900 ${isActive
                                            ? 'bg-red-600 text-white scale-110 rotate-0 shadow-red-500/40'
                                            : 'bg-red-600 text-white hover:scale-105 active:scale-95'
                                            }`}
                                    >
                                        <item.icon className="w-7 h-7" />
                                    </button>
                                </div>
                            );
                        }

                        return (
                            <button
                                key={item.id}
                                onClick={() => item.isToggle ? toggleSidebar() : setActiveRoute(item.id)}
                                className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-all duration-300 group ${isActive ? 'text-red-700 dark:text-red-400' : 'text-red-600/60 dark:text-gray-500 hover:text-red-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                <div className={`relative p-1.5 rounded-xl transition-all ${isActive ? 'bg-yellow-200 dark:bg-red-900/20' : ''}`}>
                                    <item.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                                </div>
                                <span className={`text-[10px] font-bold transition-all ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomNav;
