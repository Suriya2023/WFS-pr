import React from 'react'
import { motion } from 'framer-motion'
import HeroSection from './HeroSections/HeroSection'
import PartnerSlider from './Slider/PartnerSlider'
import DeliverySection from './Slider/DeliverySection'
import StepSection from './Stage/StepSection'
import ServiceTabs from './ServiceTab/ServiceTabs'
import GetQuoteSection from './Quote/GetQuoteSection'
import ExportSuccess from './VideoPlay/ExportSuccess'
import TestimonialsSection from './ReviewCutsomer/TestimonialsSection'
import PressHighlights from './Highlights/PressHighlights'
import BlogSection from './BlogSection/BlogSection'

// Importing images from assets to ensure Vite builds them correctly
// import h1 from '../../assets/Uploads/h1.png';
// import h2 from '../../assets/Uploads/h2.png';
// import h3 from '../../assets/Uploads/h3.png';
// import h4 from '../../assets/Uploads/h4.png';
// import h5 from '../../assets/Uploads/h5.png';

function Home() {
    const data = [
        {
            img: "h1",
            title: "Global Logistics Redefined",
            desc: "BGL Express orchestrates the complexity of international trade. From automated HS Code classification to real-time custom duties estimation, we bridge 220+ countries with digital precision.",
            boldDesc: "Scale your reach with zero operational friction.",
            moreDesc: "Our network handles the complexity while you handle the growth.",
            btn: "Ship Globally 🚢"
        }
    ]
    const data_domestic = [
        {
            img: "h2",
            title: "Hyper-Local Domestic Express",
            desc: "Pann-India coverage with lightning-fast delivery. BGL Express connects every corner of the country with a robust road and air network, ensuring your domestic shipments arrive on time, every time.",
            boldDesc: "India's largest domestic logistics reach.",
            moreDesc: "Safe, secure, and fully tracked domestic transport.",
            btn: "Start Domestic Shipping 🇮🇳"
        }
    ]
    const data_intercity = [
        {
            img: "h3",
            title: "Rapid Intercity Connectivity",
            desc: "Same-day and next-day intercity solutions for urgent business needs. BGL Express provides dedicated point-to-point transit for high-priority documents and parcels within city limits.",
            boldDesc: "Optimized for speed and local efficiency.",
            moreDesc: "Priority routing for intra-city and intercity urgent cargo.",
            btn: "Book Intercity Delivery 🚚"
        }
    ]
    const data2 = [
        {
            img: "h4",
            title: "Enterprise Bulk Cargo Solutions",
            desc: "High-volume logistics optimized for modern enterprises. BGL Express provides dedicated air/sea freight lanes and competitive tier-1 contract rates for major commercial shipments.",
            boldDesc: "Priority routing for bulk commercial freight.",
            moreDesc: "Dedicated account management for world-class reliability.",
            btn: "Get Bulk Quote 📦"
        }
    ]
    const data3 = [
        {
            img: "h5",
            title: "Smart Marketplace Sync",
            desc: "Sell effortlessly on Amazon, eBay, and Shopify. BGL's automated engine syncs your store directly, generating labels and tracking info in real-time while you sleep.",
            boldDesc: "Turn your local brand into a global titan.",
            moreDesc: "Seamless API integration with all major e-commerce platforms.",
            btn: "Sync Store Now 🚀"
        },
    ]

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
        >
            <HeroSection />
            <PartnerSlider />

            <div className="space-y-[-4rem] lg:space-y-[-6rem]">
                <DeliverySection data={data} />
                <DeliverySection data={data_domestic} reverse />
                <DeliverySection data={data_intercity} />
                <DeliverySection data={data2} reverse />
                <DeliverySection data={data3} />
            </div>

            <StepSection />
            <ServiceTabs />
            <GetQuoteSection />
            <ExportSuccess />
            <TestimonialsSection />
            <PressHighlights />
            {/* <BlogSection /> */}
        </motion.div>
    )
}

export default Home
