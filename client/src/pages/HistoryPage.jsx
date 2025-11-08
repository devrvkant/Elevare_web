const HistoryPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My History</h1>
        <p className="text-gray-600 mb-6">
          View all your previous activities and work history.
        </p>
        
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
          <div className="text-center">
            <div className="text-5xl mb-4">📜</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon!</h2>
            <p className="text-gray-600">
              Your complete work history will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;
