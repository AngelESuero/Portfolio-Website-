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

export const homePhotoCollageSlots: HomePhotoCollageSlot[] = [
  {
    id: 'anchor',
    src: '/images/home-collage/download-7.png',
    focus: '50% 58%',
    x: '50%',
    y: '55%',
    width: 'min(72vw, 56rem)',
    height: 'clamp(15rem, 34vw, 24rem)',
    mobileX: '50%',
    mobileY: '45%',
    mobileWidth: '92%',
    mobileHeight: '14rem',
    rotate: '-1.75deg',
    opacity: 0.58,
    tone: 'cool'
  },
  {
    id: 'sky-strip',
    src: '/images/home-collage/download-1.png',
    focus: '50% 24%',
    x: '32%',
    y: '23%',
    width: 'clamp(18rem, 34vw, 32rem)',
    height: 'clamp(3.4rem, 8vw, 5.75rem)',
    mobileX: '32%',
    mobileY: '20%',
    mobileWidth: '12rem',
    mobileHeight: '3rem',
    rotate: '1.5deg',
    opacity: 0.34,
    blur: '0px',
    tone: 'cool'
  },
  {
    id: 'portrait-left',
    src: '/images/home-collage/download-2.png',
    focus: '52% 34%',
    x: '17%',
    y: '33%',
    width: 'clamp(8rem, 14vw, 12rem)',
    height: 'clamp(11rem, 24vw, 16rem)',
    mobileX: '14%',
    mobileY: '28%',
    mobileWidth: '5.5rem',
    mobileHeight: '8.25rem',
    rotate: '-9deg',
    opacity: 0.46,
    blur: '0.5px',
    tone: 'neutral'
  },
  {
    id: 'portrait-right',
    src: '/images/home-collage/download-3.png',
    focus: '48% 34%',
    x: '83%',
    y: '35%',
    width: 'clamp(9rem, 15vw, 13rem)',
    height: 'clamp(12rem, 25vw, 17rem)',
    mobileX: '86%',
    mobileY: '31%',
    mobileWidth: '5.9rem',
    mobileHeight: '8.6rem',
    rotate: '7deg',
    opacity: 0.42,
    blur: '1px',
    tone: 'warm'
  },
  {
    id: 'square-accent',
    src: '/images/home-collage/download-4.png',
    focus: '50% 52%',
    x: '71%',
    y: '71%',
    width: 'clamp(7rem, 13vw, 11rem)',
    height: 'clamp(7rem, 13vw, 11rem)',
    mobileX: '78%',
    mobileY: '67%',
    mobileWidth: '5.5rem',
    mobileHeight: '5.5rem',
    rotate: '5deg',
    opacity: 0.38,
    blur: '1.5px',
    tone: 'cool'
  },
  {
    id: 'lower-left',
    src: '/images/home-collage/download.png',
    focus: '50% 58%',
    x: '31%',
    y: '73%',
    width: 'clamp(6.5rem, 11vw, 9.5rem)',
    height: 'clamp(9rem, 16vw, 13rem)',
    mobileX: '24%',
    mobileY: '70%',
    mobileWidth: '4.75rem',
    mobileHeight: '6.8rem',
    rotate: '-5deg',
    opacity: 0.34,
    blur: '0.75px',
    tone: 'warm'
  }
];
