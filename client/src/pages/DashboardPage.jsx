import { useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { user } = useUser();

  const stats = [
    {
      label: "Career Matches",
      value: "12",
      color: "from-blue-500 to-indigo-500",
    },
    {
      label: "Skills Assessed",
      value: "28",
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Learning Progress",
      value: "67%",
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Goals Completed",
      value: "5",
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentActivities = [
    {
      action: "Completed React Assessment",
      time: "2 hours ago",
      type: "skill",
    },
    {
      action: "New Career Match: Frontend Developer",
      time: "1 day ago",
      type: "match",
    },
    {
      action: "Started JavaScript Learning Path",
      time: "3 days ago",
      type: "learning",
    },
    {
      action: "Updated Profile Information",
      time: "1 week ago",
      type: "profile",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.firstName || "User"}! 👋
        </h1>
        <p className="text-indigo-100 text-lg">
          Ready to continue your career journey? Let's see what's new for you
          today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div
              className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} mb-4`}
            >
              <span className="text-white text-xl font-bold">{index + 1}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </h3>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-gray-50 rounded-lg"
              >
                <div
                  className={`w-3 h-3 rounded-full mr-4 ${
                    activity.type === "skill"
                      ? "bg-blue-500"
                      : activity.type === "match"
                      ? "bg-green-500"
                      : activity.type === "learning"
                      ? "bg-purple-500"
                      : "bg-orange-500"
                  }`}
                ></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <button className="w-full text-left p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 hover:border-indigo-300 transition-all group">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-indigo-600">
                    Take Skills Assessment
                  </p>
                  <p className="text-sm text-gray-600">
                    Discover new opportunities
                  </p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 hover:border-green-300 transition-all group">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📚</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-green-600">
                    Continue Learning
                  </p>
                  <p className="text-sm text-gray-600">Resume your courses</p>
                </div>
              </div>
            </button>

            <button className="w-full text-left p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-all group">
              <div className="flex items-center">
                <span className="text-2xl mr-3">🚀</span>
                <div>
                  <p className="font-semibold text-gray-900 group-hover:text-purple-600">
                    Explore Careers
                  </p>
                  <p className="text-sm text-gray-600">Find new matches</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Coming Soon Section */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          More Features Coming Soon!
        </h2>
        <p className="text-gray-600 mb-6">
          We're working hard to bring you advanced AI career recommendations,
          personalized learning paths, and much more.
        </p>
        <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full">
          <span className="mr-2">🔧</span>
          Under Development
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
