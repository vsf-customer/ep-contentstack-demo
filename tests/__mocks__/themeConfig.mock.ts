export const themeConfigMock = {
  home: {
    bannerA: {
      link: '/',
      image: {
        mobile: '/homepage/bannerB.webp',
        desktop: '/homepage/bannerF.webp'
      }
    },
    bannerB: {
      link: '/',
      image: '/homepage/bannerE.webp'
    },
    bannerC: {
      link: '/',
      image: '/homepage/bannerC.webp'
    },
    bannerD: {
      link: '/',
      image: '/homepage/bannerG.webp'
    }
  },
  product: {
    placeholderImage: [
      { url: '/placeholder.jpeg', label: 'placeholder', role: 'main' }
    ]
  },
  wishlistEnabled: {
    authenticated: true,
    guest: true
  },
  compareProductsEnabled: {
    authenticated: true,
    guest: true
  },
  fallbackShippingMethods: [
    {
      id: 1,
      label: 'Standard shipping',
      value: 'standard',
      description: 'Delivery in 1-2 working days',
      price: 7.9
    },
    {
      id: 2,
      label: 'Free shipping',
      value: 'free',
      description: 'Delivery in 5-6 working days',
      price: 0
    }
  ],
  defaultItemsPerPage: 25,
  itemsPerPage: [10, 15, 20, 25, 50, 100],
  lowStockThreshold: 5,
  fallbackCurrency: 'USD'
};
