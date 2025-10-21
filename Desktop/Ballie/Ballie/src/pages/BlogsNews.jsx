import React from "react";
import CardGrid from "../components/BlogsNews/CardGrid";
import HeroSection from "../components/BlogsNews/HeroSection";
import MoreLikeThis from "../components/BlogsNews/MoreLikeThis";

const BlogsNews = () => (
  <div className="text-center mt-10">
    <HeroSection />
    <CardGrid />
    <MoreLikeThis />
  </div>
);
export default BlogsNews;
