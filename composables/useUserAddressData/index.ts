import type { Address } from '@vsf-enterprise/epcc-api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUserAddressData = () => {
  const getAddresses = (addresses: Address[]): Address[] => {
    return addresses;
  };

  const getDefault = (addresses: Address[]): Address => {
    return addresses.find((address) => address.default_address === true);
  };

  const getPostCode = (address: Address): string => {
    return address?.postcode;
  };

  const getLine1 = (address: Address): string => {
    return address?.line_1;
  };

  const getLine2 = (address: Address): string | number => {
    return address?.line_2;
  };

  const getCity = (address: Address): string => {
    return address?.city;
  };

  const getFirstName = (address: Address): string => {
    return address?.first_name;
  };

  const getLastName = (address: Address): string => {
    return address?.last_name;
  };

  const getCountry = (address: Address): string => {
    return address?.country;
  };

  const getCounty = (address: Address): string => {
    return address?.county;
  };

  const getPhone = (address: Address): string => {
    return address?.phone_number;
  };

  const getId = (address: Address): string | number => {
    return address?.id || '';
  };

  return {
    getAddresses,
    getDefault,
    getPostCode,
    getLine1,
    getLine2,
    getCity,
    getFirstName,
    getLastName,
    getCountry,
    getPhone,
    getCounty,
    getId
  };
};
