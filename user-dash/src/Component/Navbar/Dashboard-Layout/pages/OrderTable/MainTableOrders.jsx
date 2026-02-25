import React from 'react'
import { Search, Plus, Upload, Filter, Download, ChevronRight, X, ChevronLeft } from 'lucide-react'
import OrderPageHeader from './OrderPageHeader'
import OrderTabs from './OrderTabs'
import { OrderTable } from './OrderTable'
import AddOrderModal from './AddOrderModal'
function MainTableOrders({ user, activeTab, setActiveTab, showAddOrderModal, setShowAddOrderModal, tabs, ordersData, title, breadcrumb, onAddOrder, onBulkOrder, addButtonText, bulkButtonText, setActiveRoute, OrderID, Customer, OrderDate, PackageDetails, Status, LastMileDetails, ViewOrder, Actions, onViewOrder, onEditOrder, editOrder, onRefresh, onPayNow, onDownloadInvoice, onCancelShipment, onDownloadPOD, onDownloadLabel, onDownloadCommercialInvoice, onSearch, searchTerm }) {
    const [importing, setImporting] = React.useState(false);
    const fileInputRef = React.useRef(null);

    const handleDownloadTemplate = () => {
        const token = localStorage.getItem('token');
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/template`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Order_Import_Template.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch(err => console.error("Template download failed", err));
    };

    const handleImportClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImporting(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/import`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });
            const data = await res.json();
            alert(data.message);
            if (data.results?.failed > 0) {
                console.error("Failed rows:", data.results.errors);
            }
        } catch (error) {
            console.error(error);
            alert("Import failed");
        } finally {
            setImporting(false);
            e.target.value = null; // Reset input
        }
    };

    return (
        <div>
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
            />

            <OrderTabs activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />

            <OrderTable
                activeTab={activeTab}
                data={ordersData}
                Search={Search}
                Plus={Plus}
                Upload={Upload}
                Filter={Filter}
                Download={Download}
                onViewOrder={onViewOrder}
                onEditOrder={onEditOrder}
                onAddOrder={onAddOrder}
                onDownloadTemplate={handleDownloadTemplate}
                onImportClick={handleImportClick}
                importing={importing}
                tableConfig={{
                    orderIdLabel: OrderID,
                    customerLabel: Customer,
                    dateLabel: OrderDate,
                    packageLabel: PackageDetails,
                    statusLabel: Status,
                    lastMileLabel: LastMileDetails,
                    viewLabel: ViewOrder,
                    actionsLabel: Actions
                }}
                onSearch={onSearch}
                searchTerm={searchTerm}
                onFilter={() => console.log('Filter clicked')}
                onExport={() => console.log('Export clicked')}
                searchPlaceholder="Search by ID or Customer..."
                onPayNow={onPayNow}
                onDownloadInvoice={onDownloadInvoice}
                onCancelShipment={onCancelShipment}
                onDownloadPOD={onDownloadPOD}
                onDownloadLabel={onDownloadLabel}
                onDownloadCommercialInvoice={onDownloadCommercialInvoice}
            />


            {showAddOrderModal && (
                <AddOrderModal
                    user={user}
                    ChevronRight={ChevronRight}
                    ChevronLeft={ChevronLeft}
                    X={X}
                    title="Add Order"
                    onClose={() => setShowAddOrderModal(false)}
                    setActiveRoute={setActiveRoute}
                    editOrder={editOrder} // Pass editOrder prop
                    onSuccess={() => {
                        setShowAddOrderModal(false);
                        if (typeof window !== 'undefined') {
                            onRefresh && onRefresh(); // Use refresh if available
                        }
                    }}
                />
            )}


        </div>
    )
}

export default MainTableOrders
