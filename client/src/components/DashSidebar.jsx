import React, { useEffect, useState } from "react";
import { Sidebar, SidebarItem } from "flowbite-react";
import { FaUsersCog } from "react-icons/fa";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdOutlineFeedback } from "react-icons/md";
import { CiImageOn, CiSaveDown2, CiLogout } from "react-icons/ci";
import { MdHistory } from "react-icons/md";
import { CiSearch } from "react-icons/ci";

import { LuEarth } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const dispatch = useDispatch();
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

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin ? (
            <>
              <Sidebar.Item
                icon={FaUsersCog}
                className="cursor-pointer"
                active={tab === "image-ad"}
                as="div"
              >
                User Management
              </Sidebar.Item>
              <Sidebar.Item
                icon={IoPricetagsOutline}
                className="cursor-pointer"
                active={tab === "image-ad"}
                as="div"
              >
                Subscription Control
              </Sidebar.Item>
              <Sidebar.Item
                icon={MdOutlineFeedback}
                className="cursor-pointer"
                active={tab === "image-ad"}
                as="div"
              >
                Complaint Resolution
              </Sidebar.Item>
            </>
          ) : (
            <>
              <Link to="/dashboard?tab=image-ad">
                <Sidebar.Item
                  icon={CiImageOn}
                  className="cursor-pointer"
                  active={tab === "image-ad"}
                  as="div"
                >
                  Visual Ad Creation
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=seo-keywords">
                <Sidebar.Item
                  icon={CiSearch}
                  className="cursor-pointer"
                  active={tab === "seo-keywords"}
                  as="div"
                >
                  SEO Assistant
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=website-audit">
                <Sidebar.Item
                  icon={LuEarth}
                  className="cursor-pointer"
                  active={tab === "website-audit"}
                  as="div"
                >
                  Website Audit
                </Sidebar.Item>
              </Link>
              <Link to="/dashboard?tab=saved-ads">
                <Sidebar.Item
                  icon={CiSaveDown2}
                  className="cursor-pointer"
                  active={tab === "saved-ads"}
                  as="div"
                >
                  Saved Ads
                </Sidebar.Item>
              </Link>

              <Sidebar.Item
                icon={MdHistory}
                className="cursor-pointer"
                active={tab === "history"}
                as="div"
              >
                History
              </Sidebar.Item>
              <Sidebar.Item
                icon={CiLogout}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Log Out
              </Sidebar.Item>
            </>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
