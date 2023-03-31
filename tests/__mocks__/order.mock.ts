import { Order, OrderItem } from '@vsf-enterprise/epcc-api';

export const orderMock = {
  id: 'ea63de48-e444-4c91-b0e9-e87fe1806310',
  type: 'order',
  consignment_id: '0',
  shipping_provider: null,
  status: 'incomplete',
  payment: 'unpaid',
  shipping: 'unfulfilled',
  anonymized: false,
  customer: {
    name: 'Gregory Sauer',
    email: 'your.email+fakedata28645@gmail.com'
  },
  shipping_address: {
    first_name: 'Milan',
    last_name: 'Rippin',
    phone_number: '',
    company_name: '',
    line_1: '11328 Pfannerstill Mountain',
    line_2: '',
    city: 'New Caitlynburgh',
    postcode: '84829',
    county: 'Eastern',
    country: 'KH',
    instructions: ''
  },
  billing_address: {
    first_name: 'Milan',
    last_name: 'Rippin',
    company_name: '',
    line_1: '11328 Pfannerstill Mountain',
    line_2: '',
    city: 'New Caitlynburgh',
    postcode: '84829',
    county: 'Eastern',
    country: 'KH'
  },
  links: {},
  meta: {
    display_price: {
      with_tax: {
        amount: 20221,
        currency: 'USD',
        formatted: '$202.21'
      },
      without_tax: {
        amount: 20221,
        currency: 'USD',
        formatted: '$202.21'
      },
      tax: {
        amount: 0,
        currency: 'USD',
        formatted: '$0.00'
      },
      discount: {
        amount: -100000,
        currency: 'USD',
        formatted: '-$1,000.00'
      }
    },
    timestamps: {
      created_at: '2022-04-14T12:47:53Z',
      updated_at: '2022-04-14T12:47:53Z'
    }
  },
  relationships: {
    items: {
      data: [
        {
          type: 'item',
          id: '169a0658-1c19-46d5-ac95-a75e66c2df58'
        },
        {
          type: 'item',
          id: '71bc761b-7868-406c-b13b-556b523a84f8'
        },
        {
          type: 'item',
          id: 'cac641ad-4878-4231-81a9-3e11a722b7d6'
        },
        {
          type: 'item',
          id: 'e1fc0df3-87ea-4a9e-9156-040fca5fc014'
        },
        {
          type: 'item',
          id: 'cfce4cb9-73ea-4bba-9b6c-bcca902f8450'
        }
      ]
    }
  }
} as unknown as Order;

export const orderItemsMock = [
  {
    type: 'order_item',
    id: '169a0658-1c19-46d5-ac95-a75e66c2df58',
    quantity: 2,
    product_id: 'f2d559f2-58b0-4098-bd83-a2c5f978d971',
    name: 'Baseball Cap',
    sku: 'BORN-ITEM-1',
    unit_price: {
      amount: 12000,
      currency: 'USD',
      includes_tax: false
    },
    value: {
      amount: 24000,
      currency: 'USD',
      includes_tax: false
    },
    links: {},
    meta: {
      display_price: {
        with_tax: {
          unit: {
            amount: 2018,
            currency: 'USD',
            formatted: '$20.18'
          },
          value: {
            amount: 4036,
            currency: 'USD',
            formatted: '$40.36'
          }
        },
        without_tax: {
          unit: {
            amount: 2018,
            currency: 'USD',
            formatted: '$20.18'
          },
          value: {
            amount: 4036,
            currency: 'USD',
            formatted: '$40.36'
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
            amount: -9982,
            currency: 'USD',
            formatted: '-$99.82'
          },
          value: {
            amount: -19964,
            currency: 'USD',
            formatted: '-$199.64'
          }
        }
      },
      timestamps: {
        created_at: '2022-04-14T12:47:53Z',
        updated_at: '2022-04-14T12:47:53Z'
      }
    },
    relationships: {
      cart_item: {
        data: {
          type: 'cart_item',
          id: '2df7ea9a-3cdb-4e7e-afa1-c2dc616fe271'
        }
      }
    }
  },
  {
    type: 'order_item',
    id: '71bc761b-7868-406c-b13b-556b523a84f8',
    quantity: 1,
    product_id: '8a998780-db58-496c-aa75-cbae71703de7',
    name: 'test',
    sku: '69REEU',
    unit_price: {
      amount: -100000,
      currency: 'USD',
      includes_tax: false
    },
    value: {
      amount: -100000,
      currency: 'USD',
      includes_tax: false
    },
    links: {},
    meta: {
      display_price: {
        with_tax: {
          unit: {
            amount: -100000,
            currency: 'USD',
            formatted: '-$1,000.00'
          },
          value: {
            amount: -100000,
            currency: 'USD',
            formatted: '-$1,000.00'
          }
        },
        without_tax: {
          unit: {
            amount: -100000,
            currency: 'USD',
            formatted: '-$1,000.00'
          },
          value: {
            amount: -100000,
            currency: 'USD',
            formatted: '-$1,000.00'
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
        created_at: '2022-04-14T12:47:53Z',
        updated_at: '2022-04-14T12:47:53Z'
      }
    },
    relationships: {
      cart_item: {
        data: {
          type: 'cart_item',
          id: 'f833751a-9f1e-40f8-82f8-6ae4862a41c7'
        }
      }
    }
  },
  {
    type: 'order_item',
    id: 'cac641ad-4878-4231-81a9-3e11a722b7d6',
    quantity: 1,
    product_id: '27282056-84ee-4227-9b26-c04db4f7a1db',
    name: 'Shorts Bundle',
    sku: 'BORN-ITEM-SHORTS-BUNDLE',
    unit_price: {
      amount: 52561,
      currency: 'USD',
      includes_tax: false
    },
    value: {
      amount: 52561,
      currency: 'USD',
      includes_tax: false
    },
    components: {
      'Shorts 1': {
        name: 'Shorts 1',
        options: [
          {
            id: 'b46312a2-72b6-4bdc-aac8-f9136a835649',
            type: 'product',
            quantity: 1
          }
        ]
      },
      'Shorts 2': {
        name: 'Shorts 2',
        options: [
          {
            id: 'b222abb4-ab84-4013-9992-4324ed01a9f3',
            type: 'product',
            quantity: 1
          }
        ]
      }
    },
    links: {},
    meta: {
      display_price: {
        with_tax: {
          unit: {
            amount: 8840,
            currency: 'USD',
            formatted: '$88.40'
          },
          value: {
            amount: 8840,
            currency: 'USD',
            formatted: '$88.40'
          }
        },
        without_tax: {
          unit: {
            amount: 8840,
            currency: 'USD',
            formatted: '$88.40'
          },
          value: {
            amount: 8840,
            currency: 'USD',
            formatted: '$88.40'
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
            amount: -43721,
            currency: 'USD',
            formatted: '-$437.21'
          },
          value: {
            amount: -43721,
            currency: 'USD',
            formatted: '-$437.21'
          }
        }
      },
      timestamps: {
        created_at: '2022-04-14T12:47:53Z',
        updated_at: '2022-04-14T12:47:53Z'
      }
    },
    relationships: {
      cart_item: {
        data: {
          type: 'cart_item',
          id: 'e83c2795-9c93-4ffd-8498-96d3523f6cf4'
        }
      }
    }
  },
  {
    type: 'order_item',
    id: 'e1fc0df3-87ea-4a9e-9156-040fca5fc014',
    quantity: 4,
    product_id: '4f73cc82-5ec5-49cb-bcbc-2cc5fa9e2645',
    name: 'Shirt Red',
    sku: 'BORN-ITEM-4Bluepoliester',
    unit_price: {
      amount: 10540,
      currency: 'USD',
      includes_tax: false
    },
    value: {
      amount: 42160,
      currency: 'USD',
      includes_tax: false
    },
    links: {},
    meta: {
      display_price: {
        with_tax: {
          unit: {
            amount: 1773,
            currency: 'USD',
            formatted: '$17.73'
          },
          value: {
            amount: 7092,
            currency: 'USD',
            formatted: '$70.92'
          }
        },
        without_tax: {
          unit: {
            amount: 1773,
            currency: 'USD',
            formatted: '$17.73'
          },
          value: {
            amount: 7092,
            currency: 'USD',
            formatted: '$70.92'
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
            amount: -8767,
            currency: 'USD',
            formatted: '-$87.67'
          },
          value: {
            amount: -35068,
            currency: 'USD',
            formatted: '-$350.68'
          }
        }
      },
      timestamps: {
        created_at: '2022-04-14T12:47:53Z',
        updated_at: '2022-04-14T12:47:53Z'
      }
    },
    relationships: {
      cart_item: {
        data: {
          type: 'cart_item',
          id: '078261c4-5bad-4f23-82fa-d8e3ff8306ba'
        }
      }
    }
  },
  {
    type: 'order_item',
    id: 'cfce4cb9-73ea-4bba-9b6c-bcca902f8450',
    quantity: 3,
    product_id: 'b5cc19ae-867b-4043-addb-c85a2d154b38',
    name: 'Watch',
    sku: 'BORN-ITEM-14',
    unit_price: {
      amount: 500,
      currency: 'USD',
      includes_tax: false
    },
    value: {
      amount: 1500,
      currency: 'USD',
      includes_tax: false
    },
    links: {},
    meta: {
      display_price: {
        with_tax: {
          unit: {
            amount: 84,
            currency: 'USD',
            formatted: '$0.84'
          },
          value: {
            amount: 252,
            currency: 'USD',
            formatted: '$2.52'
          }
        },
        without_tax: {
          unit: {
            amount: 84,
            currency: 'USD',
            formatted: '$0.84'
          },
          value: {
            amount: 252,
            currency: 'USD',
            formatted: '$2.52'
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
            amount: -416,
            currency: 'USD',
            formatted: '-$4.16'
          },
          value: {
            amount: -1248,
            currency: 'USD',
            formatted: '-$12.48'
          }
        }
      },
      timestamps: {
        created_at: '2022-04-14T12:47:53Z',
        updated_at: '2022-04-14T12:47:53Z'
      }
    },
    relationships: {
      cart_item: {
        data: {
          type: 'cart_item',
          id: '2ba0f246-c507-4a47-9a4b-828390e53f25'
        }
      }
    }
  }
] as OrderItem[];
