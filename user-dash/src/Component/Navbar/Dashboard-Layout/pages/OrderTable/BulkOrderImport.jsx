import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { Upload, Download, X, CheckCircle, AlertCircle } from 'lucide-react';

function BulkOrderImport({ onClose, onSuccess }) {
    const [file, setFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [results, setResults] = useState(null);

    const downloadTemplate = () => {
        // Create sample data
        const templateData = [
            {
                'First Name': 'John',
                'Last Name': 'Doe',
                'Mobile Number': '9876543210',
                'Email': 'john@example.com',
                'Address 1': '123 Main Street',
                'Address 2': 'Apartment 4B',
                'Landmark': 'Near City Mall',
                'Pincode': '110001',
                'City': 'Delhi',
                'State': 'Delhi',
                'Country': 'India',
                'Item Name': 'T-Shirt',
                'Quantity': '2',
                'Weight (kg)': '0.5',
                'Length (cm)': '30',
                'Breadth (cm)': '25',
                'Height (cm)': '5',
                'Declared Value': '500',
                'Payment Mode': 'Prepaid',
                'Service Type': 'Express'
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');

        // Download file
        XLSX.writeFile(wb, 'Order_Import_Template.xlsx');
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setResults(null);
        }
    };

    const handleImport = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        setImporting(true);
        setResults(null);

        try {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);

                    // Transform Excel data to API format
                    const orders = jsonData.map(row => ({
                        consignee: {
                            firstName: row['First Name'],
                            lastName: row['Last Name'],
                            mobileNumber: row['Mobile Number'],
                            email: row['Email'],
                            address1: row['Address 1'],
                            address2: row['Address 2'] || '',
                            landmark: row['Landmark'] || '',
                            pincode: row['Pincode'],
                            city: row['City'],
                            state: row['State'],
                            country: row['Country'] || 'India'
                        },
                        items: [{
                            name: row['Item Name'],
                            qty: parseInt(row['Quantity']) || 1,
                            weight: parseFloat(row['Weight (kg)']),
                            value: parseFloat(row['Declared Value'])
                        }],
                        deadWeight: parseFloat(row['Weight (kg)']),
                        value: parseFloat(row['Declared Value']),
                        paymentMode: row['Payment Mode'] || 'Prepaid',
                        status: 'draft'
                    }));

                    // Send to backend
                    const token = localStorage.getItem('token');
                    const config = { headers: { Authorization: `Bearer ${token}` } };

                    const response = await axios.post(
                        `${import.meta.env.VITE_API_BASE_URL}/api/orders/bulk`,
                        { orders },
                        config
                    );

                    setResults({
                        success: true,
                        total: orders.length,
                        created: response.data.created || orders.length,
                        failed: response.data.failed || 0
                    });

                    if (onSuccess) {
                        setTimeout(() => {
                            onSuccess();
                        }, 2000);
                    }
                } catch (error) {
                    console.error('Import error:', error);
                    setResults({
                        success: false,
                        error: error.response?.data?.message || 'Failed to import orders'
                    });
                }
            };

            reader.readAsArrayBuffer(file);
        } catch (error) {
            console.error('File read error:', error);
            setResults({
                success: false,
                error: 'Failed to read file'
            });
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-lg w-full max-w-2xl shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Order Import</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Download Template */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Step 1: Download Template</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Download the Excel template and fill in your order details
                        </p>
                        <button
                            onClick={downloadTemplate}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                            Download Template
                        </button>
                    </div>

                    {/* Upload File */}
                    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Step 2: Upload Filled Template</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Upload the completed Excel file with your orders
                        </p>
                        <div className="flex items-center gap-3">
                            <label className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors">
                                    <Upload className="w-5 h-5 text-gray-400" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {file ? file.name : 'Choose Excel file...'}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    {/* Import Button */}
                    <button
                        onClick={handleImport}
                        disabled={!file || importing}
                        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {importing ? 'Importing Orders...' : 'Import Orders'}
                    </button>

                    {/* Results */}
                    {results && (
                        <div className={`p - 4 rounded - lg ${results.success ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'} `}>
                            <div className="flex items-start gap-3">
                                {results.success ? (
                                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
                                )}
                                <div className="flex-1">
                                    {results.success ? (
                                        <>
                                            <h4 className="font-semibold text-green-900 dark:text-green-400 mb-1">
                                                Import Successful!
                                            </h4>
                                            <p className="text-sm text-green-700 dark:text-green-300">
                                                Successfully imported {results.created} out of {results.total} orders.
                                                {results.failed > 0 && ` ${results.failed} orders failed.`}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h4 className="font-semibold text-red-900 dark:text-red-400 mb-1">
                                                Import Failed
                                            </h4>
                                            <p className="text-sm text-red-700 dark:text-red-300">
                                                {results.error}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BulkOrderImport;
