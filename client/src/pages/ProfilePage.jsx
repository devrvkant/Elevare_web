import { useUser } from "@clerk/clerk-react";

const ProfilePage = () => {
  const { user } = useUser();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
        <p className="text-gray-600 mb-6">
          Manage your account settings and preferences.
        </p>

        {/* Current User Info */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {user?.firstName?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-200">
          <div className="text-center">
            <div className="text-5xl mb-4">⚙️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Profile Settings Coming Soon!</h2>
            <p className="text-gray-600">
              Advanced profile customization and settings will be available here soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
