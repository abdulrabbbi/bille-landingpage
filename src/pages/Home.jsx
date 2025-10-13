import React from "react";
import HeroSection from "../components/Home/HeroSection";
import UserBenefits from "../components/Home/UserBenefits";
import BusinessBenefitsSection from "../components/Home/BusinessBenefitsSection";
import FollowClubCTA from "../components/Home/FollowClubCTA";
import AppPromoSection from "../components/Home/AppPromoSection";

const Home = () => (
  <div className="text-center">
    <HeroSection />
    <UserBenefits />
    <BusinessBenefitsSection />
     <FollowClubCTA />
     <AppPromoSection />
  </div>
);
export default Home;
