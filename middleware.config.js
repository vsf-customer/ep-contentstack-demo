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
    }
  }
};
