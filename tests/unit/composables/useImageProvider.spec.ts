import { expect } from '@jest/globals';
import { useImageProvider } from '@/composables';

jest.mock('@nuxtjs/composition-api');

const compositionApi = require('@nuxtjs/composition-api');

describe('[epcc-theme] useImageProvider', () => {

  describe('getImageUrl', () => {
    const link = 'test_link';
    const url = `https://test.dev/${link}`;

    it('should return the unchanged input if config not present', () => {
      compositionApi.useContext.mockImplementation(() => ({
        $img: {}
      }));
      const { getImageUrl } = useImageProvider();

      expect(getImageUrl(url)).toEqual(url);
    });

    it('should return modified url when config is present', () => {
      const uploadDir = 'test';

      compositionApi.useContext.mockImplementation(() => ({
        $img: {
          options: {
            provider: 'cloudinary',
            providers: {
              cloudinary: {
                defaults: {
                  storagePrefix: 'https://test.dev/',
                  uploadDir
                }
              }
            }
          }
        }
      }));

      const { getImageUrl } = useImageProvider();

      expect(getImageUrl(url)).toEqual(`${uploadDir}/${link}`);
    });
  });
});
