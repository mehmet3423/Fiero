import { UserRole } from "@/constants/enums/UserRole";
import { UserProfile } from "@/constants/models/UserProfile";
import { useLogin } from "@/hooks/services/useLogin";
import { useLogout } from "@/hooks/services/useLogout";
import { useGetUserProfile } from "@/hooks/services/user-profile/useGetUserProfile";
import { useRegister } from "@/hooks/services/useRegister";
import { useAddItemsToCart } from "@/hooks/services/shopping-cart/useCart";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { LocalStorageKeys } from "@/constants/enums/LocalStorage";
import { createContext, ReactNode, useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import EmailConfirmationModal from "@/components/shared/EmailConfirmationModal";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

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

  const { addItems } = useAddItemsToCart();
  const queryClient = useQueryClient();
  const hasMigratedCart = useRef(false); // Local storage'dan sepete aktarımın yapılıp yapılmadığını takip et

  // Giriş yapıldığında local storage'daki ürünleri sepete ekle
  useEffect(() => {
    if (
      userProfileLoading ||
      !userProfile ||
      userRole !== UserRole.CUSTOMER ||
      hasMigratedCart.current
    ) {
      return;
    }

    const migrateGuestCartToUserCart = async () => {
      try {
        // Local storage'dan sepet öğelerini al
        const storedCart = localStorage.getItem(LocalStorageKeys.CART);
        if (!storedCart) {
          return; // Sepet boşsa işlem yapma
        }

        const cartItems = JSON.parse(storedCart);
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
          return; // Geçersiz veya boş sepet
        }

        // API formatına çevir
        const items = cartItems.map((item: { id: string; quantity: number }) => ({
          itemId: item.id,
          quantity: item.quantity,
        }));

        // Sepete ekle
        await addItems(items);

        // Başarılı olduktan sonra local storage'ı temizle
        localStorage.removeItem(LocalStorageKeys.CART);
        hasMigratedCart.current = true;

        // Sepet query'sini invalidate et (useAddItemsToCart içinde de yapılıyor ama burada da yapıyoruz garantisi için)
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey;
            return (
              Array.isArray(queryKey) &&
              queryKey[0] === QueryKeys.CART
            );
          },
        });

        // Biraz bekleyip tekrar invalidate et (timing sorununu çözmek için)
        setTimeout(() => {
          queryClient.invalidateQueries({
            predicate: (query) => {
              const queryKey = query.queryKey;
              return (
                Array.isArray(queryKey) &&
                queryKey[0] === QueryKeys.CART
              );
            },
          });
        }, 500);

        toast.success("Sepetiniz hesabınıza aktarıldı");
      } catch (error) {
        console.error("Guest cart migration error:", error);
        // Hata durumunda sessizce devam et, kullanıcıyı rahatsız etme
      }
    };

    migrateGuestCartToUserCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile, userProfileLoading, userRole]);

  // Logout olduğunda migration flag'ini sıfırla
  useEffect(() => {
    if (!userProfile && !userProfileLoading) {
      hasMigratedCart.current = false;
    }
  }, [userProfile, userProfileLoading]);

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
