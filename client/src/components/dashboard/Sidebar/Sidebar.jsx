import { useNavigate, useLocation } from "react-router";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "workspace",
      label: "Workspace",
      icon: "📚",
      path: "/dashboard",
      description: "Build Awesome Skills",
    },
    {
      id: "ai-tools",
      label: "AI Tools",
      icon: "🤖",
      path: "/dashboard/ai-tools",
    },
    {
      id: "history",
      label: "My History",
      icon: "📝",
      path: "/dashboard/history",
    },
    {
      id: "billing",
      label: "Billing",
      icon: "💳",
      path: "/dashboard/billing",
    },
    {
      id: "profile",
      label: "Profile",
      icon: "👤",
      path: "/dashboard/profile",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              🤖
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-violet-600 bg-clip-text text-transparent">
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
            {menuItems.map((item) => (
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
                  <span className="text-2xl">{item.icon}</span>
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
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-xs text-gray-600 mb-2">Need help?</p>
            <button className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 text-white text-xs font-semibold py-2 px-4 rounded-lg hover:shadow-lg transition-all">
              Get Support
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
