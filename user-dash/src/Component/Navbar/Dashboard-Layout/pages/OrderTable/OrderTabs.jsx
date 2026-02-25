import React from 'react'

function OrderTabs({ activeTab, onTabChange, tabs }) {
    return (
        <div>
            <div className="bg-white   dark:bg-gray-900 dark:border-gray-800 transition-colors duration-200">
                <br />
                <div className="px-4 lg:px-6">
                    <div className="flex gap-6 overflow-x-auto no-scrollbar">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`pb-3 px-2 text-sm font-medium whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === tab.id
                                    ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-400'
                                    : 'border-transparent text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default OrderTabs
