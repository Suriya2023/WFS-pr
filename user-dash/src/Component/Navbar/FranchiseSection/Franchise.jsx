import React from 'react'
import FranchiseSection from './FranchiseSection'
import PartnerSlider from '../../Home/Slider/PartnerSlider'
import DeliverySection from '../../Home/Slider/DeliverySection'
import pannIndea from '../../../assets/Uploads/About/f2.webp';

import pannIndea2 from "../../../assets/Uploads/About/f3.webp";
import pannIndea3 from "../../../assets/Uploads/About/f4.webp";
import pannIndea5 from "../../../assets/Uploads/About/f5.webp";
function Franchise() {
  const data = [
    {
      img: pannIndea,
      title: "No Upfront Cost & Wide Network",
      desc: "Start free, no investment, no hidden fees. Join our network and begin earning from Day 1 with full support.",
      // boldDesc: "Fully door-to-door. Zero hassle.",
      // moreDesc: "We’ve made the courier come to YOU, not the other way around.",
      // btn: "Schedule my Pick-up 🚚"
    },


  ]
  const data2 = [
    {
      img: pannIndea2,
      title: "Better Rates & Smart Platform",
      desc: "Get great shipping rates. Book, track, and manage everything in just a few clicks, with full control and clarity.",
      // boldDesc: "Trusted by thousands worldwide.",
      // moreDesc: "Join our community of satisfied customers who enjoy hassle-free global shipping.",
      // btn: "Get Started Today 🌍"
    }
  ]
  const data3 = [
    {
      img: pannIndea3,
      title: "Hassle-free setup & minimal paperwork",
      desc: "We handle all the paperwork. You plug in and start; stress-free, clear, simple.",
      // boldDesc: "No more “Oops, wrong invoice format” or “Your parcel’s stuck at customs.”",
      // moreDesc: "Save time,  skip queues, and focus on your business while we handle the messy part.",
      // btn: "Simplify my export documentation 🚚"
    },
  ]
  const data4 = [
    {
      img: pannIndea5,
      title: "Your store, our marketing",
      desc: "You run the store, we drive growth, backed by real marketing, proven results, and honest service.",
      // boldDesc: "No more “Oops, wrong invoice format” or “Your parcel’s stuck at customs.”",
      // moreDesc: "Save time,  skip queues, and focus on your business while we handle the messy part.",
      // btn: "Simplify my export documentation 🚚"
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
