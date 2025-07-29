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
      if (!data.email || !data.password) {
        toast.error("Lütfen tüm alanları doldurun");
        return;
      }

      const baseParams = {
        FirstName: data.firstName,
        LastName: data.lastName,
        Password: data.password,
        Email: data.email,
        PhoneNumber: data.phoneNumber,
        BirthDate: data.birthDate,
        Gender: data.gender.toString(),
      };

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
        params.append(key, value.toString());
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
        },
        {
          onSuccess: (res) => {
            console.log("Register response:", res.data);

            if (res.data && res.data.data.accessToken) {
              // Save token to localStorage for automatic login
              setToken(res.data.data.accessToken);
              toast.success("Kayıt başarılı! Oturum açılıyor...");

              // Reload page to update AuthContext and userProfile
              setTimeout(() => {
                window.location.reload();
              }, 1000); // 1.5 saniye bekle, toast'ın görünmesi için

              onSuccess?.();
            } else {
              toast.success("Kayıt başarılı!");
              onSuccess?.();
            }
          },
          onError: (error) => {
            console.error("Register error:", error);
            toast.error(error.response?.data?.detail || "Kayıt başarısız!");
          },
        }
      );
    } catch (error) {
      console.error("Register error:", error);
      toast.error("Kayıt başarısız!");
    }
  };

  return {
    handleRegister,
    isPending,
    error,
  };
};
