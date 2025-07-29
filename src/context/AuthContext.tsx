import { UserRole } from "@/constants/enums/UserRole";
import { UserProfile } from "@/constants/models/UserProfile";
import { useLogin } from "@/hooks/services/useLogin";
import { useLogout } from "@/hooks/services/useLogout";
import { useGetUserProfile } from "@/hooks/services/user-profile/useGetUserProfile";
import { useRegister } from "@/hooks/services/useRegister";
import { createContext, ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import EmailConfirmationModal from "@/components/shared/EmailConfirmationModal";

interface AuthContextType {
  handleLogout: ReturnType<typeof useLogout>["handleLogout"];
  handleLogin: ReturnType<typeof useLogin>["handleLogin"];
  handleRegister: ReturnType<typeof useRegister>["handleRegister"];
  loginLoading: boolean;
  logoutLoading: boolean;
  registerLoading: boolean;
  registerError: unknown;
  userProfile: UserProfile | undefined;
  userProfileLoading: boolean;
  userProfileError: unknown;
  userRole: UserRole | null;
  setUserRole: (role: UserRole | null) => void;
  showEmailConfirmationModal: () => void;
  refetchUserProfile: () => void;
}

const AuthContext = createContext<AuthContextType>({
  handleLogin: async () => {},
  handleLogout: async () => {},
  handleRegister: async () => {},
  loginLoading: false,
  logoutLoading: false,
  registerLoading: false,
  registerError: null,
  userProfile: undefined,
  userProfileLoading: false,
  userProfileError: null,
  userRole: null,
  setUserRole: () => {},
  showEmailConfirmationModal: () => {},
  refetchUserProfile: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [showEmailConfirmationModal, setShowEmailConfirmationModal] =
    useState(false);
  const [emailConfirmationDismissed, setEmailConfirmationDismissed] =
    useState(false);

  const { handleLogin, isPending: loginLoading } = useLogin();
  const { handleLogout, isPending: logoutLoading } = useLogout();

  const {
    handleRegister,
    isPending: registerLoading,
    error: registerError,
  } = useRegister();

  const {
    userProfile,
    userProfileLoading,
    error: userProfileError,
    refetch: refetchUserProfile,
  } = useGetUserProfile();

  // Check email confirmation status for Customer and Seller (not Admin)
  useEffect(() => {
    if (
      !userProfile ||
      userProfileLoading ||
      emailConfirmationDismissed ||
      userRole === UserRole.ADMIN ||
      router.pathname === "/confirmed-email"
    )
      return;

    // Check if user is Customer or Seller
    const isCustomer = "cart" in userProfile;
    const isSeller =
      "companyName" in userProfile || "companyAddress" in userProfile;

    if ((isCustomer || isSeller) && userProfile.applicationUser) {
      const emailConfirmed = userProfile.applicationUser.emailConfirmed;

      if (!emailConfirmed) {
        setShowEmailConfirmationModal(true);
      }
    }
  }, [
    userProfile,
    userProfileLoading,
    emailConfirmationDismissed,
    userRole,
    router.pathname,
  ]);

  const handleCloseEmailConfirmationModal = () => {
    setShowEmailConfirmationModal(false);
    setEmailConfirmationDismissed(true);
  };

  const handleShowEmailConfirmationModal = () => {
    setShowEmailConfirmationModal(true);
    setEmailConfirmationDismissed(false); // Reset dismissed state when manually opened
  };

  const value = {
    handleLogout,
    handleLogin,
    handleRegister,
    loginLoading,
    logoutLoading,
    registerLoading,
    registerError,
    userProfile,
    userProfileLoading,
    userProfileError,
    userRole,
    setUserRole,
    showEmailConfirmationModal: handleShowEmailConfirmationModal,
    refetchUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {userProfile &&
        userRole !== UserRole.ADMIN &&
        router.pathname !== "/confirmed-email" && (
          <EmailConfirmationModal
            isOpen={showEmailConfirmationModal}
            onClose={handleCloseEmailConfirmationModal}
            userEmail={
              // Get email from applicationUser for Customer/Seller
              "applicationUser" in userProfile && userProfile.applicationUser
                ? userProfile.applicationUser.email
                : userProfile.email
            }
          />
        )}
    </AuthContext.Provider>
  );
};

export { AuthContext };
