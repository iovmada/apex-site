'use client';

import { useEffect, useState } from 'react';
import AutoScroll from 'embla-carousel-auto-scroll';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';

const brands = [
  { name: 'KTM', file: 'ktm' },
  { name: 'Yamaha', file: 'yamaha' },
  { name: 'Kawasaki', file: 'kawasaki' },
  { name: 'Suzuki', file: 'suzuki' },
  { name: 'Ducati', file: 'ducati' },
  { name: 'BMW Motorrad', file: 'bmw' },
];

export default function BrandSlider({ lang }: { lang: 'en' | 'ro' }) {
  const [api, setApi] = useState<CarouselApi>();
  const [autoScroll] = useState(() =>
    AutoScroll({
      speed: 0.6,
      startDelay: 0,
      playOnInit: false,
      stopOnInteraction: false,
      stopOnMouseEnter: false,
      stopOnFocusIn: true,
      breakpoints: {
        '(prefers-reduced-motion: reduce)': { active: false },
      },
    }),
  );
  const [reducedMotion, setReducedMotion] = useState(true);
  const [pageVisible, setPageVisible] = useState(true);
  const ro = lang === 'ro';

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(motion.matches);
    const syncVisibility = () => setPageVisible(!document.hidden);
    syncMotion();
    syncVisibility();
    motion.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);
    return () => {
      motion.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
    };
  }, []);

  useEffect(() => {
    if (!api) return;
    const syncPlayback = () => {
      const plugin = api.plugins().autoScroll;
      if (!plugin) return;
      if (reducedMotion || !pageVisible) plugin.stop();
      else plugin.play();
    };
    syncPlayback();
    api.on('reInit', syncPlayback);
    return () => {
      api.off('reInit', syncPlayback);
      autoScroll.stop();
    };
  }, [api, autoScroll, reducedMotion, pageVisible]);

  return (
    <section
      className="brand-band"
      aria-label={ro ? 'Mărci moto' : 'Motorcycle brands'}
    >
      <Carousel
        className="brand-carousel"
        tabIndex={0}
        opts={{ loop: true, align: 'start', dragFree: true }}
        plugins={[autoScroll]}
        setApi={setApi}
        onFocusCapture={() => autoScroll.stop()}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget) && !reducedMotion && pageVisible)
            autoScroll.play();
        }}
        aria-label={
          ro ? 'Galerie de sigle moto' : 'Motorcycle brand logo gallery'
        }
      >
        <CarouselContent
          className="brand-track"
          aria-live="off"
        >
          {brands.map((brand) => (
            <CarouselItem className="brand-slide" key={brand.file}>
              <img
                src={`/images/brands/${brand.file}.svg`}
                alt={brand.name}
                className={`brand-logo brand-logo-${brand.file}`}
                width={180}
                height={80}
                loading="lazy"
                draggable={false}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
