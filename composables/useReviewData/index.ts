import type { Review, ReviewItem } from '@vsf-enterprise/epcc-api';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useReviewData = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getItems(review: Review): ReviewItem[] {
    return [];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getReviewId(item: ReviewItem): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getReviewAuthor(item: ReviewItem): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getReviewMessage(item: ReviewItem): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getReviewRating(item: ReviewItem): number {
    return 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getReviewDate(item: ReviewItem): string {
    return '';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getTotalReviews(review: Review): number {
    return 0;
  }

  return {
    getItems,
    getReviewId,
    getReviewAuthor,
    getReviewMessage,
    getReviewRating,
    getReviewDate,
    getTotalReviews
  };
};
