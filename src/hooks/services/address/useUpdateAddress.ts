import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { UPDATE_USER_ADDRESS } from "@/constants/links";
import { Address } from "@/constants/models/Address";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<Address>();

  const updateAddress = async (address: Address) => {
    const body = {
      Id: address.id,
      Title: address.title,
      FirstName: address.firstName,
      LastName: address.lastName,
      FullAddress: address.fullAddress,
      City: address.city,
      District: address.district,
      Country: address.country,
      PostalCode: address.postalCode,
      Neighbourhood: address.neighbourhood,
      Street: address.street,
      DistrictId: address.districtId || null,
      CityId: address.cityId || null,
      PhoneNumber: address.phoneNumber || null,
    };

    await mutateAsync(
      {
        url: UPDATE_USER_ADDRESS,
        method: HttpMethod.PUT,
        data: body, // Axios veya benzeri için 'data' kullanılır
        headers: {
          "Content-Type": "application/json",
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [QueryKeys.USER_ADDRESS_LIST],
          });
        },
      }
    );
  };

  return { updateAddress, isPending };
};
