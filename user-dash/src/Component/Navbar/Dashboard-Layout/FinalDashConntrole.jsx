import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Sidebar from './Layout/Sidebar'
import Header from './Layout/Header'
import DashboardPage from './pages/Dashboard/mainDash'
import OrdersPage from './pages/Orders/orders'
import BulkOrders from './pages/BulkOrders/bulkOrders';
import MultiBoxPage from './pages/MultiBox/multiboxes'
import ManifestPage from './pages/Manifest/manifest'
import RateCalculatorPage from './pages/RateCalculator/rateCalculator'
import BulkReportPage from './pages/BulkReport/bulkReport'
import WalletPage from './pages/Wallet/wallet'
import DocumentsPage from './pages/Documents/documents'
import IntegrationsPage from './pages/Integrations/integrations'
import RequestQuotePage from './pages/RequestQuote/requestQuote'
import ProfilePage from './pages/Profile/ProfilePage';
import SettingsPage from './pages/Settings/settings'
import MainTable from './pages/OrderTable/MainTableOrders'
import TrackShipment from './pages/TrackShipment/TrackShipment'
import ViewOrder from './pages/Orders/ViewOrder';
import InvoicesPage from './pages/Invoices/invoices';
import PickupsPage from './pages/Pickups/PickupsPage';
import ViewManifest from './pages/Manifest/ViewManifest';
import AddressBook from './pages/AddressBook/AddressBook';
import BottomNav from './Layout/BottomNav';
import OrderHistoryDrawer from './Layout/OrderHistoryDrawer';
import AdminDashboard from './pages/Admin/AdminDashboard';
import KYCForm from './pages/KYC/KYCForm';
import { m } from 'framer-motion'


function FinalDashConntrole() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeRoute, setActiveRoute] = useState('dashboard');
    const [ordersTab, setOrdersTab] = useState('all'); // State for selected orders tab
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showRechargeModal, setShowRechargeModal] = useState(false);
    const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
    const [user, setUser] = useState({
        name: '',
        email: '',
        firstname: '',
        lastname: '',
        profileImage: '',
        mobile: ''

    });
    const [loadingUser, setLoadingUser] = useState(true);
    const [dashboardStats, setDashboardStats] = useState(null);

    // Fetch logged-in user data
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                setLoadingUser(false);
                return;
            }

            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/profile`, config);

            // Handle case where response.data might be a string
            let profileData = data;
            if (typeof profileData === 'string') {
                try {
                    profileData = JSON.parse(profileData);
                } catch (parseError) {
                    console.error('Failed to parse response as JSON:', parseError);
                }
            }

            setUser({
                name: profileData.firstname && profileData.lastname ? `${profileData.firstname} ${profileData.lastname}` : (profileData.firstname || profileData.lastname || 'User'),
                email: profileData.email || '',
                firstname: profileData.firstname || '',
                lastname: profileData.lastname || '',
                profileImage: profileData.profileImage || '',
                mobile: profileData.mobile || '',
                walletBalance: profileData.wallet_balance || 0,
                _id: profileData.id
            });
        } catch (error) {
            console.error('Error fetching user data:', error);
        } finally {
            setLoadingUser(false);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/stats`, config);
            setDashboardStats(data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    useEffect(() => {
        fetchUserData();
        fetchDashboardStats();
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const openRechargeModal = () => {
        setActiveRoute('wallet');
        setShowRechargeModal(true);
    };

    // Function to refresh user data after profile update
    const refreshUserData = async () => {
        await fetchUserData();
        if (activeRoute === 'dashboard') {
            await fetchDashboardStats();
        }
    };


    const renderPage = () => {
        const userRole = localStorage.getItem('role');

        // If admin, show admin dashboard or restricted pages
        if (userRole === 'admin' && (activeRoute === 'dashboard' || activeRoute === 'orders' || activeRoute === 'customers' || activeRoute === 'kyc' || activeRoute === 'manifests' || activeRoute === 'pickups')) {
            const adminTab = activeRoute === 'customers' ? 'users' : activeRoute;
            return <AdminDashboard setActiveRoute={setActiveRoute} setSelectedOrderId={setSelectedOrderId} activeTab={adminTab} user={user} />;
        }

        switch (activeRoute) {
            case 'dashboard':
                return <DashboardPage setActiveRoute={setActiveRoute} stats={dashboardStats} />;
            case 'orders':
                return <OrdersPage user={user} setActiveRoute={setActiveRoute} setSelectedOrderId={setSelectedOrderId} activeTab={ordersTab} setActiveTab={setOrdersTab} />;
            case 'view-order':
                return <ViewOrder orderId={selectedOrderId} onBack={() => setActiveRoute('orders')} />;
            case 'bulk-orders':
                return <BulkOrders setActiveRoute={setActiveRoute} />;
            case 'manifests':
                return <ManifestPage setActiveRoute={setActiveRoute} setSelectedManifestId={setSelectedOrderId} />;
            case 'view-manifest':
                return <ViewManifest manifestId={selectedOrderId} onBack={() => setActiveRoute('manifests')} onViewPickup={() => setActiveRoute('pickups')} />;
            case 'pickups':
                return <PickupsPage setActiveRoute={setActiveRoute} />;
            case 'customers':
            case 'address-book':
                return userRole === 'admin' ? <AdminDashboard setActiveRoute={setActiveRoute} user={user} /> : <AddressBook />;
            case 'wallet':
                return <WalletPage showRechargeModal={showRechargeModal} setShowRechargeModal={setShowRechargeModal} refreshGlobalUserData={refreshUserData} />;
            case 'bulk-report':
                return <BulkReportPage />;
            case 'quotations':
            case 'request-quote':
                return <RequestQuotePage />;
            case 'invoices':
                return <InvoicesPage />;
            case 'settings':
            case 'profile':
            case 'password':
            case 'api-settings':
                return <ProfilePage userData={user} refreshUserData={refreshUserData} />;
            case 'carrier-list':
                return <div className="p-8 text-center text-gray-500 font-black uppercase tracking-widest">Carrier Management Coming Soon</div>;
            case 'service-list':
                return <div className="p-8 text-center text-gray-500 font-black uppercase tracking-widest">Service Management Coming Soon</div>;
            case 'rate-calculator':
                return <RateCalculatorPage />;
            case 'track-shipment':
                return <TrackShipment />;
            case 'notifications':
                return <div className="p-8 text-center text-gray-500 font-black uppercase tracking-widest">Notifications Center Coming Soon</div>;
            case 'website-leads':
                return <div className="p-8 text-center text-gray-500 font-black uppercase tracking-widest">Website Leads Dashboard Coming Soon</div>;
            case 'coupons':
                return <div className="p-8 text-center text-gray-500 font-black uppercase tracking-widest">Coupon Management Coming Soon</div>;
            case 'documents':
                return <DocumentsPage />;
            case 'kyc':
                return <KYCForm onClose={() => setActiveRoute('dashboard')} onSuccess={() => fetchDashboardStats()} />;
            case 'buy-packaging':
                return <div className="p-8 text-center bg-white m-6 rounded-2xl border border-dashed border-gray-300">
                    <div className="text-5xl mb-4">📦</div>
                    <h2 className="text-2xl font-bold mb-2">Packaging Store Coming Soon</h2>
                    <p className="text-gray-500">We are currently stocking up! Check back soon for boxes, tape, and more.</p>
                </div>;
            default:
                if (userRole === 'admin') {
                    const adminTab = activeRoute === 'customers' ? 'users' : activeRoute;
                    return <AdminDashboard setActiveRoute={setActiveRoute} activeTab={adminTab} user={user} />;
                }
                return <DashboardPage setActiveRoute={setActiveRoute} stats={dashboardStats} />;
        }
    };
    return (
        <div className="flex h-screen bg-white dark:bg-gray-950 transition-colors duration-200 overflow-hidden">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                activeRoute={activeRoute}
                setActiveRoute={setActiveRoute}
            />
            <div className="flex-1 flex flex-col overflow-hidden relative">
                <Header
                    activeRoute={activeRoute}          // ⭐ YE ADD KARO
                    setActiveRoute={setActiveRoute}
                    toggleSidebar={toggleSidebar}
                    user={user}
                    openRechargeModal={openRechargeModal}
                    toggleHistoryDrawer={() => setHistoryDrawerOpen(!historyDrawerOpen)}
                />
                <main className="flex-1 overflow-y-auto pb-28 lg:pb-0 scrollbar-hide">
                    <div className="max-w-[1600px] mx-auto w-full">
                        {renderPage()}
                    </div>
                </main>

                <OrderHistoryDrawer
                    isOpen={historyDrawerOpen}
                    onClose={() => setHistoryDrawerOpen(false)}
                    stats={dashboardStats}
                />

                {/* Mobile Bottom Navigation */}
                <BottomNav activeRoute={activeRoute} setActiveRoute={setActiveRoute} toggleSidebar={toggleSidebar} />
            </div>
        </div>
    )
}

export default FinalDashConntrole
