import { NavLink, Outlet } from "react-router-dom";
import Logo from "../../../assets/LearnLab-Main-LOGO.svg";
import { Button } from "@/components/ui/button";
import { CiMenuBurger, CiMinimize1 } from "react-icons/ci";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoIosNotificationsOutline } from "react-icons/io";
import {  LuHeart } from "react-icons/lu";
import { useAppSelector } from "@/app/hooks";

const Navbar = () => {
  const Links = [
    { path: "/home", name: "Home" },
    { path: "/courses", name: "Courses" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact us" },
  ];

  const IconsLinks = [
    { name: "Notifications", path: "/profile/notifications", icon: <IoIosNotificationsOutline /> },
    { name: "Wishlist", path: "/wishlist", icon: <LuHeart /> },
    
  ];

  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  return (
    <div>
      {/* Navbar Container */}
      <div className="shadow-md w-full fixed top-0 left-0 z-50 bg-white">
        <div className="md:flex items-center justify-between px-6 md:px-10 py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-auto w-32" />
          </div>

          {/* Mobile Menu Toggle */}
          <div
            onClick={() => setOpen(!open)}
            className="text-2xl cursor-pointer md:hidden"
          >
            {open ? <CiMinimize1 /> : <CiMenuBurger />}
          </div>

          {/* Desktop and Mobile Links */}
          <ul
            className={`md:flex md:items-center gap-6 md:gap-8 text-sm font-medium 
              md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 
              w-full md:w-auto transition-all duration-300 ease-in-out 
              ${open ? "top-[70px]" : "top-[-500px]"}`}
          >
            {/* Navigation Links */}
            {Links.map((item) => (
              <li key={item.name} className="relative group">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block py-2 px-3 rounded-md ${
                      isActive
                        ? "text-blue-600 bg-gray-100"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            {/* Icon Links */}
            {IconsLinks.map((item) => (
              <li key={item.name} className="relative group">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block p-2 rounded-full text-xl ${
                      isActive
                        ? "text-blue-600 bg-gray-100"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.icon}
                </NavLink>
              </li>
            ))}

            {/* Profile or Login */}
            {isAuthenticated ? (
              <li className="relative group">
                <NavLink to="/profile" className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar || ""} />
                    <AvatarFallback>
                      <img
                        src="https://avatar.iran.liara.run/public/9"
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:block">Profile</span>
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink to="/login">
                  <Button className="rounded-full text-xs bg-blue-600 hover:bg-blue-400 transition-colors duration-300">
                    Login
                  </Button>
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-[70px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Navbar;