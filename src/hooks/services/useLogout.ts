import { HttpMethod } from "@/constants/enums/HttpMethods";
import { LOGOUT } from "@/constants/links";
import { removeToken } from "@/helpers/tokenUtils";
import toast from "react-hot-toast";
import useMyMutation from "../useMyMutation";

export const useLogout = () => {
  const { mutateAsync, isPending } = useMyMutation<void>();

  const handleLogout = async () => {
    try {
      await mutateAsync(
        {
          url: LOGOUT,
          method: HttpMethod.POST,
        },
        {
          onSuccess: () => {
            removeToken();
            toast.success("Çıkış başarılı!");
            window.location.href = "/";
          },
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return {
    handleLogout,
    isPending,
  };
};
