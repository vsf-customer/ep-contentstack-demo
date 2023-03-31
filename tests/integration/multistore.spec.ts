import buildApp from '../../middleware';
import request from 'supertest';
import { expect } from '@jest/globals';
import { storesMock } from '../__mocks__/multistore.mock';
import nock from 'nock';
import { Express } from 'express';
const { integrations } = require('../../middleware.config');
const multistoreConfig = require('../../multistore.config');

jest.mock('../../multistore.config.js', () => ({
  storeConfigCacheStorageFactory: jest.requireActual('../../multistore.config.js').storeConfigCacheStorageFactory,
  updateFn: () => storesMock
}));

describe('multistore', () => {

  let app: Express;
  beforeEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
  });

  beforeAll(async (): Promise<void> => {
    Object.assign(integrations.epcc.configuration, {
      multistore: {
        ...multistoreConfig,
        updateFn: () => storesMock
      }
    });
    app = await buildApp({ integrations });
  });

  const baseOauthResponse = {
    token_type: 'Bearer',
    expires_in: 3600,
    expires: 1664382992,
    identifier: 'client_credentials',
    access_token: null
  };

  const baseGetProductPayload = {
    withConnectedProducts: false,
    withInventory: false,
    locale: 'en'
  };

  describe('First store', () => {
    it('Based on Host header, middleware resolves proper client, authenticates, and gives response from the store', async () => {
      const productId = 'some-product-123';
      const accessToken = '5ce79e4db718626d6ded21da316d471468655510';
      nock('https://api.moltin.com')
        .post('/oauth/access_token', body => {
          return body.grant_type === 'client_credentials' &&
            body.client_id === storesMock['electric-store'].client_id &&
            body.client_secret === storesMock['electric-store'].client_secret;
        })
        .reply(200, {
          ...baseOauthResponse,
          access_token: accessToken
        });
      nock('https://api.moltin.com', {
        reqheaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .get(`/catalog/products/${productId}`)
        .query(true)
        .reply(200, {
          data: {
            id: productId,
            name: 'Some product 123'
          }
        });

      const { status, body } = await request(app).post('/epcc/getProduct')
        .set({
          Host: 'electric-store'
        })
        .send([
          {
            ...baseGetProductPayload,
            id: productId
          }
        ]);

      expect(status).toBe(200);
      expect(body.name).toBe('Some product 123');
    });

    it('Based on Origin header, middleware resolves proper client, authenticates, and gives response from the store', async () => {
      const productId = 'some-product-123';
      const accessToken = 'aaaa5ce79e4db718626d6ded21da316d471468655510';
      nock('https://api.moltin.com')
        .post('/oauth/access_token', body => {
          return body.grant_type === 'client_credentials' &&
            body.client_id === storesMock['electric-store'].client_id &&
            body.client_secret === storesMock['electric-store'].client_secret;
        })
        .reply(200, {
          ...baseOauthResponse,
          access_token: accessToken
        });
      nock('https://api.moltin.com', {
        reqheaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .get(`/catalog/products/${productId}`).query(true).reply(200, {
          data: {
            id: productId,
            name: 'Some product 123'
          }
        });

      const { status, body } = await request(app).post('/epcc/getProduct')
        .set({
          Origin: 'https://electric-store'
        })
        .send([
          {
            ...baseGetProductPayload,
            id: productId
          }
        ]);

      expect(status).toBe(200);
      expect(body.name).toBe('Some product 123');
    });

    it('Based on Host header, POST /epcc/getCurrentStorePublicConfig endpoint returns only public configuration', async () => {
      const { status, body } = await request(app).post('/epcc/getCurrentStorePublicConfig')
        .set({
          Host: 'electric-store'
        })
        .send([]);

      expect(status).toBe(200);
      expect(body).toEqual(storesMock['electric-store'].publicConfig);
      expect(body).not.toEqual(expect.objectContaining(storesMock['electric-store']));
    });

    it('Based on Origin header, POST /epcc/getCurrentStorePublicConfig endpoints returns only public configuration', async () => {
      const { status, body } = await request(app).post('/epcc/getCurrentStorePublicConfig')
        .set({
          Origin: 'https://electric-store'
        })
        .send([]);

      expect(status).toBe(200);
      expect(body).toEqual(storesMock['electric-store'].publicConfig);
      expect(body).not.toEqual(expect.objectContaining(storesMock['electric-store']));
    });
  });

  describe('Second store', () => {
    it('Based on Host header, middleware resolves proper client, authenticates, and gives response from the store', async () => {
      const productId = 'awesome-product-456';
      const accessToken = 'Dsd23e79e565626d6ded21da316d471468655510';
      nock('https://api.moltin.com')
        .post('/oauth/access_token', body => {
          return body.grant_type === 'client_credentials' &&
            body.client_id === storesMock['grocery-shop'].client_id &&
            body.client_secret === storesMock['grocery-shop'].client_secret;
        })
        .reply(200, {
          ...baseOauthResponse,
          access_token: accessToken
        });
      nock('https://api.moltin.com', {
        reqheaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .get(`/catalog/products/${productId}`).query(true).reply(200, {
          data: {
            id: productId,
            name: 'Awesome product 456'
          }
        });

      const { status, body } = await request(app).post('/epcc/getProduct')
        .set({
          Host: 'grocery-shop'
        })
        .send([
          {
            ...baseGetProductPayload,
            id: productId
          }
        ]);

      expect(status).toBe(200);
      expect(body.name).toBe('Awesome product 456');
    });

    it('Based on Origin header, middleware resolves proper client, authenticates, and gives response from the store', async () => {
      const productId = 'awesome-product-456';
      const accessToken = '668adsdasd5ce79e6d6ded21da316d471468655510';
      nock('https://api.moltin.com')
        .post('/oauth/access_token', body => {
          return body.grant_type === 'client_credentials' &&
            body.client_id === storesMock['grocery-shop'].client_id &&
            body.client_secret === storesMock['grocery-shop'].client_secret;
        })
        .reply(200, {
          ...baseOauthResponse,
          access_token: accessToken
        });
      nock('https://api.moltin.com', {
        reqheaders: {
          Authorization: `Bearer ${accessToken}`
        }
      })
        .get(`/catalog/products/${productId}`).query(true).reply(200, {
          data: {
            id: productId,
            name: 'Awesome product 456'
          }
        });

      const { status, body } = await request(app).post('/epcc/getProduct')
        .set({
          Origin: 'https://grocery-shop'
        })
        .send([
          {
            ...baseGetProductPayload,
            id: productId
          }
        ]);

      expect(status).toBe(200);
      expect(body.name).toBe('Awesome product 456');
    });

    it('Based on Host header, POST /epcc/getCurrentStorePublicConfig endpoint returns only public configuration', async () => {
      const { status, body } = await request(app).post('/epcc/getCurrentStorePublicConfig')
        .set({
          Host: 'grocery-shop'
        })
        .send([]);

      expect(status).toBe(200);
      expect(body).toEqual(storesMock['grocery-shop'].publicConfig);
      expect(body).not.toEqual(expect.objectContaining(storesMock['grocery-shop']));
    });

    it('Based on Origin header, POST /epcc/getCurrentStorePublicConfig endpoints returns only public configuration', async () => {
      const { status, body } = await request(app).post('/epcc/getCurrentStorePublicConfig')
        .set({
          Origin: 'https://grocery-shop'
        })
        .send([]);

      expect(status).toBe(200);
      expect(body).toEqual(storesMock['grocery-shop'].publicConfig);
      expect(body).not.toEqual(expect.objectContaining(storesMock['grocery-shop']));
    });
  });

  describe('Empty headers sent', () => {

    it('Middleware resolver doesn\'t crash, gives 200, and empty body', async () => {
      const { status, body } = await request(app).post('/epcc/getProduct')
        .set({
          Host: '',
          Origin: ''
        })
        .send([
          {
            ...baseGetProductPayload,
            id: 'awesome-product-456'
          }
        ]);

      expect(status).toBe(200);
      expect(body).toEqual({});
    });

    it('POST /epcc/getCurrentStorePublicConfig doesn\'t crash, gives 400', async () => {
      const { status, body } = await request(app).post('/epcc/getCurrentStorePublicConfig')
        .set({
          Host: '',
          Origin: ''
        })
        .send([]);

      expect(status).toBe(400);
      expect(body).toEqual({
        code: 400
      });
    });
  });

  describe('No matching configuration', () => {

    it('Middleware resolver doesn\'t crash, gives 200, and empty body', async () => {
      const { status, body } = await request(app).post('/epcc/getProduct')
        .set({
          Host: 'not-existing',
          Origin: 'https://not-exisitng'
        })
        .send([
          {
            ...baseGetProductPayload,
            id: 'awesome-product-456'
          }
        ]);

      expect(status).toBe(200);
      expect(body).toEqual({});
    });

    it('POST /epcc/getCurrentStorePublicConfig doesn\'t crash, gives 404', async () => {
      const { status, body } = await request(app).post('/epcc/getCurrentStorePublicConfig')
        .set({
          Host: 'not-existing',
          Origin: 'https://not-exisitng'
        })
        .send([]);

      expect(status).toBe(404);
      expect(body).toEqual({ code: 404 });
    });
  });

  describe('Parallely', () => {

    it('Multiple requests to the POST /epcc/getCurrentStorePublicConfig endpoint sent', async () => {
      const test = {
        promises: [
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Host: 'grocery-shop' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Host: 'electric-store' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Host: '' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Host: 'not-existing' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Origin: 'https://grocery-shop' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Origin: 'https://electric-store' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Origin: '' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Origin: 'not-existing' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Origin: 'http://grocery-shop' }).send([]),
          request(app).post('/epcc/getCurrentStorePublicConfig').set({ Origin: 'http://electric-store' }).send([])
        ],
        expected: [
          { status: 200, body: storesMock['grocery-shop'].publicConfig },
          { status: 200, body: storesMock['electric-store'].publicConfig },
          { status: 400, body: { code: 400 } },
          { status: 404, body: { code: 404 } },
          { status: 200, body: storesMock['grocery-shop'].publicConfig },
          { status: 200, body: storesMock['electric-store'].publicConfig },
          { status: 400, body: { code: 400 } },
          { status: 404, body: { code: 404 } },
          { status: 200, body: storesMock['grocery-shop'].publicConfig },
          { status: 200, body: storesMock['electric-store'].publicConfig }
        ]
      };

      const responses = await Promise.all(test.promises);

      for (let i = 0; i < responses.length; i++) {
        expect(responses[i].status).toBe(test.expected[i].status);
        expect(responses[i].body).toEqual(test.expected[i].body);
      }
    });

    it('Multiple requests to the middleware sent', async () => {
      const firstStore = {
        productId: 'first-store-product-1',
        productName: 'First Store Product 1',
        accessToken: '342398fghuvndskufawle0945',
        oauthRequestChecker: body => body.client_id === storesMock['electric-store'].client_id,
        oauthRequestScope: null,
        productRequestScope: null

      };
      const secondStore = {
        productId: 'second-store-product-1',
        productName: 'Second Store Product 1',
        accessToken: '878fgf78798fghuvndskufawle0945',
        oauthRequestChecker: body => body.client_id === storesMock['grocery-shop'].client_id,
        oauthRequestScope: null,
        productRequestScope: null
      };
      nock('https://api.moltin.com')
        .persist()
        .post('/oauth/access_token', firstStore.oauthRequestChecker)
        .reply(200, {
          ...baseOauthResponse,
          access_token: firstStore.accessToken
        });
      nock('https://api.moltin.com')
        .persist()
        .post('/oauth/access_token', secondStore.oauthRequestChecker)
        .reply(200, {
          ...baseOauthResponse,
          access_token: secondStore.accessToken
        });
      nock('https://api.moltin.com', {
        reqheaders: {
          Authorization: `Bearer ${firstStore.accessToken}`
        }
      })
        .persist()
        .get(`/catalog/products/${firstStore.productId}`)
        .query(true)
        .reply(200, {
          data: {
            id: firstStore.productId,
            name: firstStore.productName
          }
        });
      nock('https://api.moltin.com', {
        reqheaders: {
          Authorization: `Bearer ${secondStore.accessToken}`
        }
      })
        .persist()
        .get(`/catalog/products/${secondStore.productId}`)
        .query(true)
        .reply(200, {
          data: {
            id: secondStore.productId,
            name: secondStore.productName
          }
        });

      const promises = [
        request(app).post('/epcc/getProduct')
          .set({
            Host: 'electric-store'
          })
          .send([
            {
              ...baseGetProductPayload,
              id: firstStore.productId
            }
          ]),

        request(app).post('/epcc/getProduct')
          .set({
            Host: 'grocery-shop'
          })
          .send([
            {
              ...baseGetProductPayload,
              id: secondStore.productId
            }
          ]),

        request(app).post('/epcc/getProduct')
          .set({
            Host: 'electric-store'
          })
          .send([
            {
              ...baseGetProductPayload,
              id: firstStore.productId
            }
          ]),

        request(app).post('/epcc/getProduct')
          .set({
            Host: 'grocery-shop'
          })
          .send([
            {
              ...baseGetProductPayload,
              id: secondStore.productId
            }
          ])
      ];

      const expected = [
        {
          status: 200,
          body: {
            id: firstStore.productId,
            name: firstStore.productName
          }
        },
        {
          status: 200,
          body: {
            id: secondStore.productId,
            name: secondStore.productName
          }
        },
        {
          status: 200,
          body: {
            id: firstStore.productId,
            name: firstStore.productName
          }
        },
        {
          status: 200,
          body: {
            id: secondStore.productId,
            name: secondStore.productName
          }
        }
      ];

      const responses = await Promise.all(promises);

      for (let i = 0; i < expected.length; i++) {
        expect(responses[i].status).toBe(expected[i].status);
        expect(responses[i].body).toEqual(expected[i].body);
      }
    });

  });
});
