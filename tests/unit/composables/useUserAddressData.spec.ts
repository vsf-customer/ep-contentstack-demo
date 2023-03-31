import { useUserAddressData } from '../../../composables/useUserAddressData';
import { addressMock } from '../../__mocks__/address.mock';
import { expect } from '@jest/globals';

describe('[epcc-theme] useUserAddressData', () => {
  const userAddressData = useUserAddressData();

  test('getAddresses should return the list of addresses', () => {
    expect(userAddressData.getAddresses([addressMock])).toEqual([addressMock]);
  });

  test('getDefault should return the default address', () => {
    const idOfDefaultAddress = 'defaultAddressId';

    const addresses = [
      addressMock,
      { ...addressMock, id: idOfDefaultAddress, default_address: true }
    ];

    expect(userAddressData.getDefault(addresses).id).toEqual(
      idOfDefaultAddress
    );
  });

  test('getPostCode should return the post code', () => {
    expect(userAddressData.getPostCode(addressMock)).toEqual(
      addressMock.postcode
    );
  });

  test('getLine1 should return the line 1', () => {
    expect(userAddressData.getLine1(addressMock)).toEqual(addressMock.line_1);
  });

  test('getLine2 should return the line 2', () => {
    expect(userAddressData.getLine2(addressMock)).toEqual(addressMock.line_2);
  });

  test('getCity should return the city', () => {
    expect(userAddressData.getCity(addressMock)).toEqual(addressMock.city);
  });

  test('getFirstName should return the first name of the customer', () => {
    expect(userAddressData.getFirstName(addressMock)).toEqual(
      addressMock.first_name
    );
  });

  test('getLastName should return the last name of the customer', () => {
    expect(userAddressData.getLastName(addressMock)).toEqual(
      addressMock.last_name
    );
  });

  test('getCountry should return the country', () => {
    expect(userAddressData.getCountry(addressMock)).toEqual(
      addressMock.country
    );
  });

  test('getCounty should return the county', () => {
    expect(userAddressData.getCounty(addressMock)).toEqual(addressMock.county);
  });

  test('getPhone should return the phone number of the customer', () => {
    expect(userAddressData.getPhone(addressMock)).toEqual(
      addressMock.phone_number
    );
  });

  describe('getId', () => {
    it('should return the id of the address', () => {
      expect(userAddressData.getId(addressMock)).toEqual(addressMock.id);
    });

    it('should return empty string when address is not defined', () => {
      expect(userAddressData.getId(undefined)).toEqual('');
    });
  });
});
