import React from 'react'
const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    purple: 'bg-purple-100 text-purple-600',
}

function StatsCard({ icon, label, count, color, onClick }) {
    return (
        <div onClick={onClick} className="cursor-pointer">
            <div className="bg-white rounded-2xl border border-yellow-50 p-4 sm:p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="flex flex-col gap-3">
                    <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${colorClasses[color]} shrink-0 shadow-sm`}>
                        {React.cloneElement(icon, { className: "w-6 h-6" })}
                    </div>
                    <div>
                        <div className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</div>
                        <div className="text-2xl sm:text-3xl font-extrabold text-red-700 leading-none">{count}</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatsCard
