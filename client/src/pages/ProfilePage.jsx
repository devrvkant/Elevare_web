import { UserProfile } from "@clerk/clerk-react";

const ProfilePage = () => {
  return (
    <div className="pt-8 space-y-6">
      <UserProfile
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-sm border border-gray-200 rounded-2xl",
          },
        }}
      />
    </div>
  );
};

export default ProfilePage;
