import { AnimationControls, motion } from "framer-motion";
import React, { useMemo } from "react";

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
    value: "Protect.",
    background: "linear-gradient(264.04deg, #f14aff 15.67%, #401aff 82.95%)",
  },
  {
    value: "Your.",
    background: "linear-gradient(267.19deg, #ffe600 4.02%, #fd6a00 73.58%)",
  },
  {
    value: "Thoughts.",
    background: "linear-gradient(268.85deg, #57f906 -0.04%, #00ccc0 59.56%)",
  },
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
  const itemsWithAnimationData = useMemo(() => {
    let previousDelay = 0;
    return titleItems.map((item, index) => {
      if (index !== 0) previousDelay += OPACITY_DURATION;

      const newItem: {
        value: string;
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

  return (
    <h1 className="flex flex-col text-[38px] font-extrabold uppercase leading-none text-stone-800 lg:text-3xl lg:leading-none md:text-2xl md:leading-none sm:text-[22px] sm:leading-none">
      <span className="relative z-10 mr-auto mb-1.5 bg-white px-2.5 py-2.5 sm:px-4">
        Prioritize Privacy
      </span>
      <motion.span
        className="-my-1.5 space-x-5 bg-white text-[8.6rem] text-stone-800 lg:space-x-2.5 lg:text-[106px] md:text-[80px] sm:flex sm:flex-wrap sm:space-x-0 sm:px-4 sm:text-[68px] xs:text-6xl xs:leading-none"
        initial="initial"
      >
        {itemsWithAnimationData.map(({ value, background, delay }, index) => (
          <motion.span
            key={index}
            dangerouslySetInnerHTML={{ __html: value }}
            initial="initial"
            variants={itemVariants}
            animate={titleControls}
            custom={{ background, delay }}
          />
        ))}
      </motion.span>
      <span className="mt-1.5 bg-white px-2.5 py-2.5 sm:mr-auto sm:ml-0 sm:px-4">
        NOW
      </span>
    </h1>
  );
};

export default Title;
