import { Sparkles } from "lucide-react";
import UserPopover from "./UserPopover";

const MobileHeader = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden sticky top-0 z-30 bg-card border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors cursor-pointer"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-foreground"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <Sparkles className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <h1 className="text-lg font-bold text-primary">
            ELEVARE
          </h1>
        </div>

        <UserPopover />
      </div>
    </header>
  );
};

export default MobileHeader;
