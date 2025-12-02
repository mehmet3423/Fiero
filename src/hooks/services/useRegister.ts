import { HttpMethod } from "@/constants/enums/HttpMethods";
import { UserRole } from "@/constants/enums/UserRole";
import { CUSTOMER_REGISTER, SELLER_REGISTER } from "@/constants/links";
import { setToken } from "@/helpers/tokenUtils";
import toast from "react-hot-toast";
import useMyMutation from "../useMyMutation";

interface RegisterData {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: number;
  IsSMSNotificationEnabled?: boolean;
  IsEmailNotificationEnabled?: boolean;
  companyName?: string;
  companyAddress?: {
    country: number;
    state: number;
    city: number;
    fullAddress: number;
  };
}

interface RegisterResponse {
  data: {
    applicationUserId: string | null;
    user: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      fullName: string;
      email: string;
      phoneNumber: string | null;
      birthDate: string | null;
      gender: number;
      emailConfirmed: boolean;
      userGroupIds: string[];
      roleIds: string[] | null;
      roles: string[];
      addresses: any[];
      userPaymentCard: any[];
    };
    accessToken: string;
    refreshToken: string;
  };
  isSucceed: boolean;
  message: string;
}

export const useRegister = () => {
  const { mutateAsync, isPending, error } = useMyMutation<RegisterResponse>();

  const handleRegister = async (
    data: RegisterData,
    userRole: UserRole = UserRole.CUSTOMER,
    onSuccess?: () => void
  ) => {
    try {
      // Validate required fields
      if (!data.email || !data.password || !data.firstName || !data.lastName || !data.phoneNumber) {
        toast.error("Lütfen tüm zorunlu alanları doldurun");
        return;
      }

      const baseParams: Record<string, string | boolean> = {
        FirstName: data.firstName,
        LastName: data.lastName,
        Password: data.password,
        Email: data.email,
        PhoneNumber: data.phoneNumber,
        Gender: data.gender.toString(),
        IsSMSNotificationEnabled: data.IsSMSNotificationEnabled ?? false,
        IsEmailNotificationEnabled: data.IsEmailNotificationEnabled ?? false,
      };

      // Only add BirthDate if it's not empty
      if (data.birthDate && data.birthDate.trim() !== "") {
        baseParams.BirthDate = data.birthDate;
      }

      const sellerParams =
        userRole === UserRole.SELLER
          ? {
            CompanyName: data.companyName,
            "CompanyAddress.Country": data.companyAddress?.country,
            "CompanyAddress.State": data.companyAddress?.state,
            "CompanyAddress.City": data.companyAddress?.city,
            "CompanyAddress.FullAddress": data.companyAddress?.fullAddress,
          }
          : {};

      const params = new URLSearchParams();

      // Base params
      Object.entries(baseParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          // Skip empty strings
          if (typeof value === "string" && value.trim() === "") {
            return;
          }
          // Handle boolean values properly - convert to "true"/"false" strings
          if (typeof value === "boolean") {
            params.append(key, value ? "true" : "false");
          } else {
            params.append(key, value.toString());
          }
        }
      });

      // Seller params
      if (userRole === UserRole.SELLER) {
        Object.entries(sellerParams).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      const registerUrl =
        userRole === UserRole.SELLER ? SELLER_REGISTER : CUSTOMER_REGISTER;

      await mutateAsync(
        {
          url: `${registerUrl}?${params.toString()}`,
          method: HttpMethod.POST,
          showErrorToast: false,
        },
        {
          onSuccess: (res) => {
            // Backend'den gelen mesajı göster
            const backendMessage = res.data?.message || "Kayıt başarılı!";
            
            if (res.data && res.data.data.accessToken) {
              // Save token to localStorage for automatic login
              setToken(res.data.data.accessToken);
              toast.success(backendMessage);

              // Reload page to update AuthContext and userProfile
              setTimeout(() => {
                window.location.reload();
              }, 1000); // 1 saniye bekle, toast'ın görünmesi için

              onSuccess?.();
            } else {
              toast.success(backendMessage);
              onSuccess?.();
            }
          },
          onError: (error) => {
            toast.error(error.response?.data?.message || "Kayıt başarısız!");
          },
        }
      );
    } catch (error: any) {
    }
  };

  return {
    handleRegister,
    isPending,
    error,
  };
};
