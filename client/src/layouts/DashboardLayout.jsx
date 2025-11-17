import { useState } from "react";
import { Outlet, useLocation } from "react-router";
import { UserButton, useUser } from "@clerk/clerk-react";
import Sidebar from "../components/dashboard/Sidebar/Sidebar";
import MobileHeader from "../components/dashboard/MobileHeader";

const DashboardLayout = () => {
  const { user } = useUser();
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
                  Welcome {user?.firstName || "User"}!
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Let's build something amazing today
                </p>
              </div>
              <div className="flex items-center">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-15 h-15",
                    },
                  }}
                />
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
