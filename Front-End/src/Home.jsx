import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div>
            <Header />
            <Hero />
            <HowItWorks />
            <Features />
            <Footer />
        </div>
    );
};

export default Home;
