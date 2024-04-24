import { AnimationControls, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useWindowSize } from "usehooks-ts";

const LG_WIDTH = 1279;
const MD_WIDTH = 1023;
const SM_WIDTH = 767;

const arrowLineVariants = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1, transition: { duration: 0.15 } },
};

const arrowPointerVariants = {
  initial: { pathLength: 0 },
  animate: { pathLength: 1, transition: { duration: 0.01 } },
};

const initialParams = {
  svgWidth: 823,
  svgHeight: 132,
  d1: "M822 0V121H0",
  d2: "M822 0V121H2",
  d3: "M14 111.5L2 121L14 130.5",
};

const Arrow = ({
  arrowPointerControls,
  arrowLineControls,
}: {
  arrowPointerControls: AnimationControls;
  arrowLineControls: AnimationControls;
}) => {
  const { width } = useWindowSize();
  const [svgParams, setSvgParams] = useState(initialParams);

  useEffect(() => {
    if (width > LG_WIDTH) {
      setSvgParams(initialParams);
    }
    if (width <= LG_WIDTH) {
      setSvgParams({
        svgWidth: 615,
        svgHeight: 101,
        d1: "M605 0V90.3687H0",
        d2: "M605 0V90.5176H2",
        d3: "M14 81.0352L2 90.5176L14 100",
      });
    }

    if (width <= MD_WIDTH) {
      setSvgParams({
        svgWidth: 414,
        svgHeight: 70,
        d1: "M404 0V60H0",
        d2: "M404 0V60H2.41718",
        d3: "M11 53L2 60.0622L11 67",
      });
    }

    if (width <= SM_WIDTH) {
      setSvgParams({
        svgWidth: 183,
        svgHeight: 180,
        d1: "M0.605713 29.0972H153.348V150.233H29.213",
        d2: "M0.605713 29.0972H153.606V150.097H34.1057",
        d3: "M43.1057 142L33.1057 150L43.1057 158",
      });
    }
  }, [width]);

  const { svgWidth, svgHeight, d1, d2, d3 } = svgParams;
  return (
    <svg
      className="absolute right-40 top-[calc(100%+0.5rem)] -z-10 lg:right-24 xl:right-10 xl:w-[800px] 2xl:right-0 2xl:w-[1000px] lg:top-full lg:h-auto lg:w-[600px] md:right-24 md:w-[400px] sm:left-48 sm:top-[calc(100%-3rem)] sm:block sm:w-[183px] xs:top-[calc(100%-2.5rem)] xs:w-[130px]"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d={d1}
        stroke="#ffffff"
        strokeWidth="20"
        initial="initial"
        variants={arrowLineVariants}
        animate={arrowLineControls}
      />
      <motion.path
        d={d2}
        stroke="black"
        strokeWidth="2"
        initial="initial"
        variants={arrowLineVariants}
        animate={arrowLineControls}
      />
      <motion.path
        d={d3}
        stroke="black"
        strokeWidth="2"
        initial="initial"
        variants={arrowPointerVariants}
        animate={arrowPointerControls}
      />
    </svg>
  );
};

export default Arrow;
