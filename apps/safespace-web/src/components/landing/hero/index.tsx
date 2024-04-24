import useSize from "@react-hook/size";
import React, { useCallback, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

import drawBackground from "./draw-background";
import { useAnimation } from "framer-motion";
import Title from "./title";
import Arrow from "./arrow";

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

  const setRefs = useCallback(
    (node: HTMLDivElement) => {
      if (!node) return;
      ref.current = node;
      sectionRef(node);
    },
    [sectionRef],
  );

  useEffect(() => {
    const fn = async () => {
      if (inView) {
        await titleControls.start("animate");
        await arrowLineControls.start("animate");
        await arrowPointerControls.start("animate");
      }
    };
    fn();
  }, [titleControls, arrowLineControls, arrowPointerControls, inView]);

  useEffect(() => {
    if (inView) {
      drawBackground({ canvasRef, width, height });
    }
  }, [canvasRef, height, inView, width]);

  return (
    <section
      className="safe-paddings relative flex h-screen min-h-[748px] w-screen max-w-full items-center justify-center overflow-hidden md:min-h-[557px]"
      ref={setRefs}
    >
      <canvas className="absolute inset-0" ref={canvasRef} />
      <div className="z-10 flex flex-col sm:translate-y-[-5%]">
        <div className="relative">
          <Title titleControls={titleControls} />
          <Arrow
            arrowLineControls={arrowLineControls}
            arrowPointerControls={arrowPointerControls}
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
