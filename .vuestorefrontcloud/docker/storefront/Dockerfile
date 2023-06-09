FROM node:16-alpine as builder

ARG COMMIT
ARG NPM_USER
ARG NPM_PASS
ARG NPM_EMAIL
ARG NPM_REGISTRY
ARG API_BASE_URL
ARG API_SSR_BASE_URL
ARG EPCC_CLIENT_ID
ARG EPCC_CLIENT_SECRET
ARG EPCC_MULTISTORE_ONE_HOST
ARG EPCC_MULTISTORE_ONE_CLIENT_ID
ARG EPCC_MULTISTORE_ONE_CLIENT_SECRET
ARG EPCC_MULTISTORE_TWO_HOST
ARG EPCC_MULTISTORE_TWO_CLIENT_ID
ARG EPCC_MULTISTORE_TWO_CLIENT_SECRET
ARG EPCC_BASE_HOST
ARG EPCC_BASE_CDN_HOST
ARG NUXT_IMAGE_PROVIDER_BASE_URL
ARG NUXT_IMAGE_PROVIDER_STORAGE_PREFIX
ARG NUXT_IMAGE_PROVIDER_UPLOAD_DIR

ENV LAST_COMMIT=${COMMIT}
ENV API_BASE_URL=${API_BASE_URL}
ENV API_SSR_BASE_URL=${API_SSR_BASE_URL}
ENV EPCC_CLIENT_ID=${EPCC_CLIENT_ID}
ENV EPCC_CLIENT_SECRET=${EPCC_CLIENT_SECRET}
ENV EPCC_MULTISTORE_ONE_HOST=${EPCC_MULTISTORE_ONE_HOST}
ENV EPCC_MULTISTORE_ONE_CLIENT_ID=${EPCC_MULTISTORE_ONE_CLIENT_ID}
ENV EPCC_MULTISTORE_ONE_CLIENT_SECRET=${EPCC_MULTISTORE_ONE_CLIENT_SECRET}
ENV EPCC_MULTISTORE_TWO_HOST=${EPCC_MULTISTORE_TWO_HOST}
ENV EPCC_MULTISTORE_TWO_CLIENT_ID=${EPCC_MULTISTORE_TWO_CLIENT_ID}
ENV EPCC_MULTISTORE_TWO_CLIENT_SECRET=${EPCC_MULTISTORE_TWO_CLIENT_SECRET}
ENV EPCC_BASE_HOST=${EPCC_BASE_HOST}
ENV EPCC_BASE_CDN_HOST=${EPCC_BASE_CDN_HOST}
ENV NUXT_IMAGE_PROVIDER_BASE_URL=${NUXT_IMAGE_PROVIDER_BASE_URL}
ENV NUXT_IMAGE_PROVIDER_STORAGE_PREFIX=${NUXT_IMAGE_PROVIDER_STORAGE_PREFIX}
ENV NUXT_IMAGE_PROVIDER_UPLOAD_DIR=${NUXT_IMAGE_PROVIDER_UPLOAD_DIR}
ENV NODE_OPTIONS="--max-old-space-size=8192"

RUN npm install -g npm-cli-login && npm-cli-login

WORKDIR /var/www

COPY . .

RUN yarn install
RUN yarn build
RUN yarn install --production
RUN find . -type d -name "*test*" -not -path '*/node_modules/*' -exec rm -rf {} +

# Final application image
FROM node:16-alpine

ARG API_BASE_URL
ARG API_SSR_BASE_URL
ARG NUXT_VERSION=2.15.8

ENV API_BASE_URL=${API_BASE_URL}
ENV API_SSR_BASE_URL=${API_SSR_BASE_URL}
ENV NUXT_VERSION=${NUXT_VERSION}

WORKDIR /var/www

COPY --from=builder /var/www/. .
COPY .vuestorefrontcloud/docker/storefront/vue-storefront.sh /usr/local/bin/

RUN chmod a+x /usr/local/bin/vue-storefront.sh

ENTRYPOINT ["vue-storefront.sh"]
