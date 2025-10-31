import React from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "../Layout";
import Home from "../pages/Home";
import FootballMap from "../pages/FootballMap";
import BlogsNews from "../pages/BlogsNews";
import BusinessBenefits from "../pages/BusinessBenefits";
import Shop from "../pages/Shop";
import Passion from "../pages/Passion";

const AppRoutes = () => {
  return (
    <Routes>
      {/* App layout with nested routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="business-benefits" element={<BusinessBenefits />} />
        <Route path="shop" element={<Shop />} />
        <Route path="passion" element={<Passion />} />
        <Route path="football-map" element={<FootballMap />} />
        <Route path="blogs-news" element={<BlogsNews />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
