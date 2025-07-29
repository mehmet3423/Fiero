import { HttpMethod } from "@/constants/enums/HttpMethods";
import { LOGIN } from "@/constants/links";
import { setToken } from "@/helpers/tokenUtils";
import toast from "react-hot-toast";
import useMyMutation from "../useMyMutation";

interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

interface LoginResponse {
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

export const useLogin = () => {
  const { mutateAsync, isPending } = useMyMutation<LoginResponse>();

  const handleLogin = async (data: LoginData, onSuccess?: () => void) => {
    const params = new URLSearchParams({
      Email: data.email,
      Password: data.password,
    }).toString();

    await mutateAsync(
      {
        url: `${LOGIN}?${params}`,
        method: HttpMethod.POST,
      },
      {
        onSuccess: (res) => {
          setToken(res.data.data.accessToken);
          toast.success("Giriş başarılı!");
          onSuccess?.();
        },
        onError: (error) => {
          toast.error(error.response?.data.detail);
        },
      }
    );
  };

  return {
    handleLogin,
    isPending,
  };
};
