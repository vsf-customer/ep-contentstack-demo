import type { TODO } from '@vsf-enterprise/epcc-api';
import type { ComputedRef } from '@nuxtjs/composition-api';

export interface UseReviewErrors {
  search: Error;
  addReview: Error;
}

export interface UseReview {
  reviews: ComputedRef<TODO>;
  loading: ComputedRef<boolean>;
  error: ComputedRef<UseReviewErrors>;
  search: (params: TODO) => Promise<TODO>;
  addReview: (params: TODO) => Promise<TODO>;
}
