import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserInitials, getUserColor } from "../lib/userUtils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

const ProfilePage = () => {
  const { currentUser, updateUserProfile, logout } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Get user initials and color for avatar
  const userInitials = getUserInitials(currentUser);
  const avatarColor = getUserColor(currentUser);

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
      <div className="bg-card shadow-sm border border-border rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Profile Settings</h2>

        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold ${avatarColor}`}>
            {userInitials}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {currentUser?.displayName || "User"}
            </h3>
            <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
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
              className="mt-1 bg-muted text-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.includes('success') ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-destructive/10 text-destructive'}`}>
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {loading ? "Updating..." : "Update Profile"}
          </Button>
        </form>

        {/* Danger Zone */}
        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Danger Zone</h3>
          <Button
            onClick={() => logout().then(() => window.location.href = '/')}
            variant="outline"
            className="text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
