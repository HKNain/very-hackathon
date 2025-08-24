import React from "react";
import Hero from "../components/ui/Hero";
import Features from "../components/ui/Features";
import Testimonials from "../components/ui/Testimonials";
import Stats from "../components/ui/Stats";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <Stats />
      <Footer />
    </>
  );
};

export default Home;
