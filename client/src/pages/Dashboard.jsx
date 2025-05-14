

import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { FiArrowRight, FiStar, FiCheck, FiTrendingUp } from "react-icons/fi";
import DashSidebar from "../components/DashSidebar";
import DashImageAd from "../components/DashImageAd";
import DashSaveAd from "../components/DashSaveAd";
import DashSEOKeywords from "../components/DashSEOKeywords";
import WebsiteAudit from "../components/WebsiteAudit";
import DashUsers from "../components/DashAdminUsers";
import { useSelector } from "react-redux";
import SocialMedia from "../components/SocialMedia";
import DashAdminSubscriptions from "../components/DashAdminSubscriptions";
import DashboardOverview from "../components/DashboardOverview";
import DashAdminComplaints from "../components/DashAdminComplaints";
import BusinessDomainAssessment from "./BusinessDomainAssessment";
import SocialMediaTrendsAssistant from "../components/SocialMediaTrendsAssistant";

// import DashProfile from "../components/DashProfile";

function Dashboard() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState("");

 

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    } else {
      // Default to overview if no tab specified
      setTab("overview");
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      <div className="md:w- shadow-md z-10">
        {/* Sidebar */}
        <DashSidebar />
      </div>

      <div className="flex-1 p-6">

        {/* Main Content */}
        <div className="flex flex-1">
          {/* Tab Content */}
          {tab === "overview" && (
            <DashboardOverview currentUser={currentUser} />
          )}
          {tab === "image-ad" && <DashImageAd />}
          {tab === "saved-ads" && <DashSaveAd />}
          {tab === "seo-keywords" && <DashSEOKeywords />}
          {tab === "website-audit" && <WebsiteAudit />}
          {tab === "dash-admin-users" && <DashUsers />}
          {tab === "dash-admin-subscriptions" && <DashAdminSubscriptions />}
          {tab === "dash-admin-complaints" && <DashAdminComplaints />}
          {tab === "social-media" && <SocialMedia />}
          {tab === "business-domain-assessment" && <BusinessDomainAssessment />}
          {tab === "trends-assistant" && <SocialMediaTrendsAssistant />}
        </div>
      </div>
    </div>
  );  
}

export default Dashboard;
