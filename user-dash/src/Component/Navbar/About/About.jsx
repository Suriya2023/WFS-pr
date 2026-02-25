import React from 'react'
import AboutHero from "./AboutHero";
import FactsSection from "./FactsSection";
import FeaturesSection from "./FeaturesSection";
import StatsSection from "./StatsSection";
import AboutSection from './AboutSection';
function About() {
  return (
    <div>
      <AboutHero />
      <FactsSection />
      <FeaturesSection />
      <StatsSection />
      <AboutSection/>
    </div>
  )
}

export default About
