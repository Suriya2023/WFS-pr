import React from 'react'
import b5 from '../../../assets/Uploads/About/b5.webp'
import b6 from '../../../assets/Uploads/About/b6.webp'
import b7 from '../../../assets/Uploads/About/b7.webp'
import b8 from '../../../assets/Uploads/About/b8.webp'

function NewBlogpost() {
  return (
    <div className="w-full bg-white py-16 px-6 md:px-20">

      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#1a4ca3] relative inline-block">
        New Arrivals in Your Export Feed
        <span className="absolute left-0 -bottom-1 w-24 h-1 bg-[#f4a700]"></span>
      </h1>

      <p className="text-xl font-semibold mt-5 text-black leading-snug">
        Fresh insights, latest updates, and brand-new blogs— <br />
        just landed
      </p>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10 mt-14">

        {[{img:b5, title:"WooCommerce Vs. Shopify: Best Platform for Dropshipping"},
          {img:b6, title:"How to Export Ayurvedic Products to Portugal"},
          {img:b7, title:"Black Friday Export Bundle Strategies"},
          {img:b8, title:"5 Common Export Mistakes During Peak Season (How to Avoid Them)"}
        ].map((card, index)=>(

          <div key={index} className="cursor-pointer group">
            <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition overflow-hidden">
              <img
                src={card.img}
                className="rounded-xl w-full transition-transform duration-500 group-hover:skew-x-6 group-hover:scale-105"
                alt=""
              />
            </div>
            <h3 className="text-lg font-bold mt-4">{card.title}</h3>
          </div>

        ))}

      </div>
    </div>
  )
}

export default NewBlogpost
