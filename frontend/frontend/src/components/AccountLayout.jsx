import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";

export default function AccountLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Controls mobile sidebar open/close visibility states
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/user/dashboard",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
    },
    {
      name: "My Orders",
      path: "/user/my-orders",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>,
    },
    {
      name: "Profile Details",
      path: "/user/profile",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    },
    {
      name: "Change Password",
      path: "/user/change-password",
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col md:flex-row">
      
      {/* --- MOBILE TOP HEADER ACTION BAR --- */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-30">
        <span className="font-bold text-gray-900">Account Control Panel</span>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none cursor-pointer"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* --- BACKDROP FOR MOBILE EXPANSION OVERLAY --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-40 md:hidden backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- CLASSIC MAIN SIDEBAR INTERFACE --- */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 z-50 w-64 bg-white border-r border-gray-200 p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out min-h-screen`}
      >
        <div>
          {/* Sidebar Top Title */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-black text-gray-900">Shree Kitchen</h2>
              <p className="text-xs text-gray-400 font-medium">User Dashboard Panel</p>
            </div>
            {/* Close Toggle for Mobile Navigation Screens */}
            <button className="md:hidden p-1 text-gray-400 hover:text-gray-900 cursor-pointer" onClick={() => setIsOpen(false)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Navigation Route Menu Block */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)} // Closes mobile sidebar automatically on selection click
                  className={`flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl transition duration-150 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <span className={isActive ? "text-indigo-600" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Panel Actions Block (Logout) */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-50 hover:text-red-700 transition duration-150 cursor-pointer"
          >
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* --- RIGHT HAND CONTENT CONTAINER FRAME --- */}
      <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-7xl">
        <div className="bg-white border border-gray-200/80 rounded-2xl shadow-xs p-6 md:p-8 min-h-[500px]">
          <Outlet />
        </div>
      </main>

    </div>
  );
}