const AIToolCard = ({ tool, onClick }) => {
  const iconBgColors = {
    chat: 'bg-gradient-to-br from-cyan-400 to-blue-500',
    resume: 'bg-gradient-to-br from-orange-400 to-pink-500',
    roadmap: 'bg-gradient-to-br from-indigo-400 to-purple-500',
    cover: 'bg-gradient-to-br from-yellow-400 to-orange-500',
  };

  return (
    <div className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Icon */}
      <div className={`w-14 h-14 ${iconBgColors[tool.type] || 'bg-gradient-to-br from-purple-400 to-pink-500'} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        <span className="text-2xl">{tool.icon}</span>
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2">{tool.description}</p>

      {/* Action Button */}
      <button
        onClick={() => onClick(tool)}
        className="w-full bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-gradient-to-r hover:from-pink-500 hover:via-purple-500 hover:to-violet-600 transition-all duration-300 text-sm"
      >
        {tool.buttonText}
      </button>
    </div>
  );
};

export default AIToolCard;
