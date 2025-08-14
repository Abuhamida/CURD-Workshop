import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import toDoLogo from "../assets/images/todoLogo.jpg";
import { CgProfile } from "react-icons/cg";
import { supabase } from "../lib/supabase";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [session, setSession] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowProfileMenu(false);
  };

  return (
    <header className="px-4 py-2 bg-gray-300 shadow-md">
      <div className="flex flex-wrap items-center justify-between mx-auto w-full">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 text-lg font-bold"
          style={{ textDecoration: "none", color: "darkblue" }}
        >
          <img
            src={toDoLogo}
            alt="TaskStream Logo"
            width="45"
            height="45"
            className="rounded-full"
          />
          <h2 className="text-xl font-bold text-yellow-700">TaskStream</h2>
        </Link>

        {/* Mobile Hamburger */}
        <button
          className="block md:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Nav Links */}
        <nav
          className={`w-full md:w-auto ${
            isOpen ? "block" : "hidden"
          } md:block mt-4 md:mt-0`}
        >
          <ul className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <li>
              <Link
                to="/dashboard"
                className="text-lg font-bold hover:text-blue-700"
                style={{ color: "darkblue", textDecoration: "none" }}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/"
                className="text-lg font-bold hover:text-blue-700"
                style={{ color: "darkblue", textDecoration: "none" }}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/todos"
                className="text-lg font-bold hover:text-blue-700"
                style={{ color: "darkblue", textDecoration: "none" }}
              >
                My Tasks
              </Link>
            </li>
          </ul>
        </nav>

        {/* Right Section: Profile or Login */}
        <div className="relative">
          {session ? (
            <div
              className="text-[#00008b] cursor-pointer"
              onClick={() => setShowProfileMenu((prev) => !prev)}
            >
              <CgProfile size={28} />
              {showProfileMenu && (
                <div className="absolute flex flex-col w-full bg-white min-w-32 right-0 px-4 py-4 rounded-xl shadow-lg items-start">
                  <Link
                    to="/profile"
                    className="text-lg font-bold hover:text-blue-700 text-nowrap"
                    style={{ color: "darkblue", textDecoration: "none" }}
                    onClick={() => setShowProfileMenu(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    className="text-lg font-bold hover:text-blue-700 mt-2"
                    style={{ color: "darkblue" }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-900 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              style={{ textDecoration: "none" }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
