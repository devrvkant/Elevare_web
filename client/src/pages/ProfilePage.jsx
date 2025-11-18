import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const ProfilePage = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setMessage("");
      await updateUserProfile({ displayName });
      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-8 space-y-6 max-w-2xl mx-auto">
      <div className="bg-white shadow-sm border border-gray-200 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Profile Settings</h2>
        
        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <img
            src={currentUser?.photoURL || `https://ui-avatars.com/api/?name=${currentUser?.displayName || currentUser?.email}&background=6366f1&color=fff&size=128`}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentUser?.displayName || "User"}
            </h3>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your display name"
              className="mt-1"
              disabled={loading}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={currentUser?.email}
              disabled
              className="mt-1 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>

        {/* Danger Zone */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Danger Zone</h3>
          <Button
            onClick={() => logout().then(() => window.location.href = '/')}
            variant="outline"
            className="text-red-600 border-red-300 hover:bg-red-50"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
