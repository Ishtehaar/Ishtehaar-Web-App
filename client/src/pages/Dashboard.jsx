// import React, { useEffect, useState } from "react";
// import { useLocation, Link } from "react-router-dom";
// import { FiX, FiArrowRight, FiStar, FiCheck, FiTrendingUp } from "react-icons/fi";
// import DashSidebar from "../components/DashSidebar";
// import DashImageAd from "../components/DashImageAd";
// import DashSaveAd from "../components/DashSaveAd";
// import DashSEOKeywords from "../components/DashSEOKeywords";
// import WebsiteAudit from "../components/WebsiteAudit";
// import DashUsers from "../components/DashAdminUsers";
// import { useSelector } from "react-redux";
// import SocialMedia from "../components/SocialMedia";
// import DashAdminSubscriptions from "../components/DashAdminSubscriptions";
// import DashboardOverview from "../components/DashboardOverview";
// // import DashProfile from "../components/DashProfile";

// function Dashboard() {
//   const { currentUser, error, loading } = useSelector((state) => state.user);
//   const location = useLocation();
//   const [tab, setTab] = useState("");
//   const [showWelcome, setShowWelcome] = useState(true);
//   const [showFeatureTour, setShowFeatureTour] = useState(false);
//   const [currentFeature, setCurrentFeature] = useState(0);
//   const isNewUser = localStorage.getItem("firstLogin") !== "completed";

//   // Features overview for the tour
//   const features = [
//     {
//       title: "Create Engaging Ads",
//       description: "Design eye-catching image ads with our intuitive editor. Choose from templates or start from scratch.",
//       icon: "image-ad",
//     },
//     {
//       title: "Optimize for Search Engines",
//       description: "Use our SEO keyword tool to find the perfect keywords for better visibility.",
//       icon: "seo-keywords",
//     },
//     {
//       title: "Audit Your Website",
//       description: "Identify areas for improvement with our comprehensive website audit tool.",
//       icon: "website-audit",
//     },
//     {
//       title: "Social Media Integration",
//       description: "Connect and manage your social media campaigns directly from the dashboard.",
//       icon: "social-media",
//     }
//   ];

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const tabFromUrl = urlParams.get("tab");
//     if (tabFromUrl) {
//       setTab(tabFromUrl);
//     } else {
//       // Default to overview if no tab specified
//       setTab("overview");
//     }

//     // Check if first login for new user experience
//     if (isNewUser) {
//       setShowWelcome(true);
//       localStorage.setItem("firstLogin", "completed");
//     } else {
//       setShowWelcome(false);
//     }
//   }, [location.search, isNewUser]);

//   const dismissWelcome = () => {
//     setShowWelcome(false);
//   };

//   const startFeatureTour = () => {
//     setShowWelcome(false);
//     setShowFeatureTour(true);
//     setCurrentFeature(0);
//   };

//   const nextFeature = () => {
//     if (currentFeature < features.length - 1) {
//       setCurrentFeature(currentFeature + 1);
//     } else {
//       setShowFeatureTour(false);
//     }
//   };

//   const skipTour = () => {
//     setShowFeatureTour(false);
//   };

//   // Check if user is on free plan
//   const isFreePlan = currentUser?.subscription?.plan === "free";

//   return (
//     <div className="min-h-screen flex flex-col md:flex-row ">
//       <div className="md:w- shadow-md z-10">
//         {/* Sidebar */}
//         <DashSidebar />
//       </div>

//       <div className="flex-1 p-6">
//         {/* Welcome Banner for New Users */}
//         {showWelcome && (
//           <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg p-6 mb-6 text-white relative">
//             <button
//               onClick={dismissWelcome}
//               className="absolute top-2 right-2 p-1 rounded-full hover:bg-blue-400 transition-colors"
//             >
//               <FiX className="text-white" size={20} />
//             </button>

//             <h2 className="text-2xl font-bold mb-2">Welcome to Ishtehaar, {currentUser?.username || "there"}!</h2>
//             <p className="mb-4">Your digital marketing journey starts here. Let's create compelling ads that convert.</p>

//             <div className="flex items-center mb-4">
//               <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
//                 <FiStar className="text-yellow-300" size={24} />
//               </div>
//               <div>
//                 <p className="font-medium">Current Plan: {currentUser?.subscription?.plan || "Free"}</p>
//                 <p className="text-sm text-blue-100">
//                   {isFreePlan
//                     ? "Limited to 3 ad creations per month"
//                     : "Unlimited ad creations until " +
//                       new Date(currentUser?.subscription?.expiresAt).toLocaleDateString()}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3">
//               <button
//                 onClick={startFeatureTour}
//                 className="px-4 py-2 bg-white text-indigo-600 rounded-md font-medium flex items-center justify-center hover:bg-opacity-90 transition-colors"
//               >
//                 Take a quick tour <FiArrowRight className="ml-2" />
//               </button>

//               {isFreePlan && (
//                 <Link
//                   to="/subscription"
//                   className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-md font-medium flex items-center justify-center hover:bg-yellow-300 transition-colors"
//                 >
//                   Upgrade to Premium <FiTrendingUp className="ml-2" />
//                 </Link>
//               )}
//             </div>
//           </div>
//         )}

//         {/* Feature Tour */}
//         {showFeatureTour && (
//           <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-indigo-500 relative">
//             <button
//               onClick={skipTour}
//               className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
//             >
//               Skip tour
//             </button>

//             <div className="flex items-start">
//               <div className="bg-indigo-100 p-3 rounded-lg mr-4">
//                 <img
//                   src={`/icons/${features[currentFeature].icon}.svg`}
//                   alt={features[currentFeature].title}
//                   className="w-10 h-10"
//                 />
//               </div>

//               <div>
//                 <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                   {features[currentFeature].title}
//                 </h3>
//                 <p className="text-gray-600 mb-4">
//                   {features[currentFeature].description}
//                 </p>

//                 <div className="flex justify-between items-center">
//                   <div className="flex space-x-1">
//                     {features.map((_, index) => (
//                       <div
//                         key={index}
//                         className={`h-1.5 w-6 rounded-full ${
//                           index === currentFeature ? 'bg-indigo-500' : 'bg-gray-200'
//                         }`}
//                       />
//                     ))}
//                   </div>

//                   <button
//                     onClick={nextFeature}
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//                   >
//                     {currentFeature === features.length - 1 ? 'Finish' : 'Next'}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Subscription Status Banner (visible after welcome is dismissed) */}
//         {!showWelcome && isFreePlan && (
//           <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex justify-between items-center">
//             <div className="flex items-center">
//               <div className="bg-amber-100 p-2 rounded-full mr-3">
//                 <FiStar className="text-amber-500" size={20} />
//               </div>
//               <div>
//                 <p className="font-medium text-gray-800">You're on the Free Plan</p>
//                 <p className="text-sm text-gray-600">Limited to 3 ad creations per month</p>
//               </div>
//             </div>
//             <Link
//               to="/subscription"
//               className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md font-medium hover:from-amber-600 hover:to-amber-700 transition-all"
//             >
//               Upgrade Now
//             </Link>
//           </div>
//         )}

//         {/* Premium Plan Benefits (if on free plan) */}
//         {!showWelcome && isFreePlan && tab === "overview" && (
//           <div className="bg-white rounded-lg shadow-sm p-5 mb-6 border border-gray-100">
//             <h3 className="text-lg font-semibold text-gray-800 mb-3">Unlock Premium Features</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="flex items-start">
//                 <div className="mt-1 mr-3 text-green-500"><FiCheck size={18} /></div>
//                 <div>
//                   <p className="font-medium text-gray-700">Unlimited Ad Creation</p>
//                   <p className="text-sm text-gray-500">Create as many ads as you need</p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <div className="mt-1 mr-3 text-green-500"><FiCheck size={18} /></div>
//                 <div>
//                   <p className="font-medium text-gray-700">Advanced Analytics</p>
//                   <p className="text-sm text-gray-500">Get detailed performance reports</p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <div className="mt-1 mr-3 text-green-500"><FiCheck size={18} /></div>
//                 <div>
//                   <p className="font-medium text-gray-700">Priority Support</p>
//                   <p className="text-sm text-gray-500">Get help when you need it</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Main Content */}
//         <div className=" flex flex-1">
//           {/* Tab Content */}
//           {tab === "overview" && <DashboardOverview currentUser={currentUser} />}
//           {tab === "image-ad" && <DashImageAd />}
//           {tab === "saved-ads" && <DashSaveAd />}
//           {tab === "seo-keywords" && <DashSEOKeywords />}
//           {tab === "website-audit" && <WebsiteAudit />}
//           {tab === "dash-admin-users" && <DashUsers />}
//           {tab === "dash-admin-subscriptions" && <DashAdminSubscriptions />}
//           {tab === "social-media" && <SocialMedia />}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;

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
          {tab === "social-media" && <SocialMedia />}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
