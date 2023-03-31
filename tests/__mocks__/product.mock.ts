import { Product } from '@vsf-enterprise/epcc-api';

export const productMock: Product = {
  id: '0422759a-bde0-4736-9749-d8d77dfa44c5',
  type: 'product',
  attributes: {
    base_product: true,
    commodity_type: 'physical',
    created_at: '2021-09-03T06:41:43.707Z',
    description: 'En - Description will be English',
    extensions: {
      'products(cross_up_sell)': {
        cross_sell: 'BORN-ITEM-1, BORN-ITEM-2',
        related: 'BORN-ITEM-18',
        up_sell: 'BORN-ITEM-10'
      },
      'products(extension)': {
        brand: 'BORN',
        hot: null,
        meta_description: 'Buy a Luxurious Unisex Blouse',
        meta_keyword: 'Unisex Blouse, BORN, Luxury',
        meta_title: 'Unisex Blouse',
        new: null,
        on_sale: true,
        short_description:
          'If you will look in the mirror, you will see that this unisex blouse looks great on you!'
      }
    },
    manage_stock: false,
    name: 'Unisex Blouse - En',
    price: {
      EUR: {
        amount: 12111,
        includes_tax: false
      },
      USD: {
        amount: 19999,
        includes_tax: false
      }
    },
    sku: 'BORN-ITEM-24',
    slug: 'unisex-blouse',
    status: 'live',
    tiers: {
      min_15: {
        minimum_quantity: 15,
        price: {
          EUR: {
            amount: 50,
            includes_tax: false
          },
          USD: {
            amount: 100,
            includes_tax: false
          }
        }
      },
      min_30: {
        minimum_quantity: 30,
        price: {
          EUR: {
            amount: 25,
            includes_tax: false
          },
          USD: {
            amount: 50,
            includes_tax: false
          }
        }
      }
    },
    updated_at: '2022-03-07T17:50:29.055Z'
  },
  meta: {
    catalog_id: 'e5d3e5aa-4871-4e71-8e11-8762ad899505',
    catalog_source: 'pim',
    pricebook_id: 'bd8597fa-60fc-4c29-b709-f372fef33bb4',
    tiers: {
      min_15: {
        display_price: {
          without_tax: {
            amount: 100,
            currency: 'USD',
            formatted: '$1.00'
          }
        }
      },
      min_30: {
        display_price: {
          without_tax: {
            amount: 50,
            currency: 'USD',
            formatted: '$0.50'
          }
        }
      }
    },
    display_price: {
      with_tax: {
        amount: 19999,
        currency: 'USD',
        formatted: '$199.99'
      },
      without_tax: {
        amount: 19999,
        currency: 'USD',
        formatted: '$199.99'
      }
    },
    variation_matrix: {
      '72771b45-5227-44e5-a0f8-4da9be6795a0': {
        '03b4985a-4a12-4cbc-88f5-d321f5fe1d9b': {
          'ca18dad8-3ba1-4a5d-94a6-b7c4842b1027':
            '6f21826c-8dd2-4e83-917d-6b6dede49546',
          'cb74e704-c980-4cae-b24d-9c40d35526f7':
            '21067e93-6f74-47f7-bbdc-11fbcaf170aa'
        },
        'ac0a8771-6ab1-4862-ab54-68cc3de2e04b': {
          'ca18dad8-3ba1-4a5d-94a6-b7c4842b1027':
            'd631ab52-1666-4db6-85e3-c40f7eaf7481',
          'cb74e704-c980-4cae-b24d-9c40d35526f7':
            '467922db-7a99-48dc-857b-2d11881de6a1'
        }
      },
      'a44ee867-b62a-4db6-9218-32212f1070f2': {
        '03b4985a-4a12-4cbc-88f5-d321f5fe1d9b': {
          'ca18dad8-3ba1-4a5d-94a6-b7c4842b1027':
            '343174fc-3a9f-4d51-b388-08ddbc8147fe',
          'cb74e704-c980-4cae-b24d-9c40d35526f7':
            '55bc057d-3a39-489a-bbb7-ae6bcb734cb3'
        },
        'ac0a8771-6ab1-4862-ab54-68cc3de2e04b': {
          'ca18dad8-3ba1-4a5d-94a6-b7c4842b1027':
            'f389a948-cb12-4bbc-89c7-92607bdc4f03',
          'cb74e704-c980-4cae-b24d-9c40d35526f7':
            'acf0fb6d-4e93-4feb-9aea-3c7c4ddbc97d'
        }
      }
    },
    variations: [
      {
        id: '91ed3c00-1fc7-4bf0-876f-dac423337ac3',
        name: 'Size',
        options: [
          {
            id: '03b4985a-4a12-4cbc-88f5-d321f5fe1d9b',
            description: 'Small',
            name: 'sm'
          },
          {
            id: 'ac0a8771-6ab1-4862-ab54-68cc3de2e04b',
            description: 'Large',
            name: 'lg'
          }
        ]
      },
      {
        id: '26fb9ca4-b4c2-4c8e-895f-71232ac6add8',
        name: 'Color',
        options: [
          {
            id: 'a44ee867-b62a-4db6-9218-32212f1070f2',
            description: 'red color',
            name: 'Red'
          },
          {
            id: '72771b45-5227-44e5-a0f8-4da9be6795a0',
            description: 'Blue color',
            name: 'Blue'
          }
        ]
      },
      {
        id: '7041e26c-b2d3-4eae-8be2-3c7286a3c2de',
        name: 'Material',
        options: [
          {
            id: 'ca18dad8-3ba1-4a5d-94a6-b7c4842b1027',
            description: 'Cotton',
            name: 'Cotton'
          },
          {
            id: 'cb74e704-c980-4cae-b24d-9c40d35526f7',
            description: 'Poliester',
            name: 'poliester'
          }
        ]
      }
    ]
  },
  relationships: {
    files: {
      data: [
        {
          created_at: '2021-09-09T13:44:15.894Z',
          id: '0f0c93f4-0b51-4a22-b8af-2e1d975a4ab5',
          type: 'file'
        }
      ]
    },
    main_image: {
      data: {
        id: '0f0c93f4-0b51-4a22-b8af-2e1d975a4ab5',
        type: 'main_image'
      }
    }
  },
  main_image: {
    type: 'file',
    id: '0f0c93f4-0b51-4a22-b8af-2e1d975a4ab5',
    link: {
      href: 'https://s3-eu-west-1.amazonaws.com/bkt-svc-files-cmty-api-moltin-com/2cb3362e-d6b4-4c39-9a4c-5b710421c554/0f0c93f4-0b51-4a22-b8af-2e1d975a4ab5.jpg'
    },
    file_name: 'Unisex Blouse_1.jpg',
    mime_type: 'image/jpeg',
    file_size: 8228,
    public: false,
    meta: {
      dimensions: {
        width: 300,
        height: 300
      },
      timestamps: {
        created_at: '2021-09-09T13:44:13.682Z'
      }
    },
    links: {
      self: 'https://api.moltin.com/v2/files/0f0c93f4-0b51-4a22-b8af-2e1d975a4ab5'
    }
  },
  files: [
    {
      type: 'file',
      id: '0f0c93f4-0b51-4a22-b8af-2e1d975a4ab5',
      link: {
        href: 'https://s3-eu-west-1.amazonaws.com/bkt-svc-files-cmty-api-moltin-com/2cb3362e-d6b4-4c39-9a4c-5b710421c554/0f0c93f4-0b51-4a22-b8af-2e1d975a4ab5.jpg'
      },
      file_name: 'Unisex Blouse_1.jpg',
      mime_type: 'image/jpeg',
      file_size: 8228,
      public: false,
      meta: {
        dimensions: {
          width: 300,
          height: 300
        },
        timestamps: {
          created_at: '2021-09-09T13:44:13.682Z'
        }
      },
      links: {
        self: 'https://api.moltin.com/v2/files/0f0c93f4-0b51-4a22-b8af-2e1d975a4ab5'
      }
    }
  ],
  inventory: {
    id: '0422759a-bde0-4736-9749-d8d77dfa44c5',
    type: 'stock',
    total: 151,
    available: 151,
    allocated: 0
  }
} as any;
