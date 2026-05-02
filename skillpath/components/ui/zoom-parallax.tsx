'use client';

import { useScroll, useTransform, motion } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';
import { cn } from '@/lib/utils';

interface Image {
  src: string;
  alt?: string;
}

interface ZoomParallaxProps {
  images: Image[];
  className?: string;
}

export function ZoomParallax({ images, className }: ZoomParallaxProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  // Scale mappings: Center zooms to fill screen, others parallax out
  const scaleCenter = useTransform(scrollYProgress, [0, 1], [1, 15]);
  const scale2 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale3 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 9]);

  const scales = [scaleCenter, scale2, scale3, scale4, scale5, scale6, scale2];

  // Opacity fade for background images as they zoom past
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <div ref={container} className={cn("relative h-[300vh]", className)}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">
        {images.map(({ src, alt }, index) => {
          const scale = scales[index % scales.length];
          const isCenter = index === 0;

          return (
            <motion.div
              key={index}
              style={{ 
                scale,
                opacity: isCenter ? 1 : opacity,
                zIndex: isCenter ? 10 : 1 
              }}
              className={cn(
                "absolute top-0 flex h-full w-full items-center justify-center will-change-transform",
                index === 1 && "[&>div]:!-top-[30vh] [&>div]:!left-[15vw] [&>div]:!h-[35vh] [&>div]:!w-[25vw]",
                index === 2 && "[&>div]:!-top-[10vh] [&>div]:!-left-[30vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]",
                index === 3 && "[&>div]:!left-[35vw] [&>div]:!h-[30vh] [&>div]:!w-[20vw]",
                index === 4 && "[&>div]:!top-[35vh] [&>div]:!left-[10vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]",
                index === 5 && "[&>div]:!top-[30vh] [&>div]:!-left-[25vw] [&>div]:!h-[30vh] [&>div]:!w-[25vw]",
                index === 6 && "[&>div]:!top-[25vh] [&>div]:!left-[30vw] [&>div]:!h-[20vh] [&>div]:!w-[15vw]"
              )}
            >
              <div className={cn(
                "relative overflow-hidden shadow-2xl",
                isCenter ? "h-[30vh] w-[40vw] md:h-[40vh] md:w-[50vw]" : "h-[25vh] w-[25vw]"
              )}>
                <Image
                  src={src || '/placeholder.svg'}
                  alt={alt || `Parallax image ${index + 1}`}
                  fill
                  sizes={isCenter ? "(max-width: 768px) 50vw, 40vw" : "25vw"}
                  className="object-cover"
                  priority={isCenter}
                />
                {!isCenter && <div className="absolute inset-0 bg-black/20" />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
