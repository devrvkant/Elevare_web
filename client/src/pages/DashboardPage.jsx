import HeroSection from "../components/dashboard/Hero/HeroSection";
import AIToolsSection from "../components/dashboard/AITools/AIToolsSection";
import HistorySection from "../components/dashboard/History/HistorySection";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <HeroSection />

      {/* AI Tools Section */}
      <AIToolsSection />

      {/* History Section */}
      <HistorySection />
    </div>
  );
};

export default Dashboard;
