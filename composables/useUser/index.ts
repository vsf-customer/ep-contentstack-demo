import type {
  UseUser,
  UseUserLoad,
  UseUserLogin,
  UseUserLogout,
  UseUserSetUser,
  UseUserRegister,
  UseUserUpdateUser,
  UseUserChangePassword,
  UseUserSetCartForCustomer
} from './types';
import {
  COOKIE_MAX_AGE,
  COOKIE_KEY_CART_ID,
  COOKIE_KEY_WISHLIST_ID,
  COOKIE_KEY_CHECKOUT_DATA,
  COOKIE_KEY_CUSTOMER_DATA
} from '@/constants';
import { useUserStore } from '@/store/user';
import { Logger } from '@vue-storefront/core';
import { useCart, useLocale } from '@/composables';
import type { Cart } from '@vsf-enterprise/epcc-api';
import { computed, useContext } from '@nuxtjs/composition-api';

export function useUser(): UseUser {
  const store = useUserStore();
  const { cart, setCart } = useCart();
  const {
    i18n,
    $cookies,
    $vsf: { $epcc }
  } = useContext();
  const { activeCurrency } = useLocale();

  const isAuthenticated = computed(() => Boolean(store.user));

  const clearErrors = () => {
    store.error.load = null;
    store.error.changePassword = null;
    store.error.login = null;
    store.error.register = null;
    store.error.updateUser = null;
    store.error.logout = null;
  };

  const load: UseUserLoad = () => {
    try {
      store.loading = true;
      return (store.user = $cookies.get(COOKIE_KEY_CUSTOMER_DATA));
    } catch (err) {
      store.error.load = err;
    } finally {
      store.loading = false;
    }
  };

  const login: UseUserLogin = async ({ user: { username, password } }) => {
    clearErrors();
    if (!username || !password) {
      store.error.login = new Error('Username and password are required');
      return;
    }

    try {
      store.loading = true;
      const storedCartId = $cookies.get(COOKIE_KEY_CART_ID) ?? cart?.value?.id;
      const storedWishlistCartId = $cookies.get(COOKIE_KEY_WISHLIST_ID);

      const signInResponse =
        await $epcc.api.customerSignIn({
          email: username,
          password: password
        });

      if (typeof signInResponse === 'string') {
        throw new Error(String(i18n.t(signInResponse)));
      }

      const { customer_id: id, expires: expiration } = signInResponse;

      const expires = new Date(expiration * 1000);

      const user = await $epcc.api.getCustomer({ id });

      // Merge of the guest cart on login
      const carts = await $epcc.api.getCustomerCartsList({
        locale: i18n.locale
      });

      const mergeCarts = async (
        target: Cart,
        sourceId: string,
        cookieKey: string
      ) => {
        try {
          const mergedCarts = await $epcc.api.mergeCarts({
            locale: i18n.locale,
            cartId: target.id,
            data: { cart_id: sourceId, type: 'cart_items' },
            currency: activeCurrency.value?.code
          });

          if (cookieKey === COOKIE_KEY_CART_ID) {
            setCart({
              ...target,
              meta: mergedCarts.meta,
              items: mergedCarts.data
            });
          }
        } catch (err) {
          Logger.error('useUser/login/mergeCarts', err);

          if (cookieKey === COOKIE_KEY_CART_ID) {
            const cart = await $epcc.api.getCart({
              id: target.id,
              locale: i18n.locale
            });

            setCart(cart);
          }
        }
      };

      const setCartForCustomer: UseUserSetCartForCustomer = async ({
        cartId,
        cookieKey
      }) => {
        const associatedCartOfType = (carts?.data || []).find(
          (cart) =>
            cart.name.toLowerCase() ===
            (cookieKey === COOKIE_KEY_CART_ID ? 'cart' : 'wishlist')
        );

        if (associatedCartOfType && associatedCartOfType?.id !== cartId) {
          if (cartId) {
            await mergeCarts(
              associatedCartOfType as unknown as Cart,
              cartId,
              cookieKey
            );
          }

          // Update of the stored cartID with customers
          $cookies.remove(cookieKey);
          $cookies.set(cookieKey, associatedCartOfType.id, {
            expires,
            path: '/'
          });
        } else if (!associatedCartOfType) {
          // Create a new cart for the customer if no guest cart is found
          const guestCartId =
            cartId ??
            (
              await $epcc.api.createCart({
                locale: i18n.locale,
                name: cookieKey === COOKIE_KEY_CART_ID ? 'cart' : 'wishlist'
              })
            ).id;

          await $epcc.api.addCustomerCartAssociation({
            customerId: id,
            cartId: guestCartId,
            locale: i18n.locale
          });

          $cookies.remove(cookieKey);
          $cookies.set(cookieKey, guestCartId, {
            expires,
            path: '/'
          });
        }
      };

      await setCartForCustomer({
        cartId: storedCartId,
        cookieKey: COOKIE_KEY_CART_ID
      });
      await setCartForCustomer({
        cartId: storedWishlistCartId,
        cookieKey: COOKIE_KEY_WISHLIST_ID
      });

      $cookies.set(COOKIE_KEY_CUSTOMER_DATA, user, {
        expires,
        path: '/'
      });

      store.error.login = null;
      return (store.user = user);
    } catch (err) {
      store.error.login = err;
    } finally {
      store.loading = false;
    }
  };

  const logout: UseUserLogout = async () => {
    clearErrors();
    try {
      store.loading = true;
      await $epcc.api.logoutCustomer();
      $cookies.remove(COOKIE_KEY_CART_ID);
      $cookies.remove(COOKIE_KEY_WISHLIST_ID);
      $cookies.remove(COOKIE_KEY_CUSTOMER_DATA);
      $cookies.remove(COOKIE_KEY_CHECKOUT_DATA);

      const [createdCart, createdWishlist] = await Promise.all([
        $epcc.api.createCart({ name: 'cart', locale: i18n.locale }),
        $epcc.api.createCart({ name: 'wishlist', locale: i18n.locale })
      ]);

      setCart({
        ...cart.value,
        items: [],
        id: createdCart.id
      });

      $cookies.set(COOKIE_KEY_CART_ID, createdCart.id, {
        path: '/',
        maxAge: COOKIE_MAX_AGE
      });
      $cookies.set(COOKIE_KEY_WISHLIST_ID, createdWishlist.id, {
        path: '/',
        maxAge: COOKIE_MAX_AGE
      });

      store.user = null;
      store.error.logout = null;
    } catch (err) {
      store.error.logout = err;
    } finally {
      store.loading = false;
    }
  };

  const setUser: UseUserSetUser = (value) => {
    store.user = value;
  };

  const register: UseUserRegister = async (params) => {
    clearErrors();
    try {
      const {
        user: {
          email,
          password,
          lastName,
          firstName,
          acceptsMarketingEmails = false
        }
      } = params;
      const username = email;
      const name = `${firstName} ${lastName}`;

      store.loading = true;
      const user = await $epcc.api.registerCustomer({
        name,
        email,
        password,
        accepts_marketing: acceptsMarketingEmails
      });

      if (typeof user === 'string') {
        throw new Error(String(i18n.t(user)));
      }

      await login({ user: { username, password } });

      store.error.register = null;
      return (store.user = user);
    } catch (err) {
      store.error.register = err;
    } finally {
      store.loading = false;
    }
  };

  const updateUser: UseUserUpdateUser = async (updatedUser) => {
    clearErrors();
    try {
      const currentUser = store.user;
      const { user: updatedUserData } = updatedUser;
      const expires = new Date();
      expires.setDate(expires.getDate() + 1);

      const {
        firstName,
        lastName,
        acceptsMarketingEmails = false
      } = updatedUserData;
      const fullName =
        firstName && lastName ? `${firstName} ${lastName}` : null;

      store.loading = true;
      const user = await $epcc.api.updateCustomer({
        id: currentUser.id,
        customer: {
          ...updatedUserData,
          ...(fullName ? { name: fullName } : {}),
          accepts_marketing: acceptsMarketingEmails
        },
        validation: {
          email: currentUser.email,
          password: updatedUserData.password
        }
      });

      if (!Object.keys(user).includes('errors')) {
        store.error.updateUser = null;
        $cookies.set(COOKIE_KEY_CUSTOMER_DATA, user, {
          expires,
          path: '/'
        });
        return (store.user = user);
      }
    } catch (err) {
      store.error.updateUser = err;
    } finally {
      store.loading = false;
    }
  };

  const changePassword: UseUserChangePassword = async (params) => {
    clearErrors();
    if (!params.current || !params.new) {
      store.error.changePassword = new Error(
        'Please enter your current and new password'
      );
      return;
    } else if (store.user === null) {
      store.error.changePassword = new Error('Please login first');
      return;
    }

    try {
      store.loading = true;
      const user = await $epcc.api.updateCustomer({
        id: store.user.id,
        customer: { password: params.new },
        validation: {
          email: store.user.email,
          password: params.current
        }
      });

      store.error.changePassword = null;
      return (store.user = user);
    } catch (err) {
      store.error.changePassword = err;
    } finally {
      store.loading = false;
    }
  };

  return {
    load,
    login,
    logout,
    setUser,
    register,
    updateUser,
    changePassword,
    isAuthenticated,
    user: computed(() => store.user),
    error: computed(() => store.error),
    loading: computed(() => store.loading)
  };
}

export * from './types';
