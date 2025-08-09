import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

export default function Profile() {
  const [user, setUser] = useState({
    id: "",
    username: "",
    full_name: "",
    address: "",
    phone: "",
    email: "",
    created_at: "",
    updated_at: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();
        
        if (error) throw error;
        
        setUser({
          ...data,
          email: authUser.email
        });
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({
          full_name: user.full_name,
          address: user.address,
          phone: user.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (loading && !user.id) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Account Settings
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar - Sticky on larger screens */}
          <aside className="lg:sticky lg:top-8 lg:h-fit w-full lg:w-80 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${user.full_name}&background=random`}
                  alt="Profile"
                  className="rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-white shadow"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-green-600 hover:bg-green-700 text-white p-2 rounded-full shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </button>
                )}
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.full_name || "Anonymous User"}
              </h2>
              <p className="text-sm text-gray-500 mb-4">@{user.username}</p>
              <p className="text-sm text-gray-500 mb-4">{user.email}</p>
              <p className="text-gray-600 text-sm mb-6">{user.address}</p>
            </div>

            <nav className="space-y-3">
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg bg-green-50 text-green-700 font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                My Profile
              </a>
              <a
                href="#"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Settings
              </a>
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/login";
                }}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-gray-800">
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Profile
                  </button>
                ) : null}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-1">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Username
                    </label>
                    <p className="px-4 py-2 text-gray-800">@{user.username}</p>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </label>
                    <p className="px-4 py-2 text-gray-800">{user.email}</p>
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="full_name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="full_name"
                        value={user.full_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <p className="px-4 py-2 text-gray-800">{user.full_name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={user.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <p className="px-4 py-2 text-gray-800">{user.phone}</p>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-1">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Address
                    </label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={user.address}
                        onChange={handleChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    ) : (
                      <p className="px-4 py-2 text-gray-800">{user.address}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Member Since
                    </label>
                    <p className="px-4 py-2 text-gray-800">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Updated
                    </label>
                    <p className="px-4 py-2 text-gray-800">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium text-white disabled:opacity-50"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                )}
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}