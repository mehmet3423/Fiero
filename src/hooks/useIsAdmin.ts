import { useAuth } from "./context/useAuth";

export const useIsAdmin = () => {
  const { userProfile, userProfileLoading } = useAuth();

  // Check for admin user - inspect the user profile for admin markers
  const hasAdminRole =
    userProfile?.roles &&
    Array.isArray(userProfile.roles) &&
    userProfile.roles.some((role: any) => {
      // Handle both string roles and object roles
      if (typeof role === "string") {
        return role.toLowerCase().includes("admin");
      } else if (role && typeof role === "object") {
        return role?.name?.toLowerCase().includes("admin");
      }
      return false;
    });

  const isAdminProfile =
    userProfile?.username &&
    !("cart" in userProfile) &&
    !("companyName" in userProfile);

  const isAdmin = Boolean(userProfile && (hasAdminRole || isAdminProfile));

  return { isAdmin, userProfileLoading, userProfile };
};
