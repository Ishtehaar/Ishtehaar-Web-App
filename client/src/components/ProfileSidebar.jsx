import React, { useEffect, useState } from "react";
import { Sidebar, SidebarItem } from "flowbite-react";
import {
  HiUser,
} from "react-icons/hi";
import { CiLogout } from "react-icons/ci";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function ProfileSidebar() {
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
          {currentUser && (
            <>
              <Link to="/profile-page">
                <Sidebar.Item
                  active={tab === "profile"}
                  icon={HiUser}
                  label={currentUser.isAdmin ? "Admin" : "User"}
                  labelColor="dark"
                  as="div"
                >
                  Profile
                </Sidebar.Item>
              </Link>
              <Sidebar.Item
                icon={CiLogout}
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
