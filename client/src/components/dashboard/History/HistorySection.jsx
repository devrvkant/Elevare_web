const HistoryItem = ({ item }) => {
  const iconMap = {
    resume: "📄",
    roadmap: "🗺️",
    chat: "💬",
    cover: "📝",
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all duration-200 cursor-pointer group">
      <div className="flex items-center space-x-4 flex-1">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center border border-purple-200 group-hover:scale-110 transition-transform duration-200">
          <span className="text-2xl">{iconMap[item.type] || "📋"}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs text-gray-500">{formatDate(item.date)}</p>
      </div>
    </div>
  );
};

const HistorySection = () => {
  const historyItems = [
    {
      id: 1,
      type: "resume",
      title: "AI Resume Analyzer",
      description: "Resume analysis completed",
      date: "2025-06-01T12:07:32-04:00",
    },
    {
      id: 2,
      type: "roadmap",
      title: "Career Roadmap Generator",
      description: "Generated career roadmap",
      date: "2025-06-01T11:54:49-04:00",
    },
  ];

  return (
    <section className="mt-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Previous History
        </h2>
        <p className="text-gray-600">
          What Your previously work on, You can find here
        </p>
      </div>

      <div className="space-y-3">
        {historyItems.map((item) => (
          <HistoryItem key={item.id} item={item} />
        ))}
      </div>

      {historyItems.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-gray-500">
            No history yet. Start using AI tools to build your history!
          </p>
        </div>
      )}
    </section>
  );
};

export default HistorySection;
