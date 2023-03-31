import type { User } from '@vsf-enterprise/epcc-api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useUserData = () => {
  function getFirstName(user: User): string {
    const name = user?.name?.split(' ');
    return name?.[0] ?? '';
  }

  function getLastName(user: User): string {
    const name = user?.name?.split(' ');
    return name?.[name.length - 1] ?? '';
  }

  function getFullName(user: User): string {
    return user?.name ?? '';
  }

  function getEmailAddress(user: User): string {
    return user?.email ?? '';
  }

  function getMarketingEmailsConsent(user: User): boolean {
    return user?.accepts_marketing ?? false;
  }

  return {
    getFirstName,
    getLastName,
    getFullName,
    getEmailAddress,
    getMarketingEmailsConsent
  };
};
