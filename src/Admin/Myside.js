import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";

import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "../Components/sidebar";

import {
  Dropdown,
  DropdownButton,
  DropdownDivider,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from "../Components/dropdown";

import Logo from "../Images/Logo.png";

import {
  ArrowRightStartOnRectangleIcon,
  ChevronUpIcon,
  Cog8ToothIcon,
  UserIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  ShoppingCartIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

// ✅ Import Instagram icon from react-icons
import { FaInstagram } from "react-icons/fa";

/* ================= MENU ================= */
const menuItems = [
  { path: "/admin/dashboard", label: "Admin Dashboard", icon: BuildingStorefrontIcon },
  { path: "/admin/add-products", label: "Add Product", icon: ShoppingCartIcon },
  { path: "/admin/add-sliders", label: "Add Slider", icon: RectangleStackIcon },
  { path: "/admin/add-blogs", label: "Add Blogs", icon: DocumentTextIcon },
  { path: "/admin/add-insta", label: "Add Insta Video", icon: FaInstagram },
  { path: "/admin/contacts", label: "Contacts", icon: UsersIcon },
  { path: "/admin/admin-users", label: "Admin", icon: UsersIcon },
  { path: "/admin/users", label: "Users", icon: UsersIcon },
   { path: "/admin/add-photos", label: "Add Event Photos", icon: PhotoIcon },
   { path: "/admin/unused_photos", label: "Unused Photos", icon: PhotoIcon },
];

/* ================= COMPONENT ================= */
const Myside = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login", { replace: true });
  };

  return (
    <Sidebar className="bg-white dark:bg-zinc-900 shadow-xl rounded-xl overflow-hidden flex flex-col">

      {/* HEADER */}
      <SidebarHeader className="border-b border-gray-200 dark:border-zinc-700 p-4">
        <Link to="/"><div className="flex items-center gap-3">

          <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />
          <SidebarLabel className="font-semibold text-zinc-900 dark:text-white">
            Kumaon Organics
          </SidebarLabel>

        </div>
        </Link>
      </SidebarHeader>

      {/* BODY */}
      <SidebarBody className="flex-1 p-3 overflow-y-auto">
        <SidebarSection className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);

            return (
              <SidebarItem key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 p-2 rounded-lg transition ${isActive
                    ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 font-semibold"
                    : "hover:bg-gray-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white"
                    }`}
                >
                  {/* Render react-icons correctly */}
                  {React.createElement(item.icon, { className: "w-5 h-5" })}
                  <SidebarLabel>{item.label}</SidebarLabel>
                </Link>
              </SidebarItem>
            );
          })}
        </SidebarSection>

        <SidebarSpacer />
      </SidebarBody>

      {/* FOOTER */}
      <SidebarFooter className="border-t border-gray-200 dark:border-zinc-700 p-4">
        <Dropdown>
          <DropdownButton
            as={SidebarItem}
            className="flex items-center gap-2 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition p-2"
          >
            <img src={Logo} alt="logo" className="w-10 h-10 object-contain" />

            <div className="flex flex-col min-w-0">
              <span className="truncate font-medium text-zinc-900 dark:text-white">
                {user?.name || "Admin"}
              </span>
              <span className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                {user?.email || "admin@example.com"}
              </span>
            </div>

            <ChevronUpIcon className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
          </DropdownButton>

          <DropdownMenu className="min-w-64 rounded-xl shadow-lg bg-white dark:bg-zinc-900 p-2">
            <DropdownItem href="/my-profile">
              <UserIcon className="w-5 h-5" />
              <DropdownLabel>My Profile</DropdownLabel>
            </DropdownItem>

            <DropdownItem href="/settings">
              <Cog8ToothIcon className="w-5 h-5" />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>

            <DropdownDivider />

            <DropdownItem as="button" onClick={handleLogout}>
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              <DropdownLabel>Sign Out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  );
};

export default Myside;