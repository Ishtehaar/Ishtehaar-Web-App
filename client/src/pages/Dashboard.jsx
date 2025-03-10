import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashImageAd from "../components/DashImageAd";
import DashSaveAd from "../components/DashSaveAd";
import DashSEOKeywords from "../components/DashSEOKeywords";
import WebsiteAudit from "../components/WebsiteAudit";
import DashUsers from "../components/DashAdminUsers";
import { useSelector } from "react-redux";
import SocialMedia from "../components/SocialMedia";
import DashAdminSubscriptions from "../components/DashAdminSubscriptions";
// import DashProfile from "../compnents/DashProfile";

function Dashboard() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
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
      <div className="flex-1 flex ">
        {/* ImageAd */}
        {tab === "image-ad" && <DashImageAd />}
        {tab === "saved-ads" && <DashSaveAd />}
        {tab === "seo-keywords" && <DashSEOKeywords />}
        {tab === "website-audit" && <WebsiteAudit />}
        {tab === "dash-admin-users" && <DashUsers />}
        {tab === "dash-admin-subscriptions" && <DashAdminSubscriptions />}

        {tab === "social-media" && <SocialMedia />}
      </div>
    </div>
  );
}

export default Dashboard;
