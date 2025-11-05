import UserProfileCard from "../components/UserProfile/UserProfileCard";
import PageMeta from "../components/common/PageMeta";

export default function UserProfiles() {
  return (
    <>
      <PageMeta
        title="User Profile | spearwin-admin"
        description="User Profile"
      />

      {/* Title Bar */}
      <div className="px-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-2">
          <h1 className="text-lg font-semibold text-gray-900">Profile</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-2">
        <div className="bg-white rounded-[10px] border border-gray-200 p-5 lg:p-6">
          <UserProfileCard />
        </div>
      </div>
    </>
  );
}
