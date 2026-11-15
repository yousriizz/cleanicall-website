type ReviewSnapshot = {
  rating: number;
  count: number;
  fetchedAt: string;
  testimonials: readonly { id: string; author: string; text: string }[];
};

export const googleReviewsLinks = {
  listing: 'https://www.google.com/maps/place/CleanicAll/@48.6807825,2.5026637,9z/data=!3m1!4b1!4m6!3m5!1s0x80852271b41f62c1:0x1d90372ab875c9a9!8m2!3d48.6807824!4d2.5026636!16s%2Fg%2F11z8mdw5v1',
  write: 'https://g.page/r/CanJdbgqN5AdEAE/review',
};

export function getVerifiedGoogleReviews(): ReviewSnapshot | null {
  return null;
}
