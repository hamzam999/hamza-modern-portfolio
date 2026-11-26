/**
 * Decorative Urdu words (Nastaliq). Every word is aria-hidden on the page and carries lang="ur" dir="rtl".
 * `scripts/build-urdu.mjs` reads this file to subset the font and to shape outlines for the Open Graph cards.
 */
export const URDU = {
  spawn: 'آغاز', // beginning
  origin: 'تعارف', // introduction, about
  skills: 'ہنر', // skill
  archive: 'کام', // work
  career: 'سفر', // journey
  contact: 'رابطہ', // connect
  arcade: 'کھیل', // play
  notFound: 'گم', // lost
} as const;

export type UrduWord = (typeof URDU)[keyof typeof URDU];
