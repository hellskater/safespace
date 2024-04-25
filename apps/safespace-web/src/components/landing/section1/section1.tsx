/* eslint-disable @next/next/no-img-element */
import { animateTextChange } from "@/utils/encryption";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const originalText = `A safe space for all your thoughts and ideas, with out worrying about
privacy. Your notes are encrypted and only you can read them.`;

const Section1 = () => {
  const [text, setText] = useState("");

  const [ref, inView] = useInView();

  const isAlreadyViewed = useRef(false);

  useEffect(() => {
    if (inView && !isAlreadyViewed.current) {
      animateTextChange(setText, originalText, true);
      isAlreadyViewed.current = true;
    }
  }, [inView]);

  return (
    <div className="safe-paddings pt-48 pb-24 lg:pt-40 md:pt-32">
      <div className="container flex flex-col h-full items-center justify-center">
        <div
          onMouseOver={() => {
            animateTextChange(setText, originalText, false);
          }}
          onMouseOut={() => {
            animateTextChange(setText, originalText, true);
          }}
          ref={ref}
          className="relative"
        >
          <h2 className="heading-2xl md:heading-6xl flat-none lg:flat-breaks">
            {text}
          </h2>
        </div>

        <img
          src="https://nordvpn.com/wp-content/uploads/blog-featured-end-to-end-encryption-945x495-1.svg"
          alt="encryption gif"
          className="w-full h-full mt-32 object-cover"
        />

        <h2 className="heading-2xl md:heading-6xl flat-none mt-32 lg:flat-breaks with-orange-gradient-text">
          Thanks to <span>Pangea's Vault service</span>, SafeSpace encrypts your
          notes with end-to-end encryption. This means that your notes never
          leave your device unencrypted. Not even we can read them.
        </h2>
      </div>
    </div>
  );
};

export default Section1;
