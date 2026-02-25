import React from 'react'

function integrations() {
    return (
        <div>
            <div className="p-4 lg:p-6 text-gray-900 dark:text-gray-100">
                <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                    <div className="mb-6">
                        <h2 className="text-xl font-bold mb-1">E-commerce Integrations</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Connect your online store to automate order syncing and shipping.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 border border-gray-100 dark:border-gray-800 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm font-bold text-blue-600">S</div>
                            <p className="font-bold mb-3">Shopify</p>
                            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Connect Store</button>
                        </div>
                        <div className="p-6 border border-gray-100 dark:border-gray-800 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm font-bold text-purple-600">W</div>
                            <p className="font-bold mb-3">WooCommerce</p>
                            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Connect Store</button>
                        </div>
                        <div className="p-6 border border-gray-100 dark:border-gray-800 rounded-xl text-center bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm font-bold text-orange-600">M</div>
                            <p className="font-bold mb-3">Magento</p>
                            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">Connect Store</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default integrations
