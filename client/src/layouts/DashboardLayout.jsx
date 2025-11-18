import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/dashboard/Sidebar/Sidebar";
import MobileHeader from "../components/dashboard/MobileHeader";

const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if we're on a roadmap detail page (not the list page)
  const isRoadmapDetailPage =
    location.pathname.startsWith("/dashboard/roadmaps/") &&
    location.pathname !== "/dashboard/roadmaps";

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Desktop Header - Hide on roadmap detail page */}
        {!isRoadmapDetailPage && (
          <header className="hidden lg:block bg-white border-b border-gray-200 flex-shrink-0">
            <div className="px-8 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Welcome {currentUser?.displayName || currentUser?.email?.split('@')[0] || "User"}!
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Let's build something amazing today
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => logout().then(() => window.location.href = '/')}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <img 
                    src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName || 'User'}&background=6366f1&color=fff`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {isRoadmapDetailPage ? (
            // Full-width layout for roadmap detail page
            <Outlet />
          ) : (
            // Padded container for other pages
            <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
              <Outlet />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
