import React from "react";

export default function LandingPage() {
  return (
    <div className="bg-[#F5E6D8] min-h-screen">
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow-md bg-[#F5E6D8]">
        <h1 className="text-2xl font-bold text-[#F57C00]">
          ISHTE<span className="text-[#333333]">HAAR</span>
        </h1>
        <nav className="hidden sm:flex space-x-6 text-[#333333] font-medium">
          <a href="#home" className="hover:text-[#F57C00]">Home</a>
          <a href="#content" className="hover:text-[#F57C00]">Content</a>
          <a href="#social-media" className="hover:text-[#F57C00]">Social Media</a>
          <a href="#analytics" className="hover:text-[#F57C00]">Analytics</a>
          <a href="#pricing" className="hover:text-[#F57C00]">Pricing</a>
          <a href="#contact" className="hover:text-[#F57C00]">Contact</a>
        </nav>
        <button className="px-4 py-2 bg-[#F57C00] text-white rounded-md hover:bg-[#D66900]">
          Sign in
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center gap-8 px-6 py-12 lg:px-20">
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left space-y-6">
          <h2 className="text-2xl lg:text-4xl font-semibold text-[#333333]">
            YOUR DIGITAL MARKETING <span className="text-[#F57C00]">COMPANION</span>
          </h2>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-[#F57C00]">
            ISHTEHAAR
          </h1>
          <p className="text-lg text-[#555555]">
            Struggling to Stand Out in the Digital World? Ishtehaar is your one-stop destination
            for transforming digital marketing with AI-powered content creation, personalized
            recommendations, and seamless social media management. Optimize your SEO, create
            stunning ads with customizable templates, and gain deep insights with comprehensive
            analytics.
          </p>
          <button className="px-6 py-3 bg-[#F57C00] text-white rounded-md text-lg hover:bg-[#D66900]">
            Get Started
          </button>
        </div>

        {/* Right Content */}
        <div className="lg:w-1/2 relative">
          <img
            src="https://via.placeholder.com/600x400" // Replace with the relevant image URL
            alt="Digital Marketing Illustration"
            className="w-full h-auto"
          />
          <div className="absolute bottom-4 right-4 bg-[#F57C00] text-white px-3 py-1 rounded-md">
            Ishtehaar Madadgar
          </div>
        </div>
      </main>
    </div>
  );
}
