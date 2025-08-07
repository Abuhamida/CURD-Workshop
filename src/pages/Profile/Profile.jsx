import { useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState({
    name: "Mohamed Abuhamida",
    email: "mohamed@email.com",
    phone: "01001234567",
    country: "Egypt"
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your save logic here (e.g., Supabase update)
    alert("Changes saved successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex gap-6">
      {/* Sidebar */}
      <aside className="w-full max-w-xs bg-white rounded-2xl shadow p-6">
        <div className="flex flex-col items-center">
          <img
            src="https://via.placeholder.com/100"
            alt="Profile"
            className="rounded-full w-24 h-24 object-cover mb-4"
          />
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <nav className="mt-6 space-y-2 text-sm">
          <a href="#" className="block hover:text-green-600">My Profile</a>
          <a href="#" className="block hover:text-green-600">Settings</a>
          <a href="#" className="block hover:text-green-600">Logout</a>
        </nav>
      </aside>

      {/* Profile Form */}
      <main className="flex-1">
        <div className="bg-white p-6 rounded-2xl shadow">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="font-medium">Name</label>
              <input
                name="name"
                value={user.name}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="font-medium">Email</label>
              <input
                name="email"
                value={user.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="phone" className="font-medium">Phone</label>
              <input
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="country" className="font-medium">Country</label>
              <input
                name="country"
                value={user.country}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-xl"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
