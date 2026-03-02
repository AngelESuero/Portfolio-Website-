export type HomePhotoTone = 'cool' | 'warm' | 'neutral';

export interface HomePhotoCollageSlot {
  id: string;
  src: string;
  focus?: string;
  x: string;
  y: string;
  width: string;
  height: string;
  mobileX?: string;
  mobileY?: string;
  mobileWidth?: string;
  mobileHeight?: string;
  rotate?: string;
  opacity?: number;
  blur?: string;
  tone?: HomePhotoTone;
}

const fallbackPhoto = '/images/bg-station.jpg';

// Replace these `src` values with files you add under `/public/images/home-collage/`.
export const homePhotoCollageSlots: HomePhotoCollageSlot[] = [
  {
    id: 'anchor',
    src: fallbackPhoto,
    focus: '50% 58%',
    x: '50%',
    y: '54%',
    width: 'min(72vw, 56rem)',
    height: 'clamp(15rem, 34vw, 24rem)',
    mobileX: '50%',
    mobileY: '44%',
    mobileWidth: '92%',
    mobileHeight: '14rem',
    rotate: '-1.4deg',
    opacity: 0.34,
    tone: 'cool'
  },
  {
    id: 'portrait-left',
    src: fallbackPhoto,
    focus: '32% 38%',
    x: '18%',
    y: '31%',
    width: 'clamp(8rem, 14vw, 12rem)',
    height: 'clamp(11rem, 24vw, 16rem)',
    mobileX: '15%',
    mobileY: '27%',
    mobileWidth: '5.5rem',
    mobileHeight: '8.25rem',
    rotate: '-8deg',
    opacity: 0.26,
    blur: '1px',
    tone: 'neutral'
  },
  {
    id: 'portrait-right',
    src: fallbackPhoto,
    focus: '72% 46%',
    x: '84%',
    y: '36%',
    width: 'clamp(9rem, 15vw, 13rem)',
    height: 'clamp(12rem, 25vw, 17rem)',
    mobileX: '85%',
    mobileY: '30%',
    mobileWidth: '5.9rem',
    mobileHeight: '8.6rem',
    rotate: '6deg',
    opacity: 0.23,
    blur: '2px',
    tone: 'warm'
  },
  {
    id: 'square-accent',
    src: fallbackPhoto,
    focus: '58% 82%',
    x: '70%',
    y: '70%',
    width: 'clamp(7rem, 13vw, 11rem)',
    height: 'clamp(7rem, 13vw, 11rem)',
    mobileX: '77%',
    mobileY: '66%',
    mobileWidth: '5.5rem',
    mobileHeight: '5.5rem',
    rotate: '4deg',
    opacity: 0.21,
    blur: '3px',
    tone: 'cool'
  }
];
