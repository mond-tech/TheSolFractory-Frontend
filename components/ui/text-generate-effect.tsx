"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate, useInView } from "motion/react";
import { cn } from "@/lib/utils";

type Line = {
  text: string;
  dot: string;
};

interface TextGenerateEffectProps {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: TextGenerateEffectProps) => {
  const [scope, animate] = useAnimate();

  const isInView = useInView(scope, {
    amount: 0.6,
  });

  /* Split sentences and keep dots */
  const lines: Line[] = words
    .split(".")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => ({
      text: line,
      dot: ".",
    }));

  useEffect(() => {
    animate(
      "span",
      {
        opacity: isInView ? 1 : 0,
        filter: filter ? (isInView ? "blur(0px)" : "blur(10px)") : "none",
      },
      {
        duration,
        delay: stagger(0.15),
      }
    );
  }, [isInView, animate, duration, filter]);

  return (
    <div className={cn("font-bold", className)}>
      <motion.div
        ref={scope}
        className="text-[#00167a] text-3xl md:text-4xl font-extrabold leading-snug tracking-wide text-center"
      >
        <div className="flex flex-col items-center">

          {/* First row (first two sentences on desktop) */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-center">

            {lines.slice(0, 2).map((lineObj, lineIndex) => {
              const wordsInLine = lineObj.text.split(" ");

              return (
                <div
                  key={lineIndex}
                  className="flex flex-wrap justify-center md:mr-3"
                >
                  {wordsInLine.map((word, wordIndex) => {
                    const isLastWord =
                      wordIndex === wordsInLine.length - 1;

                    return (
                      <motion.span
                        key={word + wordIndex}
                        className="dark:text-white text-[#0a3e8c] opacity-0 inline-block font-extrabold"
                        style={{
                          filter: filter ? "blur(10px)" : "none",
                          fontFamily: "Satoshi, sans-serif",
                          WebkitTextStroke: "1px rgba(255,255,255,0.3)",
                        }}
                      >
                        {word}
                        {isLastWord && lineObj.dot}
                        &nbsp;
                      </motion.span>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Second row (third sentence) */}
          {lines[2] && (
            <div className="flex justify-center md:mt-2 mt-4">

              {lines[2].text.split(" ").map((word, wordIndex, arr) => {
                const isLastWord = wordIndex === arr.length - 1;

                return (
                  <motion.span
                    key={word + wordIndex}
                    className=" text-[#0a3e8c] opacity-0 inline-block drop-shadow-lg dark:bg-neutral-900 dark:shadow-sm dark:ring-1 dark:shadow-white/10 dark:ring-white/10 drop-shadow-white"
                    style={{
                      filter: filter ? "blur(10px)" : "none",
                      fontFamily: "Satoshi, sans-serif",
                      WebkitTextStroke: "1px rgba(255,255,255,0.3)",
                    }}
                  >
                    {word}
                    {isLastWord && "."}
                    &nbsp;
                  </motion.span>
                );
              })}

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};