import { useUserData } from '../../../composables/useUserData';
import { userMock } from '../../__mocks__/user.mock';
import { expect } from '@jest/globals';

describe('[epcc-theme] useUserData', () => {
  const userData = useUserData();

  describe('getFirstName', () => {
    it('returns the first part of the full name', async () => {
      expect(userData.getFirstName(userMock)).toEqual(userMock.name.split(' ')[0]);
    });

    it('returns empty string when no data available', async () => {
      expect(userData.getFirstName(undefined)).toEqual('');
    });
  });

  describe('getLastName', () => {
    it('returns the last part of the full name', async () => {
      const name = userMock.name;
      const expectedLastName = name.split(' ').pop();
      expect(userData.getLastName(userMock)).toEqual(expectedLastName);
    });

    it('returns empty string when no data available', async () => {
      expect(userData.getLastName(undefined)).toEqual('');
    });
  });

  describe('getFullName', () => {
    it('returns the full name', async () => {
      expect(userData.getFullName(userMock)).toEqual(userMock.name);
    });

    it('returns empty string when no data available', async () => {
      expect(userData.getFullName(undefined)).toEqual('');
    });
  });

  describe('getEmailAddress', () => {
    it('returns the email address', async () => {
      expect(userData.getEmailAddress(userMock)).toEqual(userMock.email);
    });

    it('returns empty string when no data available', async () => {
      expect(userData.getEmailAddress(undefined)).toEqual('');
    });
  });

  describe('getMarketingEmailsConsent', () => {
    it('returns the value of given marketing consent', async () => {
      expect(userData.getMarketingEmailsConsent(userMock)).toEqual(userMock.accepts_marketing);

      userMock.accepts_marketing = true;
      expect(userData.getMarketingEmailsConsent(userMock)).toEqual(userMock.accepts_marketing);
    });

    it('returns false by default', async () => {
      expect(userData.getMarketingEmailsConsent(undefined)).toEqual(false);
    });
  });
});
