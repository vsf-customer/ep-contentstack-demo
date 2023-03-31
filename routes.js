const path = require('path');

module.exports = function getRoutes(directory = __dirname) {
  return [
    {
      name: 'my-account',
      path: '/my-account',
      component: path.resolve(directory, 'pages/MyAccount.vue'),
      children: [
        {
          path: 'my-profile',
          name: 'my-profile',
          component: path.resolve(directory, 'pages/MyAccount/MyProfile.vue')
        },
        {
          path: 'shipping-details',
          name: 'shipping-details',
          component: path.resolve(
            directory,
            'pages/MyAccount/ShippingDetails.vue'
          )
        },
        {
          path: 'billing-details',
          name: 'billing-details',
          component: path.resolve(
            directory,
            'pages/MyAccount/BillingDetails.vue'
          )
        },
        {
          path: 'my-newsletter',
          name: 'my-newsletter',
          component: path.resolve(directory, 'pages/MyAccount/MyNewsletter.vue')
        },
        {
          path: 'order-history',
          name: 'order-history',
          component: path.resolve(directory, 'pages/MyAccount/OrderHistory.vue')
        }
      ]
    },
    {
      name: 'home',
      path: '/',
      component: path.resolve(directory, 'pages/Home.vue')
    },
    {
      name: 'product',
      path: '/p/:id/:slug/',
      component: path.resolve(directory, 'pages/Product.vue')
    },
    {
      name: 'category',
      path: '/c/:slug_1/:slug_2?/:slug_3?/:slug_4?/:slug_5?',
      component: path.resolve(directory, 'pages/Category.vue')
    },
    {
      name: 'checkout',
      path: '/checkout',
      component: path.resolve(directory, 'pages/Checkout.vue'),
      children: [
        {
          path: 'shipping',
          name: 'shipping',
          component: path.resolve(directory, 'pages/Checkout/Shipping.vue')
        },
        {
          path: 'billing',
          name: 'billing',
          component: path.resolve(directory, 'pages/Checkout/Billing.vue')
        },
        {
          path: 'payment',
          name: 'payment',
          component: path.resolve(directory, 'pages/Checkout/Payment.vue')
        },
        {
          path: 'thank-you',
          name: 'thank-you',
          component: path.resolve(directory, 'pages/Checkout/ThankYou.vue')
        }
      ]
    },
    {
      name: 'reset-password',
      path: '/reset-password',
      component: path.resolve(directory, 'pages/ResetPassword.vue')
    }
  ];
};
