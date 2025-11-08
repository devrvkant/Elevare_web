import { useState } from "react";
import { Outlet } from "react-router";
import { UserButton, useUser } from "@clerk/clerk-react";
import Sidebar from "../components/dashboard/Sidebar/Sidebar";
import MobileHeader from "../components/dashboard/MobileHeader";

const DashboardLayout = () => {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <MobileHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Desktop Header */}
        <header className="hidden lg:block sticky top-0 z-20 bg-white border-b border-gray-200">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Welcome back, {user?.firstName || "User"}! 👋
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Let's build something amazing today
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <span className="text-2xl">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
