import React from 'react'
import FranchiseSection from './FranchiseSection'
import PartnerSlider from '../../Home/Slider/PartnerSlider'
import DeliverySection from '../../Home/Slider/DeliverySection'
import pannIndea from '../../../assets/Uploads/About/f2.png';

import pannIndea2 from "../../../assets/Uploads/About/f3.png";
import pannIndea3 from "../../../assets/Uploads/About/f4.webp";
import pannIndea5 from "../../../assets/Uploads/About/f5.webp";

function Franchise() {
  const data = [
    {
      img: pannIndea,
      title: "Zero Upfront Cost & Global Reach",
      desc: "Start your logistics business with no hidden fees or heavy investment. Plug into our global network and start earning immediately.",
      boldDesc: "Zero Capital Entry",
      moreDesc: "Leverage our established infrastructure without heavy investment.",
      btn: "Join Network"
    },
  ]

  const data2 = [
    {
      img: pannIndea2,
      title: "Preferential Rates & Smart Tech",
      desc: "Get exclusive franchisee shipping rates. Book, track, and manage shipments with our advanced AI-powered platform.",
      boldDesc: "Competitive Margins",
      moreDesc: "Access wholesale shipping rates and maximize your profitability.",
      btn: "Check Margins"
    }
  ]

  const data3 = [
    {
      // img: pannIndea3,
      title: "Turnkey Setup & Instant Go-Live",
      desc: "We handle the heavy lifting—paperwork, tech setup, and compliance. You focus on growing your customer base.",
      boldDesc: "Turnkey Operations",
      moreDesc: "We provide the tech, training, and tools. You provide the drive.",
      btn: "Start Onboarding"
    },
  ]

  const data4 = [
    {
      // img: pannIndea5,
      title: "Your Business, Our Marketing",
      desc: "You run the operations, we drive the demand. Benefit from our national advertising and lead generation support.",
      boldDesc: "Brand Visibility",
      moreDesc: "Benefit from our national advertising campaigns and lead generation.",
      btn: "Grow With Us"
    },
  ]

  return (
    <div>
      <FranchiseSection />
      <PartnerSlider />
      <DeliverySection data={data} />
      <DeliverySection data={data2} reverse />
      <DeliverySection data={data3} />
      <DeliverySection data={data4} reverse />
    </div>
  )
}

export default Franchise
