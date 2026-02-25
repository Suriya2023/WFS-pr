import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainTable from '../OrderTable/MainTableOrders';

function Orders({ user, setActiveRoute, setSelectedOrderId, activeTab, setActiveTab }) {
    const [showAddOrderModal, setShowAddOrderModal] = useState(false);
    const [ordersData, setOrdersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const tabs = [
        { id: 'all', label: 'All Orders' },
        { id: 'pending_payment', label: 'Pending Payment' },
        { id: 'draft', label: 'Drafts' },
        { id: 'ready', label: 'Ready' },
        { id: 'packed', label: 'Packed' },
        { id: 'manifested', label: 'Manifested' },
        { id: 'dispatched', label: 'Dispatched' },
        { id: 'received', label: 'Received' },
        { id: 'cancelled', label: 'Cancelled' },
        { id: 'disputed', label: 'Disputed' },
    ];

    const [editOrder, setEditOrder] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, [activeTab]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // Fetch orders with status filter
            const statusParam = activeTab === 'all' ? '' : `?status=${activeTab}`;
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/shipment.php${statusParam}`, config);
            const rawData = response.data.data || [];

            // Transform data to match table format
            const transformedData = rawData.map(order => {
                const randomHex = (order.id * 1234567).toString(16).toUpperCase().substring(0, 6);
                const displayOrderId = order.tracking_id || `ORD-${randomHex}`;

                return {
                    orderId: displayOrderId,
                    customer: order.consignee_name || 'N/A',
                    date: new Date(order.created_at).toLocaleDateString('en-IN'),
                    package: `${order.deadWeight || 0}kg - ${order.items?.[0]?.name || 'Package'}`,
                    status: order.status || 'Pending',
                    lastMile: order.tracking_id || 'Not Assigned',
                    _id: order.id,
                    orderType: order.orderType,
                    consignee: { firstName: order.consignee_name, email: order.consignee_email }
                };
            });

            setOrdersData(transformedData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError(error.response?.data?.message || 'Failed to fetch orders');
            setOrdersData([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOrderSuccess = () => {
        // Refresh orders after successful creation
        fetchOrders();
    };

    const handleViewOrder = (orderId) => {
        setSelectedOrderId(orderId);
        setActiveRoute('view-order');
    };

    const handleEditOrder = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders.php?id=${orderId}`, config);
            setEditOrder(data);
            setShowAddOrderModal(true);
        } catch (error) {
            console.error('Error fetching order details for edit:', error);
            alert('Failed to load order details');
        }
    };

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handlePayNow = async (orderId) => {
        try {
            console.log('Initiating Pay Now for Shipment ID:', orderId);
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // 0. Ensure Razorpay SDK is loaded
            const isLoaded = await loadRazorpay();
            if (!isLoaded) {
                alert('Razorpay SDK failed to load. Please check your internet connection.');
                return;
            }

            // 1. Fetch Shipment Details to get amount
            const { data: shipment } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/update.php?id=${orderId}`, config);
            console.log('Shipment Details Fetched:', shipment);

            const totalAmount = parseFloat(shipment.total_amount || (shipment.shippingCost * 1.18) || 0);
            if (totalAmount <= 0) {
                alert('Order amount is invalid. Please contact support.');
                return;
            }

            // 2. Create Razorpay Order
            const { data: order } = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/payment/order.php`, {
                amount: totalAmount,
                currency: 'INR'
            }, config);

            // 3. Open Razorpay
            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: "BGL Express",
                description: `Payment for Shipment #${orderId}`,
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 4. Update Shipment Status on Success
                        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/update.php?id=${orderId}`, {
                            status: 'paid',
                            paymentId: response.razorpay_payment_id,
                            paymentOrderId: response.razorpay_order_id,
                            paymentSignature: response.razorpay_signature
                        }, config);

                        alert('Payment successful! Order updated.');
                        fetchOrders();
                    } catch (err) {
                        console.error('Update failed:', err);
                        alert('Payment was successful but we couldn\'t update the order status. Please contact support.');
                    }
                },
                prefill: {
                    name: shipment.consignee_name || '',
                    email: shipment.consignee_email || '',
                    contact: shipment.consignee_phone || ''
                },
                theme: { color: "#2563eb" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            console.error('Pay Now Error:', error);
            alert(error.response?.data?.message || 'Failed to initiate payment.');
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            // Use freight invoice endpoint for billing invoice
            window.open(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/invoice/freight?token=${token}`, '_blank');
        } catch (error) {
            console.error('Invoice download error:', error);
            alert('Failed to download invoice');
        }
    };

    const handleCancelShipment = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this shipment?')) return;
        const reason = window.prompt('Enter cancellation reason:');
        if (!reason) return;

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            // First get the order to find the AWB
            const { data: order } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders.php?id=${orderId}`, config);
            const awb = order.trackingId || order.orderId;

            if (!awb) {
                alert('No tracking ID found for this order');
                return;
            }

            await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/shipment/${awb}/cancel`, { reason }, config);
            alert('Shipment cancelled successfully');
            fetchOrders();
        } catch (error) {
            console.error('Cancel shipment error:', error);
            alert(error.response?.data?.message || 'Failed to cancel shipment');
        }
    };

    const handleDownloadPOD = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/pod`, config);

            if (data.success && data.podUrl) {
                window.open(data.podUrl, '_blank');
            } else {
                alert(data.message || 'POD not available yet');
            }
        } catch (error) {
            console.error('POD download error:', error);
            alert(error.response?.data?.message || 'Failed to download POD');
        }
    };

    const handleDownloadLabel = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            window.open(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/label?token=${token}`, '_blank');
        } catch (error) {
            console.error('Label download error:', error);
            alert('Failed to download shipping label');
        }
    };

    const handleDownloadCommercialInvoice = async (orderId) => {
        try {
            const token = localStorage.getItem('token');
            window.open(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/invoice/commercial?token=${token}`, '_blank');
        } catch (error) {
            console.error('Commercial invoice download error:', error);
            alert('Failed to download commercial invoice');
        }
    };

    const filteredOrders = ordersData.filter(order => {
        const orderIdMatch = (order.orderId || '').toLowerCase().includes(searchTerm.toLowerCase());
        const customerMatch = (order.customer || '').toLowerCase().includes(searchTerm.toLowerCase());
        return orderIdMatch || customerMatch;
    });

    return (
        <div>
            <MainTable
                user={user}
                activeTab={activeTab}
                setActiveRoute={setActiveRoute}
                setActiveTab={setActiveTab}
                showAddOrderModal={showAddOrderModal}
                setShowAddOrderModal={(show) => {
                    setShowAddOrderModal(show);
                    if (!show) setEditOrder(null); // Clear edit order on close
                }}
                editOrder={editOrder} // Pass editOrder to MainTable -> AddOrderModal
                tabs={tabs}
                ordersData={filteredOrders}
                onSearch={(e) => setSearchTerm(e.target.value)}
                searchTerm={searchTerm}
                loading={loading}
                error={error}
                onRefresh={fetchOrders}
                onOrderSuccess={handleOrderSuccess}
                title="Orders"
                breadcrumb="Orders"
                onAddOrder={() => {
                    setEditOrder(null); // Ensure clean state for new order
                    setShowAddOrderModal(true);
                }}
                onBulkOrder={() => setActiveRoute('bulk-orders')}
                addButtonText="Create Order"
                bulkButtonText="Bulk Order"
                OrderID="Order ID"
                Customer="Customer Details"
                OrderDate="Order Date"
                PackageDetails="Package Details"
                Status="Status"
                LastMileDetails="Last Mile Details"
                ViewOrder="View Order"
                Actions="Actions"
                onViewOrder={handleViewOrder}
                onEditOrder={handleEditOrder} // Pass handler
                onPayNow={handlePayNow}
                onDownloadInvoice={handleDownloadInvoice}
                onCancelShipment={handleCancelShipment}
                onDownloadPOD={handleDownloadPOD}
                onDownloadLabel={handleDownloadLabel}
                onDownloadCommercialInvoice={handleDownloadCommercialInvoice}
            />
        </div>
    );
}

export default Orders;
