import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import PublicRoute from "./components/PublicRoute";
import ForgotPassword from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashImageAd from "./components/DashImageAd";
import DashSidebar from "./components/DashSidebar";
import ProfileComp from "./components/ProfileComp";
import DashSaveAd from "./components/DashSaveAd";
import AdvertismentPage from "./pages/AdvertismentPage";
import UpdateAdvertisment from "./pages/UpdateAdvertisment";
import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About";
import DashSEOKeywords from "./components/DashSEOKeywords";
import WebsiteAudit from "./components/WebsiteAudit";
import DashUsers from "./components/DashAdminUsers";
import SocialMedia  from "./components/SocialMedia";
import DashAdminSubscriptions from "./components/DashAdminSubscriptions";
import DashAdminComplaints from "./components/DashAdminComplaints";

export default function App() {
  return (
    <>
      <BrowserRouter>
      <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          

          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/image-ad" element={<DashImageAd />} />
            <Route path="/seo-keywords" element={<DashSEOKeywords />} />
            <Route path="/website-audit" element={<WebsiteAudit />} />
            <Route path="/social-media" element={<SocialMedia/>} />

            <Route path="/dash-admin-users" element={<DashUsers />} />
            <Route path="/dash-admin-subscriptions" element={<DashAdminSubscriptions />} />
            <Route path="/dash-admin-complaints" element={<DashAdminComplaints />} />
            <Route path="/saved-ads" element={<DashSaveAd />} />
            <Route path="/dash-sidebar" element={<DashSidebar />} />
            <Route path="/profile-comp" element={<ProfileComp />} />
            <Route path="/profile-page" element={<ProfilePage />} />
            <Route path="/ad/:adSlug" element={<AdvertismentPage />} />
            <Route path="/update-ad/:adId" element={<UpdateAdvertisment />} />
          </Route>

          <Route element={<PublicRoute />}>
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/verify-email" element={<EmailVerificationPage />} />;
            <Route path="/forgot-password" element={<ForgotPassword/>} />;
            <Route path="/reset-password/:token" element={<ResetPasswordPage/>} />;
          </Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}
