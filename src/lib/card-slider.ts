type CardSliderOptions = {
  slider: HTMLElement;
  slides: HTMLElement[];
  dots?: HTMLElement[];
  abortKey?: string;
  gap?: number;
  enableWheel?: boolean;
  getInitialIndex?: () => number;
  onIndexChange?: (index: number) => void;
  isActive?: () => boolean;
  onDragStateChange?: (dragging: boolean) => void;
  onInteraction?: () => void;
};

type CardSliderController = {
  abort: () => void;
  getCurrentIndex: () => number;
  snapToSlide: (index: number, animated?: boolean) => void;
  refresh: (animated?: boolean) => void;
};

type SliderWindow = Window & Record<string, AbortController | undefined>;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function initCardSlider(options: CardSliderOptions): CardSliderController | null {
  const {
    slider,
    slides,
    dots = [],
    abortKey,
    gap = 0,
    enableWheel = false,
    getInitialIndex = () => 0,
    onIndexChange = () => {},
    isActive = () => true,
    onDragStateChange = () => {},
    onInteraction = () => {},
  } = options;

  if (!slider || slides.length < 2) return null;

  const maxIndex = slides.length - 1;
  const sliderWindow = window as SliderWindow;

  if (abortKey && sliderWindow[abortKey]) {
    sliderWindow[abortKey]?.abort();
  }

  const controller = new AbortController();
  const listenerOptions = { signal: controller.signal };

  if (abortKey) {
    sliderWindow[abortKey] = controller;
  }

  let currentIndex = clamp(getInitialIndex(), 0, maxIndex);
  let activePointerId: number | null = null;
  let dragStarted = false;
  let dragIntent = false;
  let startPointerX = 0;
  let startPointerY = 0;
  let startScrollLeft = 0;
  let wheelLock: number | null = null;

  const getSlideWidth = () => Math.max(slider.clientWidth + gap, 1);

  const updateDots = (activeIndex = currentIndex) => {
    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle('is-active', dotIndex === activeIndex);
      dot.setAttribute('aria-pressed', String(dotIndex === activeIndex));
    });
  };

  const update3DEffect = () => {
    if (!slider.clientWidth) return;

    const scrollLeft = slider.scrollLeft;
    const slideWidth = getSlideWidth();

    slides.forEach((slide, index) => {
      const offset = (index * slideWidth - scrollLeft) / slideWidth;

      if (Math.abs(offset) < 2) {
        const rotation = -22 * offset;
        const scale = 1 - 0.08 * Math.abs(offset);
        const opacity = 1 - 0.42 * Math.abs(offset);
        slide.style.transform = `perspective(1000px) rotateY(${rotation}deg) scale(${scale})`;
        slide.style.opacity = `${Math.max(0.48, opacity)}`;
        slide.style.zIndex = `${10 - Math.abs(Math.round(offset))}`;
      } else {
        slide.style.transform = 'perspective(1000px) rotateY(0deg) scale(0.98)';
        slide.style.opacity = '0';
        slide.style.zIndex = '0';
      }
    });
  };

  const animateTo = (targetLeft: number) => {
    const startLeft = slider.scrollLeft;
    const distance = targetLeft - startLeft;
    const duration = 220;
    let startTime: number | null = null;

    const tick = (now: number) => {
      if (startTime === null) startTime = now;

      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      slider.scrollLeft = startLeft + distance * eased;
      update3DEffect();

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  const syncIndex = (index: number) => {
    if (index !== currentIndex) {
      currentIndex = index;
      onIndexChange(index);
    }

    updateDots(index);
  };

  const snapToSlide = (index: number, animated = true) => {
    const nextIndex = clamp(index, 0, maxIndex);
    const targetLeft = nextIndex * getSlideWidth();

    syncIndex(nextIndex);

    if (animated) {
      animateTo(targetLeft);
    } else {
      slider.scrollLeft = targetLeft;
    }

    update3DEffect();
  };

  const finishDrag = () => {
    if (activePointerId === null) return;

    if (dragStarted) {
      const moved = slider.scrollLeft - currentIndex * getSlideWidth();
      const threshold = getSlideWidth() * 0.15;

      if (moved > threshold) snapToSlide(currentIndex + 1);
      else if (moved < -threshold) snapToSlide(currentIndex - 1);
      else snapToSlide(currentIndex);

      onInteraction();
      onDragStateChange(false);
    }

    slider.releasePointerCapture?.(activePointerId);
    activePointerId = null;
    dragStarted = false;
    dragIntent = false;
    slider.classList.remove('is-dragging');
  };

  slider.addEventListener(
    'pointerdown',
    (event: PointerEvent) => {
      if (!isActive()) return;
      if (event.button !== 0 && event.pointerType === 'mouse') return;

      activePointerId = event.pointerId;
      startPointerX = event.clientX;
      startPointerY = event.clientY;
      startScrollLeft = slider.scrollLeft;
      dragStarted = false;
      dragIntent = false;
      slider.setPointerCapture?.(event.pointerId);
    },
    listenerOptions,
  );

  slider.addEventListener(
    'pointermove',
    (event: PointerEvent) => {
      if (!isActive() || activePointerId !== event.pointerId) return;

      const deltaX = event.clientX - startPointerX;
      const deltaY = event.clientY - startPointerY;

      if (!dragIntent) {
        if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) return;
        if (Math.abs(deltaX) <= Math.abs(deltaY)) return;

        dragIntent = true;
        dragStarted = true;
        slider.classList.add('is-dragging');
        onDragStateChange(true);
        onInteraction();
      }

      event.preventDefault();
      slider.scrollLeft = startScrollLeft - deltaX;
      update3DEffect();
    },
    { passive: false, ...listenerOptions },
  );

  slider.addEventListener('pointerup', finishDrag, listenerOptions);
  slider.addEventListener('pointercancel', finishDrag, listenerOptions);
  slider.addEventListener('lostpointercapture', finishDrag, listenerOptions);

  slider.addEventListener(
    'scroll',
    () => {
      if (dragStarted) return;

      update3DEffect();
      const realIndex = clamp(Math.round(slider.scrollLeft / getSlideWidth()), 0, maxIndex);
      syncIndex(realIndex);
    },
    listenerOptions,
  );

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener(
      'click',
      () => {
        if (!isActive()) return;
        onInteraction();
        snapToSlide(dotIndex);
      },
      listenerOptions,
    );
  });

  document.addEventListener(
    'keydown',
    (event: KeyboardEvent) => {
      if (!isActive()) return;

      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select')) return;

      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        onInteraction();
        snapToSlide(currentIndex + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onInteraction();
        snapToSlide(currentIndex - 1);
      }
    },
    listenerOptions,
  );

  if (enableWheel) {
    slider.addEventListener(
      'wheel',
      (event: WheelEvent) => {
        if (!isActive()) return;
        if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) <= 30) {
          return;
        }

        event.preventDefault();
        if (wheelLock) return;

        wheelLock = window.setTimeout(() => {
          wheelLock = null;
        }, 300);

        onInteraction();

        if (event.deltaX > 0) snapToSlide(currentIndex + 1);
        else snapToSlide(currentIndex - 1);
      },
      { passive: false, ...listenerOptions },
    );
  }

  snapToSlide(currentIndex, false);

  return {
    abort: () => controller.abort(),
    getCurrentIndex: () => currentIndex,
    snapToSlide,
    refresh: (animated = false) => {
      snapToSlide(currentIndex, animated);
    },
  };
}
