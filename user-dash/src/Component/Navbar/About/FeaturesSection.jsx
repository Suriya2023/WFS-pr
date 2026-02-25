import React from "react";
import FeatureCard from "./FeatureCard";

// Import GIFs
import growthGif from "../../../assets/Uploads/About/g1.gif";
import networkGif from "../../../assets/Uploads/About/g2.gif";
import trustedGif from "../../../assets/Uploads/About/g3.gif";
import launchpadGif from "../../../assets/Uploads/About/g5.gif";

const FeaturesSection = () => {
  return (
    <section className="w-full px-6 md:px-20 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      <FeatureCard
        gif={growthGif}
        title="Proven Growth"
        description="Our exporters have seen a business growth of 36% in the first year, and more than 50% in the following year."
      />

      <FeatureCard
        gif={networkGif}
        title="Strong Network"
        description="We have the widest and fastest growing dedicated pick-up network spanning over 30+ key regions."
      />

      <FeatureCard
        gif={trustedGif}
        title="Trusted Choice"
        description="8/10 eCommerce exporters consider us to be the most reliable and affordable courier partner."
      />

      <FeatureCard
        gif={launchpadGif}
        title="Exporter Launchpad"
        description="40% of our exporters started their export journey with us and have now become established market players."
      />

    </section>
  );
};

export default FeaturesSection;
