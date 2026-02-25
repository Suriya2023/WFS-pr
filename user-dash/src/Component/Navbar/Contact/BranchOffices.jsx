import React from 'react'

function BranchOffices() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
            <br />
            <div className="w-full bg-white border border-[#D5DDF8] rounded-2xl p-8 lg:p-14">
                <h2 className="text-3xl font-bold text-[#1A2B4B] mb-4">Branch Offices</h2>


                <p className="text-gray-600 text-lg leading-relaxed mb-10 max-w-3xl">
                    We offer nationwide pickup services and operate in the following cities,
                    ensuring same-day pickup convenience right from your doorstep!
                </p>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Column 1 */}
                    <div className="flex flex-col gap-4 text-lg font-semibold text-[#1A2B4B]">
                        <span className="flex border-b border-gray-300 items-center gap-2 text-[#1A2B4B]"><span className="text-[#FF9900]">➤</span> Jaipur</span>
                        <span className="flex border-b border-gray-300 items-center gap-2 text-[#1A2B4B]"><span className="text-[#FF9900]">➤</span> Ahmedabad</span>
                        <span className="flex border-b border-gray-300 items-center gap-2 text-[#1A2B4B]"><span className="text-[#FF9900]">➤</span> Moradabad</span>
                        <span className="flex border-b border-gray-300 items-center gap-2 text-[#1A2B4B]"><span className="text-[#FF9900]">➤</span> Lucknow</span>
                        <span className="flex border-b border-gray-300 items-center gap-2 text-[#1A2B4B]"><span className="text-[#FF9900]">➤</span> Roorkee</span>
                    </div>


                    {/* Column 2 */}
                    <div className="flex flex-col gap-4 text-lg font-semibold text-[#1A2B4B]">
                        <span className="flex border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Bhopal</span>
                        <span className="flex border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Chennai</span>
                        <span className="flex border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Mumbai</span>
                        <span className="flex border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Udaipur</span>
                        <span className="flex border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Jalandhar</span>
                    </div>


                    {/* Column 3 */}
                    <div className="flex flex-col gap-4 text-lg font-semibold text-[#1A2B4B]">
                        <span className="flex  border-b border-gray-300  items-center gap-2"><span className="text-[#FF9900]">➤</span> Surat</span>
                        <span className="flex  border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Agra</span>
                        <span className="flex  border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Kanpur</span>
                        <span className="flex  border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Meerut</span>
                        <span className="flex  border-b border-gray-300 items-center gap-2"><span className="text-[#FF9900]">➤</span> Ludhiana</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BranchOffices
