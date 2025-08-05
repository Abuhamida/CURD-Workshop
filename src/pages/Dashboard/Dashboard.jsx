import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../store/reducers/authSlice";

export default function Dashboard() {
  const [user, setUser] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

 useEffect(() => {
  const fetchUser = async () => {
    const { data: authData, error } = await supabase.auth.getUser();
    if (!authData?.user || error) {
      navigate("/");
    } else {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (userError) {
        console.error("Error fetching user:", userError.message);
        navigate("/");
      } else {
        setUser(userData);
      }
    }
  };

  fetchUser();
}, [navigate]);

  const handleLogout = async () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-green-600">
          Welcome, {user?.username || "Guest" }
        </h2>
        <button
          onClick={handleLogout}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
