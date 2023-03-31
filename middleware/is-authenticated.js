import { COOKIE_KEY_CUSTOMER_DATA } from '@/constants';

export default async (context) => {
  const customerData = context.$cookies.get(COOKIE_KEY_CUSTOMER_DATA);
  if (!customerData) {
    context.app.router.push('/');
    context.redirect('/');
    return false;
  }

  return true;
};
