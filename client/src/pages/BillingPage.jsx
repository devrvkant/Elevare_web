const BillingPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Billing</h1>
        <p className="text-gray-600 mb-6">
          Manage your subscription and payment methods.
        </p>
        
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="text-center">
            <div className="text-5xl mb-4">💳</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Coming Soon!</h2>
            <p className="text-gray-600">
              Billing and subscription management will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
