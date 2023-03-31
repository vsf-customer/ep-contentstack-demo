import type { TODO } from '@vsf-enterprise/epcc-api';
import type { UseReview, UseReviewErrors } from './types';
import { computed, ref, Ref } from '@nuxtjs/composition-api';

/**
 * @public
 *
 * The `useReview` composable allows searching and adding reviews from/to Elastic Path API.
 * Provides the search and addReview functions and refs for the reviews, loading, and error.
 */
export function useReview(): UseReview {
  const reviews: Ref<TODO> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<UseReviewErrors> = ref({
    search: null,
    addReview: null
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const search = async (params) => {
    try {
      loading.value = true;
      // TODO: Implement search
      reviews.value = {};
      error.value.search = null;
    } catch (err) {
      error.value.search = err;
    } finally {
      loading.value = false;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const addReview = async (params) => {
    try {
      loading.value = true;
      // TODO: Implement addReview
      reviews.value = {};
      error.value.addReview = null;
    } catch (err) {
      error.value.addReview = err;
    } finally {
      loading.value = false;
    }
  };

  return {
    search,
    addReview,
    error: computed(() => error.value),
    loading: computed(() => loading.value),
    reviews: computed(() => reviews.value)
  };
}

export * from './types';
