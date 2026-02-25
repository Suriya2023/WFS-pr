import React from 'react'

function ActionCard({ icon, label, count, onClick }) {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <div className="bg-white rounded-2xl border border-yellow-100 p-4 sm:p-6 hover:shadow-lg transition-all duration-300 transform active:scale-95 group">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-yellow-300 group-hover:bg-yellow-400 transition-colors shrink-0 shadow-sm">
            {React.cloneElement(icon, { className: "w-5 h-5 sm:w-6 sm:h-6 text-red-700" })}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-red-700">{count}</div>
        </div>
        <div className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</div>
      </div>
    </div>
  )
}

export default ActionCard
