const NodeCache = require('node-cache');

/**
 * Each factory has to be synchronous function returning an object implementing StoreConfigCacheStorage interface.
 */
const storeConfigCacheStorageFactories = {
  async NODE_CACHE () {
    const client = new NodeCache({
      stdTTL: 10
    });

    return {
      async get(key) {
        return client.get(key);
      },
      async set(key, value) {
        return client.set(key, value);
      }
    };
  }
};

module.exports = {
  storeConfigCacheStorageFactory: storeConfigCacheStorageFactories.NODE_CACHE,
  async updateFn() {
    /**
     * This function will be able to perform some async logic for fetching configuration
     * data from any external source. From perspective of multistore API helper
     * the return from this function will be crucial.
     */
    return Promise.resolve({
      [process.env.EPCC_MULTISTORE_ONE_HOST]: {
        client_id: process.env.EPCC_MULTISTORE_ONE_CLIENT_ID,
        client_secret: process.env.EPCC_MULTISTORE_ONE_CLIENT_SECRET,
        publicConfig: {
          builderToken: 'some-test-token'
        }
      },
      [process.env.EPCC_MULTISTORE_TWO_HOST]: {
        client_id: process.env.EPCC_MULTISTORE_TWO_CLIENT_ID,
        client_secret: process.env.EPCC_MULTISTORE_TWO_CLIENT_SECRET,
        publicConfig: {
          builderToken: 'some-test-token-1',
          otherCMSToken: 'some-other-test-token'
        }
      },
      [process.env.EPCC_BASE_CDN_HOST]: {
        client_id: process.env.EPCC_MULTISTORE_ONE_CLIENT_ID,
        client_secret: process.env.EPCC_MULTISTORE_ONE_CLIENT_SECRET,
        publicConfig: {
          builderToken: 'some-test-token'
        }
      },
      [process.env.EPCC_BASE_HOST]: {
        client_id: process.env.EPCC_MULTISTORE_ONE_CLIENT_ID,
        client_secret: process.env.EPCC_MULTISTORE_ONE_CLIENT_SECRET,
        publicConfig: {
          builderToken: 'some-test-token-2',
          otherCMSToken: 'some-other-test-token-3'
        }
      }
    });
  }
};
