import React from "react";
import HeroSection from "../components/Home/HeroSection";
import UserBenefits from "../components/Home/UserBenefits";
import BusinessBenefitsSection from "../components/Home/BusinessBenefitsSection";
import FollowClub from "../components/Home/FollowClub";
import AppPromo from "../components/Home/AppPromo";
import BlogsPreview from "../components/Home/BlogsPreview";

const Home = () => (
  <div className="text-center mt-10">
    <HeroSection />
    <UserBenefits />
    <BusinessBenefitsSection />
    <FollowClub />
    <AppPromo />
    <BlogsPreview />
    <h1 className="text-4xl font-bold text-lime-400">Welcome to BALLIE</h1>
    <p className="mt-2 text-gray-300">Your football map and news hub.</p>
  </div>
);
export default Home;
