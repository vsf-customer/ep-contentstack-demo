import faker from '@faker-js/faker';
import { Cart, CartItem } from '@vsf-enterprise/epcc-api';

interface CartFactoryMockFnParams {
  id?: string;
  code?: string;
  empty?: boolean;
  meta?: {
    with_tax?: {
      amount?: number;
      formatted?: string;
    };
    without_tax?: {
      amount?: number;
      formatted?: string;
    };
    tax?: {
      amount?: number;
      formatted?: string;
    };
    discount?: {
      amount?: number;
      formatted?: string;
    };
  };
  items?: (
    | CartItem
    | {
        id?: string;
        sku?: string;
        price?: number;
        quantity?: number;
        product_id?: string;
      }
  )[];
  promo?: {
    code?: string;
    value?: number;
  };
  wishlist?: boolean;
}

/**
 * This function creates a promotion CartItem object.
 *
 * @param params {{
 *   code?: string,
 * }}
 * @returns CartItem
 */
const promotionCartItemMock = (params?: {
  code: string;
  value: number;
}): CartItem => ({
  quantity: 1,
  sku: params?.code,
  manage_stock: false,
  type: 'promotion_item',
  description: 'Promotion',
  id: faker.datatype.uuid(),
  product_id: faker.datatype.uuid(),
  promotion_id: faker.datatype.uuid(),
  name: 'Description of Halloween test sale',
  slug: '',
  meta: undefined,
  image: {
    href: '',
    mime_type: '',
    file_name: ''
  },
  links: { product: '' },
  unit_price: {
    currency: 'USD',
    includes_tax: false,
    amount: -params?.value
  },
  value: {
    currency: 'USD',
    includes_tax: false,
    amount: -params?.value
  }
});

export const prepareWishlistItem = (item: CartItem): CartItem => {
  item.sku = `wishlist_${item.id}`;
  return item;
};

/**
 * This function generates a mock CartItem collection.
 * The items param is a number array because every single entry is a CartItem and its value is the quantity.
 *
 * @param params {{
 *   items: number[],
 *   wishlist?: boolean
 * }}
 * @returns {CartItem[]}
 */
export const generateCartItem = (params: {
  items: CartFactoryMockFnParams['items'];
  wishlist?: boolean
}): CartItem[] => params.items.map((item, index) =>
  'meta' in item
    ? (params.wishlist ? prepareWishlistItem(item) : item)
    : {
      type: 'cart_item',
      components: {
        'Option 1 ': {
          name: 'Option 1 ',
          options: [
            {
              id: '81c6da53-064a-4b93-8cf4-6758ddd5dbb3',
              type: 'product',
              attributes: {
                base_product: false,
                commodity_type: 'physical',
                created_at: '2021-09-03T06:22:42.222Z',
                description: 'This is the best Red Skirt I ever seen!',
                extensions: {
                  'products(cross_up_sell)': {
                    'cross-sell': 'BORN-ITEM-18, BORN-ITEM-19',
                    'related-products': 'BORN-ITEM-10',
                    'up-sell': 'BORN-ITEM-26, BORN-ITEM-27, BORN-ITEM-28'
                  },
                  'products(extension)': {
                    brand: null,
                    hot: true,
                    meta_description: null,
                    meta_keyword: null,
                    meta_title: null,
                    new: true,
                    on_sale: false,
                    short_description: 'Test Short Description',
                    'tax-rate': null
                  }
                },
                manage_stock: false,
                manufacturer_part_num: '1234-5678-ABCD',
                name: 'Red Skirt',
                sku: 'epcc-storeproduct',
                slug: 'epcc-storeproduct',
                status: 'live',
                upc_ean: '123456',
                updated_at: '2022-04-25T10:05:03.610Z',
                published_at: '2022-04-26T12:53:55.718Z'
              },
              relationships: {
                files: {
                  data: [
                    {
                      created_at: '2021-09-07T10:36:08.432Z',
                      id: '35d3ffc5-e069-49b3-8a6a-7b433248a3a6',
                      type: 'file'
                    }
                  ]
                },
                main_image: {
                  data: {
                    id: '35d3ffc5-e069-49b3-8a6a-7b433248a3a6',
                    type: 'main_image'
                  }
                }
              },
              files: [
                {
                  type: 'file',
                  id: '35d3ffc5-e069-49b3-8a6a-7b433248a3a6',
                  link: {
                    href: 'https://s3-eu-west-1.amazonaws.com/bkt-svc-files-cmty-api-moltin-com/2cb3362e-d6b4-4c39-9a4c-5b710421c554/35d3ffc5-e069-49b3-8a6a-7b433248a3a6.jpg'
                  },
                  file_name: 'Red Skirt_1.jpg',
                  mime_type: 'image/jpeg',
                  file_size: 37266,
                  public: false,
                  meta: {
                    dimensions: { width: 500, height: 500 },
                    timestamps: { created_at: '2021-09-07T10:35:59.925Z' }
                  },
                  links: {
                    self: 'https://api.moltin.com/v2/files/35d3ffc5-e069-49b3-8a6a-7b433248a3a6'
                  }
                }
              ],
              quantity: 1
            }
          ]
        },
        'Option 2 ': {
          name: 'Option 2 ',
          options: [
            {
              id: '227a7617-d137-4243-925d-439d586a7955',
              type: 'product',
              attributes: {
                base_product: false,
                commodity_type: 'physical',
                created_at: '2021-09-03T06:12:24.181Z',
                description:
                  'Look no further, Christmas sweater is the item that you were looking for! Our best team of engineers with a combined experience of over 150 years has created this product specifically for you. Our Quality will not be beaten. Our Price will not be beaten. Our Products will not be beaten. We will not be beaten!',
                extensions: {
                  'products(cross_up_sell)': {
                    'cross-sell':
                      'BORN-ITEM-18, BORN-ITEM-19, BORN-ITEM-20, BORN-ITEM-21, BORN-ITEM-22',
                    'related-products':
                      'BORN-ITEM-1, BORN-ITEM-2, BORN-ITEM-3, BORN-ITEM-4, BORN-ITEM-5, BORN-ITEM-6, BORN-ITEM-7',
                    'up-sell': 'BORN-ITEM-10, BORN-ITEM-11'
                  },
                  'products(extension)': {
                    brand: 'BORN',
                    hot: true,
                    meta_description: 'Buy a Christmas Sweater',
                    meta_keyword: 'Christmas Sweater, BORN, Luxury',
                    meta_title: 'Christmas Sweater',
                    new: true,
                    on_sale: false,
                    short_description:
                      'If you will look in the mirror, you will see that this Christmas sweater looks great on you!',
                    'tax-rate': null
                  }
                },
                manage_stock: false,
                name: 'Chritmas Sweater',
                price: { USD: { amount: 4999, includes_tax: false } },
                sku: 'BORN-ITEM-8',
                slug: 'christmas-sweater',
                status: 'live',
                updated_at: '2022-04-19T09:20:49.602Z',
                published_at: '2022-04-26T12:53:55.718Z'
              },
              relationships: {
                files: {
                  data: [
                    {
                      created_at: '2021-09-07T09:19:30.182Z',
                      id: '06ef1767-47cd-4585-87ab-97246ffc24b0',
                      type: 'file'
                    }
                  ]
                },
                main_image: {
                  data: {
                    id: '06ef1767-47cd-4585-87ab-97246ffc24b0',
                    type: 'main_image'
                  }
                }
              },
              files: [
                {
                  type: 'file',
                  id: '06ef1767-47cd-4585-87ab-97246ffc24b0',
                  link: {
                    href: 'https://s3-eu-west-1.amazonaws.com/bkt-svc-files-cmty-api-moltin-com/2cb3362e-d6b4-4c39-9a4c-5b710421c554/06ef1767-47cd-4585-87ab-97246ffc24b0.jpg'
                  },
                  file_name: 'Christmas Sweater_1.jpg',
                  mime_type: 'image/jpeg',
                  file_size: 169972,
                  public: false,
                  meta: {
                    dimensions: { width: 768, height: 500 },
                    timestamps: { created_at: '2021-09-07T09:19:21.69Z' }
                  },
                  links: {
                    self: 'https://api.moltin.com/v2/files/06ef1767-47cd-4585-87ab-97246ffc24b0'
                  }
                }
              ],
              quantity: 1
            }
          ]
        }
      },
      quantity: item.quantity || 1,
      id: item.id ?? faker.datatype.uuid(),
      slug: faker.commerce.product(),
      product_id: item.product_id ?? faker.datatype.uuid(),
      name: faker.commerce.productName(),
      sku: item.sku ?? `VSF-ITEM-${index + 1}`,
      description: faker.commerce.productDescription(),
      image: {
        mime_type: 'image/jpeg',
        href: faker.image.imageUrl(),
        file_name: faker.datatype.string()
      },
      manage_stock: false,
      unit_price: {
        amount: 12000,
        currency: 'USD',
        includes_tax: false
      },
      value: {
        currency: 'USD',
        includes_tax: false,
        amount: item.price || Number(faker.commerce.price())
      },
      links: {
        product:
          'https://api.moltin.com/v2/products/f2d559f2-58b0-4098-bd83-a2c5f978d971'
      },
      meta: {
        display_price: {
          with_tax: {
            unit: {
              amount: 12000,
              currency: 'USD',
              formatted: '$120.00'
            },
            value: {
              amount: 12000,
              currency: 'USD',
              formatted: '$120.00'
            }
          },
          without_tax: {
            unit: {
              amount: 12000,
              currency: 'USD',
              formatted: '$120.00'
            },
            value: {
              amount: 12000,
              currency: 'USD',
              formatted: '$120.00'
            }
          },
          tax: {
            unit: {
              amount: 0,
              currency: 'USD',
              formatted: '$0.00'
            },
            value: {
              amount: 0,
              currency: 'USD',
              formatted: '$0.00'
            }
          },
          discount: {
            unit: {
              amount: 0,
              currency: 'USD',
              formatted: '$0.00'
            },
            value: {
              amount: 0,
              currency: 'USD',
              formatted: '$0.00'
            }
          }
        },
        timestamps: {
          expires_at: '2022-04-12T15:33:00Z',
          created_at: '2022-04-07T14:52:58Z',
          updated_at: '2022-04-07T14:52:58Z'
        }
      }
    }
);

/**
 * This function generates a mock Cart object.
 *
 * @param params {CartFactoryMockFnParams}
 * @returns {Cart}
 */
export const generateCartMock = (params?: CartFactoryMockFnParams): Cart => {
  const cart = {
    name: 'cart',
    type: 'cart',
    id: params?.id ?? faker.datatype.uuid(),
    description: faker.lorem.paragraph(),
    items: [],
    meta: {
      display_price: {
        with_tax: {
          currency: '',
          formatted: params?.meta?.with_tax?.formatted || '0',
          amount: params?.meta?.with_tax?.amount || 0
        },
        without_tax: {
          currency: '',
          formatted: params?.meta?.without_tax?.formatted || '0',
          amount: params?.meta?.without_tax?.amount || 0
        },
        tax: {
          currency: '',
          formatted: params?.meta?.tax?.formatted || '0',
          amount: params?.meta?.tax?.amount || 0
        },
        discount: {
          currency: '',
          formatted: params?.meta?.discount?.formatted || '0',
          amount: params?.meta?.discount?.amount || 0
        }
      },
      timestamps: {
        created_at: '2022-04-05T14:37:32Z',
        updated_at: '2022-04-05T14:37:32Z',
        expires_at: '2022-04-12T14:37:32Z'
      }
    },
    links: {
      self: `https://api.moltin.com/v2/carts/${faker.datatype.uuid()}`
    }
  };

  if (params?.empty === false || params?.items?.length > 0) {
    cart.items = generateCartItem({ items: params?.items, wishlist: params?.wishlist });
  }

  if (params?.promo?.value || params?.promo?.code) {
    cart.items.push(
      promotionCartItemMock({
        code: params?.promo.code || 'TEST-COUPON',
        value: params?.promo.value || 100
      })
    );
  }

  return cart;
};

/**
 * This mock function receives a cart and a cart item ID and will return the same cart with the item removed
 *
 * @param params {{
 *   cart: Cart,
 *   cartItemId: string,
 * }}
 * @returns Promise<Cart>
 */
export const removeCartItemFromCartMockFn = (params: {
  cart: Cart;
  cartItemId?: string;
}): CartItem[] =>
  params?.cartItemId
    ? params?.cart.items.filter((item) => item.id !== params?.cartItemId)
    : [];

/**
 * This mock function receives a cart and a cart item ID and will return the same cart with the item quantity updated.
 *
 * @param params {{
 *   cart: Cart,
 *   quantity: number,
 *   cartItemId: string,
 * }}
 * @returns Promise<Cart>
 */
export const updateItemQtyMockFn = (params: {
  cart: Cart;
  quantity: number;
  cartItemId: string;
}): CartItem[] => {
  const item = params?.cart.items.find(
    (item) => item.id === params?.cartItemId
  );

  if (item) {
    item.quantity = params?.quantity;
  }

  return params?.cart.items;
};

/**
 * This function adds a new type of CartItem (promotion_item) to the cart.items property.
 *
 * @param params {{
 *   cart: Cart,
 *   code: string,
 * }}
 * @returns Cart
 */
export const addPromotionToCartMockFn = (params: {
  cart: Cart;
  code: string;
  value?: number;
}): CartItem[] => [
  ...params.cart.items,
  promotionCartItemMock({ code: params?.code, value: params?.value || 169 })
];

export const removePromotionFromCartMockFn = (params: {
  cart: Cart;
  code: string;
}): CartItem[] =>
  params?.cart.items.filter((item) => item.sku !== params?.code);
