import React, { useEffect, useState } from "react";
import { Sidebar, Badge, Progress } from "flowbite-react";
import { FaUsersCog, FaCrown } from "react-icons/fa";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdOutlineFeedback } from "react-icons/md";
import { CiImageOn, CiSaveDown2, CiLogout } from "react-icons/ci";
// import { MdHistory } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { LuEarth } from "react-icons/lu";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userSubscription, setUserSubscription] = useState({
    subscription: "free",
    adCreditsRemaining: 5,
    subscriptionEndDate: null
  });
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlPrams = new URLSearchParams(location.search);
    const tabFromUrl = urlPrams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  // useEffect(() => {
  //   // Fetch user subscription data
  //   const fetchUserSubscription = async () => {
  //     try {
  //       const res = await fetch("/api/user/getUser");
  //       const data = await res.json();
  //       if (data.success) {
  //         setUserSubscription({
  //           subscription: data.subscription,
  //           adCreditsRemaining: data.adCreditsRemaining,
  //           subscriptionEndDate: data.subscriptionEndDate
  //         });
  //       }
  //     } catch (error) {
  //       console.log("Error fetching subscription data:", error.message);
  //     }
  //   };

  //   if (currentUser && !currentUser.isAdmin) {
  //     fetchUserSubscription();
  //   }
  // }, []);


  // const handleSignout = async () => {
  //   try {
  //     const res = await fetch("/api/auth/signout", {
  //       method: "POST",
  //     });
  //     const data = await res.json();
  //     if (!res.ok) {
  //       console.log(data.message);
  //     } else {
  //       dispatch(signoutSuccess());
  //     }
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  // const handleNavigation = (path) => {
  //   navigate(path);
  // };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };

  // Custom sidebar item component that doesn't rely on Flowbite's context
  const CustomSidebarItem = ({ icon: Icon, active, onClick, children, to }) => {
    const content = (
      <div 
        className={`flex items-center p-2 text-base font-normal rounded-lg cursor-pointer py-4
          ${active ? 'bg-gray-100 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
        `}
        onClick={onClick}
      >
        {Icon && <Icon className="w-6 h-6 mr-3 text-gray-500 dark:text-gray-400" />}
        <span className="flex-1 whitespace-nowrap">{children}</span>
      </div>
    );

    return to ? <Link to={to}>{content}</Link> : content;
  };

  return (
    <div className="w-full md:w-56 h-full flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex-grow p-2">
        <div className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin ? (
            <>
              <CustomSidebarItem
                icon={FaUsersCog}
                active={tab === "dash-admin-users"}
                to="/dashboard?tab=dash-admin-users"
              >
                User Management
              </CustomSidebarItem>
              <CustomSidebarItem
                icon={IoPricetagsOutline}
                active={tab === "image-ad"}
              >
                Subscription Control
              </CustomSidebarItem>
              <CustomSidebarItem
                icon={MdOutlineFeedback}
                active={tab === "image-ad"}
              >
                Complaint Resolution
              </CustomSidebarItem>
            </>
          ) : (
            <>
              <CustomSidebarItem
                icon={CiImageOn}
                active={tab === "image-ad"}
                to="/dashboard?tab=image-ad"
              >
                Visual Ad Creation
              </CustomSidebarItem>
              <CustomSidebarItem
                icon={CiSearch}
                active={tab === "seo-keywords"}
                to="/dashboard?tab=seo-keywords"
              >
                SEO Assistant
              </CustomSidebarItem>
              <CustomSidebarItem
                icon={LuEarth}
                active={tab === "website-audit"}
                to="/dashboard?tab=website-audit"
              >
                Website Audit
              </CustomSidebarItem>
              <CustomSidebarItem
                icon={CiSaveDown2}
                active={tab === "saved-ads"}
                to="/dashboard?tab=saved-ads"
              >
                Saved Ads
              </CustomSidebarItem>
              <CustomSidebarItem
                icon={CiSaveDown2}
                active={tab === "social-media"}
                to="/dashboard?tab=social-media"
              >
                Post to Socials
              </CustomSidebarItem>
            </>
          )}
        </div>
      </div>
      
      {/* Subscription Status at bottom */}
      {currentUser && !currentUser.isAdmin && (
        <div className="mt-auto mb-2 px-3">
          <div className=" rounded-lg p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium ">Your Plan</h3>
              <Badge color={currentUser.subscription === 'paid' ? "purple" : "gray"} size="sm">
                {currentUser.subscription === 'paid' ? "Premium" : "Free"}
              </Badge>
            </div>
            
            {currentUser.subscription === 'paid' ? (
              <div className="flex items-center text-sm  mb-2">
                <FaCrown className="h-4 w-4 text-purple-500 mr-2" />
                <span>Unlimited ad credits</span>
              </div>
            ) : (
              <>
                <div className="mb-1 flex justify-between">
                  <span className="text-xs font-medium ">
                    Credits Remaining
                  </span>
                  <span className="text-xs font-medium ">
                    {currentUser.adCreditsRemaining}/5
                  </span>
                </div>
                <Progress 
                  color="purple" 
                  progress={Math.round((currentUser.adCreditsRemaining / 5) * 100)} 
                  size="sm"
                />
              </>
            )}
            
            {currentUser.subscription === 'paid' && (
              <div className="text-xs  mt-2">
                Valid until: {formatDate(currentUser.subscriptionEndDate)}
              </div>
            )}
            
            {currentUser.subscription === 'free' && (
              <Link to="/pricing">
                <button className="w-full mt-2 text-xs px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:bg-purple-700 transition-colors">
                  Upgrade to Premium
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}