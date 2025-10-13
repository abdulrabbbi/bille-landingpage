import React from "react";
import CardGrid from "../components/BlogsNews/CardGrid";
import HeroSection from "../components/BlogsNews/HeroSection";

const BlogsNews = () => (
  <div className="mx-auto w-full max-w-screen-xl space-y-8 md:space-y-10 mt-8">
    <HeroSection />
    <CardGrid />
  </div>
);
export default BlogsNews;
