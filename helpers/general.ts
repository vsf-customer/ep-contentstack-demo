import type { AxiosError } from 'axios';
import { useUser } from '@/composables';
import type { Hierarchy, Node } from '@moltin/sdk';
import { useContext } from '@nuxtjs/composition-api';

export declare type ApiError = AxiosError;

export const isApiError = (error: Record<string, any>): error is ApiError =>
  'isAxiosError' in error;

export const isNode = (data: Node | Hierarchy): data is Node =>
  'parent' in data.relationships || 'products' in data.relationships;

export const forceLoginOnUnauthorizedResponse = async (
  { response }: ApiError,
  logoutFn = null
): Promise<void> => {
  const user = useUser();
  const context = useContext();
  const responseStatusRequiresLogout = ((response: { status?: number }) =>
    [401, 403].includes(response?.status));

  if (
    responseStatusRequiresLogout(response) ||
      (Array.isArray(response.data?.errors) &&
        response.data?.errors.some((error) =>
          responseStatusRequiresLogout(error))
      )
  ) {
    await (logoutFn ? logoutFn() : user.logout());
    context.redirect('/?forceLogin');
  }
};
