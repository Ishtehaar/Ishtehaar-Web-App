import React, { useEffect, useState } from "react";
import { Sidebar, SidebarItem } from "flowbite-react";
import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSidebar() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser.isAdmin);

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
      const res = await fetch("/api/user/signout", {
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
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Manage Users
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Manage Subscriptions
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Manage Complaints
              </Sidebar.Item>
            </>
          ) : (
            <>
              <Link to="/dashboard?tab=image-ad">
                <Sidebar.Item
                  icon={HiArrowSmRight}
                  className="cursor-pointer"
                  active={tab === "image-ad"}
                  as="div"
                >
                  Image Ad
                </Sidebar.Item>
              </Link>

              <Sidebar.Item
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Video Ad
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Drafts
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                History
              </Sidebar.Item>
              <Sidebar.Item
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Sign Out
              </Sidebar.Item>
            </>
          )}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
