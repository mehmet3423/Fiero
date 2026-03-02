import { HttpMethod } from "@/constants/enums/HttpMethods";
import { GOOGLE_LOGIN } from "@/constants/links";
import { setToken } from "@/helpers/tokenUtils";
import toast from "react-hot-toast";
import useMyMutation from "../useMyMutation";

interface GoogleLoginResponse {
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

export const useGoogleLogin = () => {
  const { mutateAsync, isPending } = useMyMutation<GoogleLoginResponse>();

  const handleGoogleLogin = async (
    idToken: string,
    onSuccess?: () => void
  ) => {
    await mutateAsync(
      {
        url: GOOGLE_LOGIN,
        method: HttpMethod.POST,
        data: { idToken },
        headers: { "Content-Type": "application/json" },
      },
      {
        onSuccess: (res) => {
          const token =
            res.data?.data?.accessToken ?? res.data?.accessToken;
          if (token) {
            setToken(token, true);
            toast.success("Google ile giriş başarılı!");
            onSuccess?.();
          }
        },
        onError: (error) => {
          const errorMessage =
            error.response?.data?.detail || error.response?.data?.message;
          if (errorMessage) {
            toast.error(errorMessage);
          }
        },
      }
    );
  };

  return {
    handleGoogleLogin,
    isPending,
  };
};
