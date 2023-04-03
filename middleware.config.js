require('dotenv').config();
const multistore = require('./multistore.config');

module.exports = {
  integrations: {
    epcc: {
      location: '@vsf-enterprise/epcc-api/server',
      configuration: {
        multistore,
        client_id: process.env.EPCC_CLIENT_ID,
        client_secret: process.env.EPCC_CLIENT_SECRET,
        secure_cookies: process.env.NODE_ENV === 'production',
        forgotten_password_token_expiration: '10m',
        tax_data: {
          en: {
            default: {
              rate: 0.2
            },
            reduced: {
              rate: 0.3
            }
          },
          pl: {
            default: {
              rate: 0.23
            },
            medical: {
              rate: 0.08
            }
          }
        }
      }
    },
    cnts: {
      location: '@vsf-enterprise/contentstack/server',
      configuration: {
        key: 'blt3091cc6736f3ea7c',
        token: 'cse12957be26820aac56a2ec8a',
        env: 'development',
        live_preview: {
          management_token: 'csa2645247422d5d1822165cbb',
          enable: true,
          host: 'api.contentstack.io'
        },
        fetchOptions: {
          timeout: 30000,
          retryLimit: 5,
          retryDelay: 300,
          // eslint-disable-next-line no-undef, no-unused-vars, @typescript-eslint/no-unused-vars
          retryCondition: (error) => boolean
        }
      }
    }
  }
};
