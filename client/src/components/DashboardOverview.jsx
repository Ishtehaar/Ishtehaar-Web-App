import React, { useEffect, useState } from "react";
import {
  FiGrid,
  FiImage,
  FiSearch,
  FiCode,
  FiUsers,
  FiTrendingUp,
  FiStar,
  FiUserPlus,
  FiCreditCard,
  FiAlertCircle,
} from "react-icons/fi";
import { Link } from "react-router-dom";

const DashboardOverview = ({ currentUser }) => {
  // Quick stats based on user data
  // Check if user is on free plan
  const isFreePlan = currentUser?.subscription === "free";
  const [adCount, setAdCount] = useState();
  const [userCount, setUserCount] = useState();
  const [subscriptionCount, setSubscriptionCount] = useState();
  const [complaintCount, setComplaintCount] = useState();
  const [SEOCount, setSEOCount] = useState();
  const [auditCount, setAuditCount] = useState();
  const [socialCampaignCount, setSocialCampaignCount] = useState();
  console.log("dmklmd", adCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/advertisment/getAds");
        const data = await res.json();
        console.log(data);
        setAdCount(data.adCount);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/getUsers");
        const data = await res.json();
        console.log(data);
        setUserCount(data.totalUsers);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/subscription/get-subscriptions");
        const data = await res.json();
        console.log(data);
        setSubscriptionCount(data.subscriptionCount);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/user/getUser");
        const data = await res.json();
        console.log(data);
        setAuditCount(data.websiteAuditsCreated);
        setSEOCount(data.SEOKeywordsCreated);
        setSocialCampaignCount(data.socialCampaignsCreated);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/complaint/get-complaint-stats");
        const data = await res.json();
        console.log(data);
        setComplaintCount(data.total);
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const stats = [
    {
      title: "Total Ads Created",
      value: adCount || 0,
      icon: <FiImage className="text-blue-500" />,
      link: "?tab=saved-ads",
    },
    {
      title: "SEO Keywords",
      value: SEOCount || 0,
      icon: <FiSearch className="text-green-500" />,
      link: "?tab=seo-keywords",
    },
    {
      title: "Website Audits",
      value: auditCount || 0,
      icon: <FiCode className="text-purple-500" />,
      link: "?tab=website-audit",
    },
    {
      title: "Social Campaigns",
      value: socialCampaignCount || 0,
      icon: <FiUsers className="text-red-500" />,
      link: "?tab=social-media",
    },
  ];
  const adminStats = [
    {
      title: "Total Users",
      value: userCount || 0,
      icon: <FiUserPlus className="text-blue-500" />,
      link: "?tab=saved-ads",
    },
    {
      title: "Subscription Plans",
      value: subscriptionCount || 0,
      icon: <FiCreditCard className="text-green-500" />,
      link: "?tab=seo-keywords",
    },
    {
      title: "Total Complaints",
      value: complaintCount || 0,
      icon: <FiAlertCircle className="text-purple-500" />,
      link: "?tab=website-audit",
    },
  ];

  // Core features of the platform
  const features = [
    {
      title: "Image Ad Creator",
      description:
        "Design professional advertising images with our drag-and-drop editor",
      icon: <FiImage size={24} />,
      link: "?tab=image-ad",
      color: "bg-blue-500",
    },
    {
      title: "SEO Keywords",
      description:
        "Research and track keywords to improve your online visibility",
      icon: <FiSearch size={24} />,
      link: "?tab=seo-keywords",
      color: "bg-green-500",
    },
    {
      title: "Website Audit",
      description:
        "Analyze your website performance and get actionable recommendations",
      icon: <FiCode size={24} />,
      link: "?tab=website-audit",
      color: "bg-purple-500",
    },
    {
      title: "Social Media Management",
      description: "Create, schedule and analyze your social media campaigns",
      icon: <FiUsers size={24} />,
      link: "?tab=social-media",
      color: "bg-red-500",
    },
  ];
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen mx-auto">
        <div className="loader border-t-4 border-blue-500 border-solid rounded-full h-12 w-12 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      {/* Welcome Message */}

      <div className="rounded-lg shadow-lg p-6 mb-6 relative">
        <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
          Welcome to Ishtehaar, {currentUser?.username || "PAUL"}{" "}
          {currentUser.isAdmin && (
            <span className="ml-2 px-2 py-1 text-sm font-small text-white bg-purple-600 rounded-lg">
              Admin
            </span>
          )}
        </h2>

        {currentUser.isAdmin ? (
          <p className="mb-5 text-gray-400">
            As an admin of Ishtehaar, you have the authority to manage users,
            oversee subscription plans, and handle user complaints.
          </p>
        ) : (
          <p className="mb-5 text-gray-400">
            Your digital marketing journey starts here. Let's create compelling
            ads that convert.
          </p>
        )}

        {!currentUser.isAdmin && (
          <div className="flex items-center mb-4">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-3">
              <FiStar className="text-yellow-300" size={24} />
            </div>
            <div>
              <p className="font-medium">
                Current Plan: {currentUser.subscription}
              </p>
              <p className="text-sm text-gray-400">
                {isFreePlan
                  ? "Limited to 5 ad creations per month"
                  : "Unlimited ad creations until " +
                    new Date(
                      currentUser.subscriptionEndDate
                    ).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {!currentUser.isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div className=" p-4 rounded-lg border border-gray-400 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className=" text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {adminStats.map((stat, index) => (
            <div className=" p-4 rounded-lg border border-gray-400 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <p className=" text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-400">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 bg-slate-100 rounded-full">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {!currentUser.isAdmin ? (
        <div className="mb-8">
          <h2 className="text-lg font-semibold  mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="?tab=image-ad"
              className="flex items-center justify-center p-3  rounded-md border border-gray-400 hover:shadow-md transition-shadow "
            >
              <FiImage className="mr-2 text-blue-500" />
              <span className="font-medium ">Create New Ad</span>
            </Link>
            <Link
              to="?tab=website-audit"
              className="flex items-center justify-center p- rounded-md border border-gray-400 hover:shadow-md transition-shadow"
            >
              <FiCode className="mr-2 text-purple-500" />
              <span className="font-medium ">Audit Website</span>
            </Link>
            <Link
              to="?tab=seo-keywords"
              className="flex items-center justify-center p-3 rounded-md border border-gray-400 hover:shadow-md transition-shadow "
            >
              <FiSearch className="mr-2 text-green-500" />
              <span className="font-medium">Find Keywords</span>
            </Link>
            <Link
              to="?tab=saved-ads"
              className="flex items-center justify-center p-3 rounded-md border border-gray-400 hover:shadow-md transition-shadow"
            >
              <FiGrid className="mr-2 text-amber-500" />
              <span className="font-medium">View Saved Ads</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-lg font-semibold  mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="?tab=dash-admin-users"
              className="flex items-center justify-center p-3  rounded-md border border-gray-400 hover:shadow-md transition-shadow "
            >
              <FiUserPlus className="mr-2 text-blue-500" />
              <span className="font-medium ">Manage Users</span>
            </Link>
            <Link
              to="?tab=dash-admin-subscriptions"
              className="flex items-center justify-center p- rounded-md border border-gray-400 hover:shadow-md transition-shadow"
            >
              <FiCreditCard className="mr-2 text-purple-500" />
              <span className="font-medium ">Manage Subscription Plan</span>
            </Link>
            <Link
              to="?tab=dash-admin-complaints"
              className="flex items-center justify-center p-3 rounded-md border border-gray-400 hover:shadow-md transition-shadow "
            >
              <FiAlertCircle className="mr-2 text-green-500" />
              <span className="font-medium">Manage Complaints</span>
            </Link>
          </div>
        </div>
      )}

      {/* What You Can Do */}
      {!currentUser.isAdmin && (
        <div>
          <h2 className="text-lg font-semibold  mb-4">
            What You Can Do with Ishtehaar
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div className=" rounded-lg border border-gray-400 overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex">
                  <div
                    className={`${feature.color} p-6 flex items-center justify-center text-white`}
                  >
                    {feature.icon}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium  mb-1">{feature.title}</h3>
                    <p className="text-gray-500 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Getting Started Section */}
      {!currentUser.isAdmin && (
        <div className="mt-8   p-5 rounded-lg border border-gray-400">
          <div className="flex items-start">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <FiTrendingUp className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-semibold  mb-2">
                Ready to boost your marketing?
              </h3>
              <p className="text-gray-500 mb-4">
                Start with creating your first ad, researching keywords for your
                industry, or analyzing your website's performance.
              </p>
              <Link
                to="?tab=image-ad"
                className="text-purple-600 font-medium hover:text-blue-800 transition-colors"
              >
                Create your first ad →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
