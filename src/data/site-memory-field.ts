export type SiteMemoryTone = 'cool' | 'warm' | 'neutral';

export interface SiteMemorySlot {
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
  delay?: string;
  duration?: string;
  tone?: SiteMemoryTone;
}

export const siteMemorySlots: SiteMemorySlot[] = [
  {
    id: 'winter-wide',
    src: '/images/home-collage/download-7.png',
    focus: '50% 58%',
    x: '48%',
    y: '64%',
    width: 'min(46vw, 42rem)',
    height: 'clamp(11rem, 20vw, 18rem)',
    mobileX: '50%',
    mobileY: '72%',
    mobileWidth: '84vw',
    mobileHeight: '9.5rem',
    rotate: '-2deg',
    opacity: 0.46,
    blur: '2px',
    delay: '-9s',
    duration: '32s',
    tone: 'cool'
  },
  {
    id: 'lamp-glow',
    src: '/images/home-collage/download-1.png',
    focus: '50% 26%',
    x: '78%',
    y: '18%',
    width: 'clamp(11rem, 18vw, 16rem)',
    height: 'clamp(15rem, 26vw, 21rem)',
    mobileX: '82%',
    mobileY: '19%',
    mobileWidth: '6.75rem',
    mobileHeight: '9.5rem',
    rotate: '8deg',
    opacity: 0.36,
    blur: '3px',
    delay: '-4s',
    duration: '26s',
    tone: 'warm'
  },
  {
    id: 'portrait-smile',
    src: '/images/home-collage/download-2.png',
    focus: '52% 34%',
    x: '16%',
    y: '25%',
    width: 'clamp(10rem, 16vw, 13rem)',
    height: 'clamp(13rem, 24vw, 17rem)',
    mobileX: '14%',
    mobileY: '24%',
    mobileWidth: '6rem',
    mobileHeight: '8.6rem',
    rotate: '-8deg',
    opacity: 0.34,
    blur: '4px',
    delay: '-12s',
    duration: '28s',
    tone: 'neutral'
  },
  {
    id: 'portrait-night',
    src: '/images/home-collage/download-3.png',
    focus: '48% 34%',
    x: '84%',
    y: '44%',
    width: 'clamp(9rem, 15vw, 12rem)',
    height: 'clamp(12rem, 22vw, 16rem)',
    mobileX: '86%',
    mobileY: '44%',
    mobileWidth: '5.75rem',
    mobileHeight: '8rem',
    rotate: '7deg',
    opacity: 0.35,
    blur: '4px',
    delay: '-16s',
    duration: '30s',
    tone: 'warm'
  },
  {
    id: 'childhood',
    src: '/images/home-collage/download-4.png',
    focus: '50% 44%',
    x: '13%',
    y: '60%',
    width: 'clamp(8rem, 13vw, 10rem)',
    height: 'clamp(11rem, 19vw, 14rem)',
    mobileX: '14%',
    mobileY: '57%',
    mobileWidth: '5.25rem',
    mobileHeight: '7.3rem',
    rotate: '-6deg',
    opacity: 0.3,
    blur: '3px',
    delay: '-7s',
    duration: '34s',
    tone: 'warm'
  },
  {
    id: 'cat',
    src: '/images/home-collage/download.png',
    focus: '50% 58%',
    x: '78%',
    y: '78%',
    width: 'clamp(8.5rem, 14vw, 11rem)',
    height: 'clamp(8rem, 13vw, 10rem)',
    mobileX: '80%',
    mobileY: '80%',
    mobileWidth: '5.6rem',
    mobileHeight: '5rem',
    rotate: '5deg',
    opacity: 0.26,
    blur: '5px',
    delay: '-19s',
    duration: '36s',
    tone: 'neutral'
  },
  {
    id: 'signal-left',
    src: '/images/home-collage/download-5.png',
    focus: '50% 48%',
    x: '4%',
    y: '48%',
    width: 'clamp(4.4rem, 6vw, 5.5rem)',
    height: 'clamp(9rem, 18vw, 16rem)',
    mobileX: '6%',
    mobileY: '48%',
    mobileWidth: '3rem',
    mobileHeight: '8rem',
    rotate: '-3deg',
    opacity: 0.16,
    blur: '7px',
    delay: '-22s',
    duration: '40s',
    tone: 'cool'
  },
  {
    id: 'signal-right',
    src: '/images/home-collage/download-6.png',
    focus: '50% 48%',
    x: '96%',
    y: '66%',
    width: 'clamp(4rem, 5.6vw, 5rem)',
    height: 'clamp(8rem, 16vw, 14rem)',
    mobileX: '94%',
    mobileY: '64%',
    mobileWidth: '2.8rem',
    mobileHeight: '7.2rem',
    rotate: '3deg',
    opacity: 0.16,
    blur: '8px',
    delay: '-27s',
    duration: '42s',
    tone: 'cool'
  }
];
