import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserInitials, getUserColor } from "../../lib/userUtils";
import { LogOut, User, Mail } from "lucide-react";

const UserPopover = () => {
  const { currentUser, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);

  // Get user initials and color for avatar
  const userInitials = getUserInitials(currentUser);
  const avatarColor = getUserColor(currentUser);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="relative" ref={popoverRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full transition-all hover:opacity-80 cursor-pointer"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${avatarColor}`}>
          {userInitials}
        </div>
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-popover rounded-lg shadow-lg border border-border py-3 px-4 z-50">
          {/* User Info */}
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${avatarColor}`}>
              {userInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-popover-foreground truncate">
                {currentUser?.displayName || "User"}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2 space-y-1">
            <button
              onClick={() => {
                setIsOpen(false);
                window.location.href = '/dashboard/profile';
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-md transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>View Profile</span>
            </button>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPopover;
