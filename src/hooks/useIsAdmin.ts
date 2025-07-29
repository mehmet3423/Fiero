import { useAuth } from "./context/useAuth";

export const useIsAdmin = () => {
  const { userProfile, userProfileLoading } = useAuth();

  // Check for admin user - inspect the user profile for admin markers
  const isAdmin = Boolean(
    userProfile &&
      // Check specific admin properties that should exist in admin user profiles
      ((userProfile.username &&
        !("cart" in userProfile) &&
        !("companyName" in userProfile)) ||
        // Check if admin roles are present
        (userProfile.roles &&
          Array.isArray(userProfile.roles) &&
          userProfile.roles.some((role: any) =>
            role?.name?.toLowerCase().includes("admin")
          )))
  );

  return { isAdmin, userProfileLoading, userProfile };
};
