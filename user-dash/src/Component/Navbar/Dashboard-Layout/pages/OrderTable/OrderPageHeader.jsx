
import React, { useState } from 'react';
import { Plus, Upload, Search, Filter, Download, ChevronRight, ChevronLeft, X } from 'lucide-react';

function OrderPageHeader({ title, breadcrumb, onAddOrder, onBulkOrder, addButtonText, bulkButtonText, setActiveRoute }) {
    const [importing, setImporting] = React.useState(false);

    // Hidden file input ref
    const fileInputRef = React.useRef(null);

    const handleDownloadTemplate = () => {
        const token = localStorage.getItem('token');

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/template`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to download template");
                return res.blob();
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Order_Import_Template.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
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
            alert(data.message); // Simple feedback for now
            if (data.results?.failed > 0) {
                console.error("Failed rows:", data.results.errors);
            }
            // window.location.reload(); // Or trigger refresh
        } catch (error) {
            console.error(error);
            alert("Import failed");
        } finally {
            setImporting(false);
            e.target.value = null; // Reset input
        }
    };

    return (
        <div className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-200">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">
                    {/* Breadcrumb + Title */}
                    <div className="flex flex-col">


                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-3 justify-start md:justify-end">
                        {/* Download Template */}
                        <button
                            onClick={handleDownloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Template
                        </button>

                        {/* Hidden File Input */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept=".xlsx, .xls"
                            onChange={handleFileChange}
                        />

                        {/* Import Excel */}
                        <button
                            onClick={handleImportClick}
                            disabled={importing}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-400"
                        >
                            {importing ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            ) : (
                                <Upload className="w-5 h-5" />
                            )}
                            {importing ? 'Importing...' : 'Import Excel'}
                        </button>

                        {/* Add Order */}
                        <button
                            onClick={onAddOrder}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                        >
                            <Plus className="w-5 h-5" />
                            {addButtonText}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default OrderPageHeader
