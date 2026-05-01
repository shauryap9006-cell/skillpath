'use client';

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export function BlurText({ text, className, style }: BlurTextProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const words = text.split(" ");

  return (
    <p
      ref={ref}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        rowGap: "0.1em",
        ...style
      }}
      className={className}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={
            inView
              ? { filter: "blur(0px)", opacity: 1, y: 0 }
              : { filter: "blur(10px)", opacity: 0, y: 50 }
          }
          transition={{
            duration: 0.7,
            delay: (i * 100) / 1000,
            ease: "easeOut",
            times: [0, 0.5, 1],
          }}
          style={{
            display: "inline-block",
            marginRight: "0.28em",
          }}
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}
