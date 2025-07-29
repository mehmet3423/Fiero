import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_USER_PROFILE } from "@/constants/links";
import { CustomerProfile } from "@/constants/models/UserProfile";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface UpdateProfileData {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthDate: string;
}

export const useUpdateUserProfile = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<CustomerProfile>();

  const updateProfile = async (data: UpdateProfileData) => {
    const requestBody = {
      id: data.id,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phoneNumber: data.phoneNumber || "",
      gender: parseInt(data.gender) || 0,
      birthDate: data.birthDate || "",
    };

    try {
      await mutateAsync(
        {
          url: UPDATE_USER_PROFILE,
          method: HttpMethod.PUT,
          data: requestBody,
        },
        {
          onSuccess: () => {
            toast.success("Profil bilgileriniz başarıyla güncellendi");
            queryClient.invalidateQueries({
              queryKey: [QueryKeys.GET_USER_PROFILE],
            });
          },
          onError: () => {
            toast.error("Profil güncellenirken bir hata oluştu");
          },
        }
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Profil güncellenirken bir hata oluştu");
    }
  };

  return { updateProfile, isPending };
};
