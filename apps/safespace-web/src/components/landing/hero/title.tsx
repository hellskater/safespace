import { animateTextChange } from "@/utils/encryption";
import { AnimationControls, motion } from "framer-motion";
import React, { useEffect, useMemo, useState } from "react";

export const OPACITY_DURATION = 0.06;
export const BG_DURATION = 0.15;
export const BG_DELAY = 0.3;

const textGradientStyles = {
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  textFillColor: "transparent",
};

const titleItems = [
  {
    background: "linear-gradient(264.04deg, #f14aff 15.67%, #401aff 82.95%)",
  },
  {
    background: "linear-gradient(267.19deg, #ffe600 4.02%, #fd6a00 73.58%)",
  },
  {
    background: "linear-gradient(268.85deg, #57f906 -0.04%, #00ccc0 59.56%)",
  },
] as const;

const orginalTexts = [
  "Prioritize Privacy",
  "Protect.",
  "Your.",
  "Thoughts.",
  "Now",
];

const itemVariants = {
  initial: ({ background }: { background: string }) => ({
    opacity: 0,
    ...(background && { background }),
    ...textGradientStyles,
  }),
  animate: ({
    delay,
  }: {
    delay: {
      opacity: number;
      background: number;
    };
  }) => ({
    opacity: 1,
    background: "#fff",
    WebkitTextFillColor: "black",
    textFillColor: "black",
    transition: {
      opacity: {
        duration: OPACITY_DURATION,
        delay: delay.opacity,
      },
      // make text color black
      background: { duration: BG_DURATION, delay: delay.background },
      WebkitTextFillColor: { duration: BG_DURATION, delay: delay.background },
      textFillColor: { duration: BG_DURATION, delay: delay.background },
    },
  }),
};

const Title = ({ titleControls }: { titleControls: AnimationControls }) => {
  const [texts, setTexts] = useState([
    "P1x@9z3!e Q5v#7y%", // Prioritize Privacy
    "Pl$v3hk.", // Protect.
    "m&is.", // Your.
    "z!un9stk.", // Thoughts.
    "l&x", // Now
  ]);

  const itemsWithAnimationData = useMemo(() => {
    let previousDelay = 0;
    return titleItems.map((item, index) => {
      if (index !== 0) previousDelay += OPACITY_DURATION;

      const newItem: {
        background: string;
        delay: {
          opacity: number;
          background?: number;
        };
      } = {
        ...item,
        delay: {
          opacity: previousDelay,
        },
      };

      newItem.delay.background = previousDelay + BG_DELAY;
      previousDelay += BG_DELAY + BG_DURATION;

      return newItem;
    });
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    timer = setTimeout(() => {
      texts.forEach((_, index) => {
        const handler = (val: string) => {
          setTexts((prev) => {
            const newItems = [...prev];
            newItems[index] = val;
            return newItems;
          });
        };
        timer = setTimeout(() => {
          animateTextChange(handler, orginalTexts[index]!, false);
        }, index * 1000);
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <h1 className="flex flex-col font-extrabold leading-none text-stone-800 text-2xl lg:text-3xl xl:text-4xl">
      <span className="relative z-10 w-fit mb-1.5 bg-white px-2.5 py-2.5">
        {texts[0]}
      </span>
      <span className="my-2 xl:space-x-5 bg-white text-stone-800 lg:space-x-2.5 flex flex-wrap space-x-0 px-2.5 leading-normal text-5xl lg:text-7xl xl:text-9xl">
        {itemsWithAnimationData.map(({ background, delay }, index) => (
          <motion.span
            key={index}
            dangerouslySetInnerHTML={{ __html: texts[index + 1]! }}
            initial="initial"
            variants={itemVariants}
            animate={titleControls}
            custom={{ background, delay }}
          />
        ))}
      </span>
      <span className="mt-1.5 bg-white uppercase px-2.5 py-2.5 w-fit">
        {texts[4]}
      </span>
    </h1>
  );
};

export default Title;
