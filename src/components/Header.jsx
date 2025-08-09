import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import toDoLogo from "../assets/images/todoLogo.jpg";
import { CgProfile } from "react-icons/cg";
import Profile from "../pages/Profile/Profile";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [Profile, setProfile] = useState(false);
  const handleLogout = () => {
    supabase.auth.signOut();
  };
  return (
    <header className="px-4 py-1 bg-gray-300 shadow-md">
      <div className="flex flex-wrap items-center justify-between mx-auto ">
        <Link
          to={"/"}
          className="text-lg font-bold text-blue-900 hover:text-blue-700"
          style={{ textDecoration: "none", color: "darkblue" }}
        >
          <div className="flex items-center gap-3">
            <img
              src={toDoLogo}
              alt="TaskStream Logo"
              width="45"
              height="45"
              className="rounded-full"
            />
            <h2 className="text-xl font-bold text-yellow-700">TaskStream</h2>
          </div>{" "}
        </Link>
        {/* Hamburger Button (Mobile Only) */}
        <button className="block md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        {/* Navigation */}
        <nav
          className={`w-full md:w-auto ${
            isOpen ? "block" : "hidden"
          } md:block mt-4 md:mt-0`}
        >
          <ul className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <li>
              <Link
                to="/dashboard"
                className="text-lg font-bold text-blue-900 hover:text-blue-700"
                style={{ textDecoration: "none", color: "darkblue" }}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-lg font-bold text-blue-900 hover:text-blue-700"
                style={{ textDecoration: "none", color: "darkblue" }}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/todos"
                className="text-lg font-bold text-blue-900 hover:text-blue-700"
                style={{ textDecoration: "none", color: "darkblue" }}
              >
                My Tasks
              </Link>
            </li>
          </ul>
        </nav>
        <div
          className="text-[#00008b] cursor-pointer relative"
          onClick={() => setProfile(!Profile)}
        >
          <CgProfile size={24} />
          {Profile && (
            <div className=" absolute flex flex-col w-full bg-white min-w-32 right-0 px-2 py-4 rounded-xl items-start justify-center">
              <Link
                to="/profile"
                className="text-lg font-bold text-blue-900 hover:text-blue-700"
                style={{ textDecoration: "none", color: "darkblue" }}
              >
                My Profile
              </Link>
              <button
                className="text-lg font-bold text-blue-900 hover:text-blue-700"
                style={{ textDecoration: "none", color: "darkblue" }}
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
