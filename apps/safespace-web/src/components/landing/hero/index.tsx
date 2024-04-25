import useSize from "@react-hook/size";
import React, { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import drawBackground from "./draw-background";
import { motion, useAnimation } from "framer-motion";
import Title from "./title";
import Arrow from "./arrow";
import Link from "next/link";

const buttonGradientVariants = {
  initial: {
    opacity: 0,
  },
  animate1: {
    opacity: 1,
    transition: {
      duration: 0.03,
    },
  },
  animate2: {
    opacity: 0,
    transition: {
      duration: 0.03,
    },
  },
  animate3: {
    opacity: 1,
    transition: {
      duration: 0.06,
      delay: 0.06,
    },
  },
};

const buttonVisibilityVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const Hero = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [sectionRef, inView] = useInView({
    triggerOnce: true,
  });
  const [width, height] = useSize(ref);
  const titleControls = useAnimation();
  const arrowLineControls = useAnimation();
  const arrowPointerControls = useAnimation();
  const buttonGradientControls = useAnimation();
  const buttonVisibilityControls = useAnimation();

  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      if (!node) return;
      ref.current = node;
      sectionRef(node);
    },
    [sectionRef],
  );

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    const fn = async () => {
      if (inView) {
        await titleControls.start("animate");
        timer = setTimeout(async () => {
          await buttonVisibilityControls.start("visible");
          await arrowLineControls.start("animate");
          await arrowPointerControls.start("animate");
          await buttonGradientControls.start("animate1");
          await buttonGradientControls.start("animate2");
          await buttonGradientControls.start("animate3");
        }, 4500);
      }
    };
    fn();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    titleControls,
    arrowLineControls,
    arrowPointerControls,
    buttonGradientControls,
    buttonVisibilityControls,
    inView,
  ]);

  useEffect(() => {
    if (inView) {
      drawBackground({ canvasRef, width, height });
    }
  }, [canvasRef, height, inView, width]);

  return (
    <section
      className="safe-paddings relative flex h-screen w-screen max-w-full items-center justify-center overflow-hidden p-5"
      ref={setRefs}
    >
      <canvas className="absolute inset-0" ref={canvasRef} />
      <div className="z-10 flex flex-col mt-40">
        <div className="relative">
          <Title titleControls={titleControls} />
          <div className="hidden xl:flex">
            <Arrow
              arrowLineControls={arrowLineControls}
              arrowPointerControls={arrowPointerControls}
            />
          </div>
        </div>

        <motion.div
          initial="hidden"
          animate={buttonVisibilityControls}
          variants={buttonVisibilityVariants}
          className="w-fit bg-white p-2.5 mt-14"
        >
          <Link
            className="relative inline-flex items-center bg-black text-white px-[60px] py-[26px] text-[22px] font-semibold leading-none transition-colors duration-200 lg:py-6 lg:px-16 lg:text-lg lg:leading-none md:py-4.5 md:px-12"
            href="/login"
          >
            <span>Try it Now</span>
            <motion.span
              className="group absolute top-0 left-0 right-0 bottom-0 flex h-full w-full items-center justify-center text-white"
              style={{
                backgroundImage:
                  "linear-gradient(330deg, #D4AF37 0%, #FCC201 100%)",
              }}
              initial="initial"
              animate={buttonGradientControls}
              variants={buttonGradientVariants}
            >
              <span className="relative z-10 transition-colors group-hover:text-white">
                Try it!
              </span>
              <span className="absolute top-0 left-0 bottom-0 right-0 bg-black opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
