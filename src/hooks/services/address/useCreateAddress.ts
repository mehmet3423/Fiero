import { HttpMethod } from "@/constants/enums/HttpMethods";
import { QueryKeys } from "@/constants/enums/QueryKeys";
import { CREATE_USER_ADDRESS } from "@/constants/links";
import { Address } from "@/constants/models/Address";
import useMyMutation from "@/hooks/useMyMutation";
import { useQueryClient } from "@tanstack/react-query";
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  const { mutateAsync, isPending } = useMyMutation<Address>();

  const createAddress = async (
    address: Address,
    countryName?: string,
    provinceName?: string,
    districtName?: string,
    districtId?: string,
    cityId?: string,
    phoneNumber?: string
  ) => {
    const body = {
      FirstName: address.firstName,
      LastName: address.lastName,
      Title: address.title,
      Country: countryName || "",
      City: provinceName || "",
      District: districtName || "",
      Neighbourhood: address.neighbourhood || "",
      Street: address.street || "",
      PostalCode: address.postalCode || "",
      FullAddress: address.fullAddress || "",
      DistrictId: districtId ?? null,
      CityId: cityId ?? null,
      PhoneNumber: phoneNumber || address.phoneNumber || "",
    };

    await mutateAsync(
      {
        url: CREATE_USER_ADDRESS,
        method: HttpMethod.POST,

        data: body,
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

  return { createAddress, isPending };
};
