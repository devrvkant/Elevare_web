import { useNavigate, useLocation } from "react-router";
import { LayoutDashboard, Map, User, X, Sparkles } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "workspace",
      label: "Workspace",
      icon: LayoutDashboard,
      path: "/dashboard",
      description: "Build Awesome Skills",
    },
    {
      id: "roadmaps",
      label: "Roadmaps",
      icon: Map,
      path: "/dashboard/roadmaps",
      description: "Your Career Paths",
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/dashboard/profile",
    },
  ];

  const isActive = (path) => {
    // For roadmaps, check if current path starts with /dashboard/roadmaps
    if (path === "/dashboard/roadmaps") {
      return location.pathname.startsWith("/dashboard/roadmaps");
    }
    return location.pathname === path;
  };

  return (
    <>
      {/* Mobile overlay with blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen
          bg-white border-r border-gray-200
          transition-transform duration-300 ease-in-out
          z-50 lg:z-0
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          w-64 flex flex-col
        `}
      >
        {/* Logo Section with Close Button */}
        <div className="p-6 border-b border-gray-200 relative">
          {/* Close Button - Only visible on mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Sparkles className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                ELEVARE
              </h1>
              <p className="text-xs text-gray-500 font-medium">COACH AGENT</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3 italic">
            Build Awesome Skills
          </p>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl
                    transition-all duration-200
                    ${
                      isActive(item.path)
                        ? "bg-gradient-to-r from-pink-50 to-purple-50 text-purple-700 border border-purple-200 shadow-sm"
                        : "text-gray-700 hover:bg-gray-50 border border-transparent"
                    }
                  `}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${
                        isActive(item.path)
                          ? "text-purple-600"
                          : "text-gray-600"
                      }`}
                      strokeWidth={2}
                    />
                    <div className="flex-1 text-left">
                      <span className="font-medium text-sm">{item.label}</span>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100 text-center">
            <p className="text-sm font-medium bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-1">
              Made with ❤️
            </p>
            <p className="text-xs text-gray-600">
              by <span className="font-semibold text-purple-700">Ravikant</span>{" "}
              & <span className="font-semibold text-purple-700">Divyam</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
