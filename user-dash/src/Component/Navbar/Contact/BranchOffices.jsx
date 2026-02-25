import React from 'react'

function BranchOffices() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <br />
            <div className="w-full bg-white border border-[#D5DDF8] rounded-2xl p-8 lg:p-14">
                <h2 className="text-3xl font-bold text-[#1A2B4B] mb-4">Branch Offices</h2>


                <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-3xl">
                    We operate directly from our key hubs, ensuring seamless logistics and quick turnaround times.
                </p>


                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-4 text-lg font-semibold text-[#1A2B4B]">
                        <div className="flex flex-col gap-2 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
                            <span className="flex items-center gap-2 text-[#1A2B4B] text-2xl font-bold">
                                <span className="text-red-600">➤</span> Delhi
                            </span>
                            <p className="text-gray-500 text-sm font-medium pl-6">
                                A-60, opp. Aerocity, Block B, Mahipalpur,<br />
                                New Delhi 110037, India
                            </p>
                        </div>
                    </div>


                    {/* Column 2 */}
                    <div className="flex flex-col gap-4 text-lg font-semibold text-[#1A2B4B]">
                        <div className="flex flex-col gap-2 p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all">
                            <span className="flex items-center gap-2 text-[#1A2B4B] text-2xl font-bold">
                                <span className="text-red-600">➤</span> Surat
                            </span>
                            <p className="text-gray-500 text-sm font-medium pl-6">
                                H.NO.7/3955A, Room No.3-4, First Floor,<br />
                                Satimata Sheri, Rughnathpura,<br />
                                Surat, Gujarat - 395003
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BranchOffices
