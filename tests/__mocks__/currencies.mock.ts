import { Currency } from '@vsf-enterprise/epcc-api';

export const currenciesMock: Currency[] = [
  {
    id: '4f616f71-6e0a-40ce-8833-abb553da6864',
    type: 'currency',
    code: 'USD',
    exchange_rate: 1,
    format: '${price}',
    decimal_point: '.',
    thousand_separator: ',',
    decimal_places: 2,
    default: true,
    enabled: true,
    links: {
      self: 'https://api.moltin.com/currencies/4f616f71-6e0a-40ce-8833-abb553da6864'
    },
    meta: {
      timestamps: {
        created_at: '2021-05-06T16:05:46.327Z',
        updated_at: '2022-05-03T13:57:20.042Z'
      }
    }
  },
  {
    id: 'e9200f6b-8725-44e1-9a63-5b9b0fad9a7c',
    type: 'currency',
    code: 'EUR',
    exchange_rate: 1.11,
    format: '€{price}',
    decimal_point: '.',
    thousand_separator: ',',
    decimal_places: 2,
    default: false,
    enabled: true,
    links: {
      self: 'https://api.moltin.com/currencies/e9200f6b-8725-44e1-9a63-5b9b0fad9a7c'
    },
    meta: {
      timestamps: {
        created_at: '2022-03-02T19:01:41.035Z',
        updated_at: '2022-05-03T13:56:16.928Z'
      }
    }
  },
  {
    id: '0d9471a5-4036-4070-9556-e887b6a4167e',
    type: 'currency',
    code: 'PLN',
    exchange_rate: 0.18,
    format: '{price} zł',
    decimal_point: '.',
    thousand_separator: ',',
    decimal_places: 0,
    default: false,
    enabled: true,
    links: {
      self: 'https://api.moltin.com/currencies/0d9471a5-4036-4070-9556-e887b6a4167e'
    },
    meta: {
      timestamps: {
        created_at: '2022-03-29T10:21:51.13Z',
        updated_at: '2022-03-29T11:37:53.927Z'
      }
    }
  }
];
