import { useContext } from '@nuxtjs/composition-api';
import { UseImageProvider } from '~/composables/useImageProvider/types';

export function useImageProvider (): UseImageProvider {
  const { $img } = useContext();
  const imgProvider = $img?.options?.provider;
  const defaults = $img?.options?.providers[imgProvider]?.defaults;
  const baseURL = defaults?.baseURL ?? null;
  const storagePrefix = defaults?.storagePrefix ?? null;
  const uploadDir = `${defaults?.uploadDir}/` ?? null;

  const getImageUrl = (url, fullURL = false) => {
    return storagePrefix && uploadDir
      ? `${fullURL ? baseURL : ''}${url.split(storagePrefix).join(uploadDir)}`
      : url;
  };

  return {
    getImageUrl
  };
}
