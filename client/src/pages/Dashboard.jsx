import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashImageAd from "../components/DashImageAd";
import DashSaveAd from "../components/DashSaveAd";
import DashSEOKeywords from "../components/DashSEOKeywords";
// import DashProfile from "../compnents/DashProfile";

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlPrams = new URLSearchParams(location.search);
    const tabFromUrl = urlPrams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
  <div className="md:w-56">
    {/* Sidebar */}
    <DashSidebar />
  </div>
  <div className="flex-1 flex justify-center items-center">
    {/* ImageAd */}
    {tab === "image-ad" && <DashImageAd />}
    {tab === "saved-ads" && <DashSaveAd />}
    {tab === "seo-keywords" && <DashSEOKeywords />}

  </div>
</div>

  );
}

export default Dashboard;
