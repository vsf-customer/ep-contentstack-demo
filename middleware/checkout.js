import { COOKIE_KEY_CART_ID, COOKIE_KEY_CUSTOMER_DATA } from '@/constants';

export default async (context) => {
  // TODO: Check how to get cart content (access API layer) from this middleware, and redirect to home if cart is empty

  const isLoggedIn = context.$cookies.get(COOKIE_KEY_CUSTOMER_DATA);
  const storedCartId = context.$cookies.get(COOKIE_KEY_CART_ID);

  if (new RegExp('^/checkout/?$').test(context.route.path)) {
    const newPath = `/checkout/${isLoggedIn ? 'shipping' : 'personalDetails'}`;

    if (!storedCartId) {
      return context.redirect('/');
    }

    return context.redirect(newPath);
  }
};
